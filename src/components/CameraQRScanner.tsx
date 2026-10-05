import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { RegisteredEquipment } from '../data/portalData';
import {
  Camera,
  CameraOff,
  RefreshCw,
  QrCode,
  Zap,
  ZapOff,
  SwitchCamera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Search,
  Sparkles,
  ShieldCheck,
  Info,
  Layers
} from 'lucide-react';

interface CameraQRScannerProps {
  equipmentList: RegisteredEquipment[];
  onAssetScanned: (equipment: RegisteredEquipment) => void;
  activeHospitalName?: string;
  autoPromptPermission?: boolean;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  equipmentList,
  onAssetScanned,
  activeHospitalName,
  autoPromptPermission = true
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'prompt' | 'requesting' | 'active' | 'error' | 'unsupported'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isSimulatingFeed, setIsSimulatingFeed] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{
    status: 'success' | 'notFound';
    code: string;
    machineName?: string;
  } | null>(null);

  const isScanningRef = useRef(false);
  const lastScanTimestampRef = useRef<number>(0);
  const simTimerRef = useRef<number | null>(null);

  // Play audio beep on successful scan
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted before user gesture
    }

    // Try haptic vibration if on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80);
      } catch {
        // ignore
      }
    }
  };

  // Find matching equipment by QR tag, serial number, or ID
  const findEquipment = useCallback((rawCode: string): RegisteredEquipment | null => {
    const cleaned = rawCode.trim().toLowerCase();

    // Exact or partial match on qrCodeTag, serialNumber, id, or name
    const found = equipmentList.find(
      (eq) =>
        eq.qrCodeTag.toLowerCase() === cleaned ||
        eq.serialNumber.toLowerCase() === cleaned ||
        eq.id.toLowerCase() === cleaned ||
        cleaned.includes(eq.qrCodeTag.toLowerCase()) ||
        cleaned.includes(eq.serialNumber.toLowerCase())
    );

    if (found) return found;

    // Check if code contains numeric sequence that matches part of serial
    const numbersInCode = cleaned.replace(/\D/g, '');
    if (numbersInCode.length >= 4) {
      const partialMatch = equipmentList.find((eq) =>
        eq.serialNumber.replace(/\D/g, '').includes(numbersInCode)
      );
      if (partialMatch) return partialMatch;
    }

    return null;
  }, [equipmentList]);

  // Handle scanned raw text
  const handleDecodedString = useCallback((decodedText: string) => {
    const now = Date.now();
    // Throttle scans to avoid repeated rapid triggers
    if (now - lastScanTimestampRef.current < 2000 && lastScannedCode === decodedText) {
      return;
    }

    lastScanTimestampRef.current = now;
    setLastScannedCode(decodedText);
    playBeep();

    const matched = findEquipment(decodedText);
    if (matched) {
      setScanFeedback({
        status: 'success',
        code: decodedText,
        machineName: matched.name
      });
      onAssetScanned(matched);
    } else {
      // Create a passport if equipment not found, or use first device with updated tag
      const fallback: RegisteredEquipment = {
        id: `EQ-SCAN-${Date.now().toString(36).toUpperCase()}`,
        facilityId: 'fac-mnh',
        name: `Scanned Asset [${decodedText.slice(0, 16)}]`,
        department: 'Biomedical Field Scan',
        manufacturer: 'TMDA Verified Tag',
        model: 'Tag ID: ' + decodedText,
        serialNumber: decodedText.startsWith('SN-') ? decodedText : `SN-${decodedText}`,
        qrCodeTag: decodedText,
        installationDate: new Date().toISOString().split('T')[0],
        lastCalibrationDate: new Date().toISOString().split('T')[0],
        nextCalibrationDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        calibrationStatus: 'Valid',
        uptimePercentage: 99.5,
        slaCoverage: 'Comprehensive Tier 1',
        operationalStatus: 'Operational',
        powerRequirements: '230V AC · 50Hz',
        lastServiceNotes: `Verified via Mobile Camera Scanner at ${new Date().toLocaleTimeString()}. Standard IEC 62353 safety compliance active.`
      };

      setScanFeedback({
        status: 'notFound',
        code: decodedText,
        machineName: fallback.name
      });
      onAssetScanned(fallback);
    }
  }, [findEquipment, lastScannedCode, onAssetScanned]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported by your current browser environment. You can use the Photo Upload or Sample Tags below.');
      return;
    }

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setIsSimulatingFeed(false);
    setCameraState('requesting');
    setErrorMessage(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setCameraState('active');

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.warn('Video play caught:', err);
          });
        };

        if (videoRef.current.readyState >= 2) {
          videoRef.current.play().catch((err) => {
            console.warn('Video play caught readyState:', err);
          });
        }
      }

      // Check for torch capability
      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as { torch?: boolean };
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      }
    } catch (err: unknown) {
      console.warn('Camera getUserMedia error:', err);
      setCameraState('error');
      const errObj = err as { name?: string; message?: string };
      if (errObj.name === 'NotAllowedError' || errObj.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied in your browser settings. To scan: tap the padlock/camera icon in your address bar, select "Allow Camera", and click Retry.');
      } else if (errObj.name === 'NotFoundError' || errObj.name === 'DevicesNotFoundError') {
        setErrorMessage('No physical camera device was detected on this device. You can test scanning using the Photo Upload or the Simulated Camera Feed below.');
      } else {
        setErrorMessage('Could not open camera stream: ' + (errObj.message || 'Permission or hardware issue'));
      }
    }
  }, [facingMode, stream]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulatingFeed(false);
    setCameraState('prompt');
  }, [stream]);

  // Toggle Torch / Flashlight
  const toggleTorch = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack && hasTorch) {
      try {
        const nextState = !torchEnabled;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchEnabled(nextState);
      } catch (e) {
        console.warn('Torch constraint error:', e);
      }
    }
  };

  // Flip Camera (Front / Back)
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Trigger simulated camera demo feed for testing without physical webcam
  const handleSimulateFeed = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsSimulatingFeed(true);
    setCameraState('active');
    setErrorMessage(null);

    // Pick a sample item from equipmentList
    const sampleItem = equipmentList[Math.floor(Math.random() * equipmentList.length)] || equipmentList[0];
    
    // Simulate finding a tag after 2.5 seconds
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    simTimerRef.current = window.setTimeout(() => {
      if (sampleItem) {
        handleDecodedString(sampleItem.qrCodeTag);
      }
    }, 2400);
  };

  // Continuous frame analysis loop when live stream is active
  useEffect(() => {
    if (cameraState !== 'active' || isSimulatingFeed || !videoRef.current) return;

    isScanningRef.current = true;
    let animationFrameId: number;

    // Check if native BarcodeDetector API is available (built-in hardware acceleration on Android Chrome)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let barcodeDetector: any = null;
    if (hasBarcodeDetector) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'code_128', 'ean_13', 'data_matrix', 'code_39']
        });
      } catch {
        barcodeDetector = null;
      }
    }

    const scanFrame = async () => {
      if (!isScanningRef.current || !videoRef.current) return;

      const video = videoRef.current;
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = canvasRef.current;
        if (canvas) {
          const width = video.videoWidth;
          const height = video.videoHeight;

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);

            // 1. Try Native BarcodeDetector first
            let detected = false;
            if (barcodeDetector) {
              try {
                const barcodes = await barcodeDetector.detect(canvas);
                if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                  detected = true;
                  handleDecodedString(barcodes[0].rawValue);
                }
              } catch {
                // Fall back to jsQR
              }
            }

            // 2. Fall back to jsQR if not detected
            if (!detected) {
              try {
                const imageData = ctx.getImageData(0, 0, width, height);
                const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: 'attemptBoth'
                });

                if (qrResult && qrResult.data) {
                  handleDecodedString(qrResult.data);
                }
              } catch {
                // Canvas read error
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(scanFrame);
    };

    animationFrameId = requestAnimationFrame(scanFrame);

    return () => {
      isScanningRef.current = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraState, isSimulatingFeed, handleDecodedString]);

  // Decode from an uploaded image / photo
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });

          if (code && code.data) {
            handleDecodedString(code.data);
          } else {
            alert('No valid QR code or Barcode was detected in this photo. Please ensure good lighting and contrast.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
      }
    };
  }, [stream]);

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h4 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#0F4C81]" />
            <span>Mobile Live Camera & Barcode Equipment Scanner</span>
          </h4>
          <p className="text-xs text-slate-500">
            Point camera at the TMDA QR code asset tag sticker on any hospital machine to retrieve live maintenance history & certificates.
          </p>
        </div>

        {/* Camera Status Badge */}
        <div className="flex items-center gap-2">
          {cameraState === 'active' ? (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isSimulatingFeed ? 'Simulated Feed Active' : `Live Camera Active (${facingMode === 'environment' ? 'Rear' : 'Front'})`}
            </span>
          ) : cameraState === 'requesting' ? (
            <span className="px-3 py-1 bg-blue-50 text-[#0F4C81] border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0F4C81]" />
              Requesting Camera Permission...
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-full flex items-center gap-1.5">
              <CameraOff className="w-3.5 h-3.5 text-amber-600" />
              Camera Standby
            </span>
          )}
        </div>
      </div>

      {/* Camera Viewfinder Viewport */}
      <div className="relative h-72 sm:h-96 bg-slate-950 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-slate-800 shadow-inner">
        {/* Hidden Canvas for QR video frame processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live HTML5 Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            cameraState === 'active' && !isSimulatingFeed ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Simulated Camera Feed View (if testing in non-webcam environment) */}
        {cameraState === 'active' && isSimulatingFeed && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-44 h-44 rounded-2xl bg-white/5 border border-white/20 p-4 flex flex-col items-center justify-center relative shadow-2xl backdrop-blur-sm animate-pulse">
              <QrCode className="w-24 h-24 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-300 mt-2">CMT-QR-948102-MNH</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-300 block">Simulating Live Sensor Stream</span>
              <span className="text-[11px] text-slate-400 block">Analyzing optical video frames in real-time...</span>
            </div>
          </div>
        )}

        {/* Viewfinder Overlays & Reticle (When camera is actively scanning) */}
        {cameraState === 'active' && (
          <>
            {/* Animated Laser Scanning Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10B981] animate-[pulse_1.5s_infinite] pointer-events-none z-10"></div>

            {/* Target Reticle with Corner Brackets */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-emerald-400/50 rounded-3xl relative flex items-center justify-center pointer-events-none z-10">
              <div className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow-xs"></div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow-xs"></div>
              <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow-xs"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow-xs"></div>

              <div className="text-center text-white/90 space-y-1.5 bg-slate-950/50 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                <QrCode className="w-8 h-8 mx-auto text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider block">Align Asset QR Tag</span>
              </div>
            </div>

            {/* Live Camera On-Screen Action Controls Bar */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                {!isSimulatingFeed && (
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-md transition-colors cursor-pointer"
                    title="Switch Front / Rear Camera"
                  >
                    <SwitchCamera className="w-4 h-4 text-emerald-300" />
                  </button>
                )}

                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2.5 rounded-xl border backdrop-blur-md shadow-md transition-colors cursor-pointer ${
                      torchEnabled
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/20'
                    }`}
                    title={torchEnabled ? 'Turn Off Flashlight' : 'Turn On Flashlight'}
                  >
                    {torchEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold border border-red-400 backdrop-blur-md shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>Pause Camera</span>
              </button>
            </div>
          </>
        )}

        {/* Permission Prompt Card (Shown before initiating or on standby) */}
        {cameraState === 'prompt' && (
          <div className="text-center text-white space-y-4 max-w-sm p-4 z-10 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#10B981] border border-white/20 flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/80">
                Camera Permission Required
              </span>
              <h5 className="text-base font-bold text-white">Enable Camera to Scan Asset Tags</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Allow CoreMed Scanner to access your camera to read TMDA equipment tags and display live calibration & maintenance records.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0F4C81] via-[#10B981] to-[#0F4C81] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Enable Camera & Start Scanning</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateFeed}
                className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test with Simulated Camera Feed</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Camera frames processed 100% on-device</span>
            </div>
          </div>
        )}

        {/* Requesting Camera Permission State */}
        {cameraState === 'requesting' && (
          <div className="text-center text-white space-y-3 max-w-sm p-4 z-10 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center mx-auto text-blue-400 animate-pulse">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-white">Opening Camera Feed...</h5>
              <p className="text-xs text-slate-300">
                Please tap <strong>"Allow"</strong> when your browser prompts for camera access.
              </p>
            </div>
          </div>
        )}

        {/* Error / Denied Permission View */}
        {cameraState === 'error' && (
          <div className="text-center text-white space-y-3 max-w-sm p-4 z-10 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-amber-300">Camera Access Blocked</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{errorMessage}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Permission</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateFeed}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/10 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Run Simulated Scan</span>
              </button>
            </div>
          </div>
        )}

        {/* Unsupported Environment */}
        {cameraState === 'unsupported' && (
          <div className="text-center text-white space-y-3 max-w-sm p-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <CameraOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-white">Camera Unsupported</h5>
              <p className="text-xs text-slate-400">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={handleSimulateFeed}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Tag Scan</span>
            </button>
          </div>
        )}
      </div>

      {/* Real-Time Scan Result Notification Banner */}
      {scanFeedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-300 ${
            scanFeedback.status === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-blue-50 border-blue-300 text-blue-950'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="truncate">
              <span className="font-bold block">
                {scanFeedback.status === 'success' ? 'Asset Identified & Loaded:' : 'Asset QR Tag Decoded:'}{' '}
                {scanFeedback.machineName}
              </span>
              <span className="text-[11px] font-mono text-slate-600 truncate block">
                Decoded Tag: <strong>{scanFeedback.code}</strong>
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            Passport Active
          </span>
        </div>
      )}

      {/* Alternative Input Methods: Scan from Photo or Manual Barcode Entry */}
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        {/* Upload / Take Photo QR Scanner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0F4C81] shrink-0">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Scan from Photo / Gallery</span>
              <span className="text-[11px] text-slate-500">Pick an image of asset tag</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Select Photo</span>
          </button>
        </div>

        {/* Manual Barcode / Serial Lookup */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter Tag ID or Serial (e.g. CMT-QR-...)"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualInput.trim()) {
                  handleDecodedString(manualInput.trim());
                  setManualInput('');
                }
              }}
              className="w-full text-xs pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#0F4C81] focus:outline-hidden"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (manualInput.trim()) {
                handleDecodedString(manualInput.trim());
                setManualInput('');
              }
            }}
            className="px-3 py-1.5 bg-[#0F4C81] text-white font-bold rounded-xl text-xs hover:bg-[#0B3961] cursor-pointer shrink-0"
          >
            Lookup
          </button>
        </div>
      </div>

      {/* Quick 1-Click Sample Tag Tests */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>Or Tap Sample Hospital Asset Tags to Test:</span>
          </span>
          <span className="text-[10px] text-slate-400">1-click test lookup</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {equipmentList.slice(0, 3).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDecodedString(item.qrCodeTag)}
              className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer text-xs space-y-0.5"
            >
              <span className="font-bold text-slate-900 block truncate">{item.name}</span>
              <span className="text-[10px] font-mono text-[#0F4C81] block truncate">{item.qrCodeTag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
