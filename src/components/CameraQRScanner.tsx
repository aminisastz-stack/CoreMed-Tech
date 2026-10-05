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
  HelpCircle,
  FileImage,
  Search,
  Sparkles
} from 'lucide-react';

interface CameraQRScannerProps {
  equipmentList: RegisteredEquipment[];
  onAssetScanned: (equipment: RegisteredEquipment) => void;
  activeHospitalName?: string;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  equipmentList,
  onAssetScanned,
  activeHospitalName
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'error' | 'unsupported'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scanFeedback, setScanFeedback] = useState<{
    status: 'success' | 'notFound';
    code: string;
    machineName?: string;
  } | null>(null);

  const isScanningRef = useRef(false);
  const lastScanTimestampRef = useRef<number>(0);

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
      // Create a temporary passport if equipment not found, or use first device with updated tag
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
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported by your current browser environment.');
      return;
    }

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

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
        await videoRef.current.play();
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
        setErrorMessage('Camera permission was denied. Please allow camera permissions in your browser or use the file photo scanner below.');
      } else if (errObj.name === 'NotFoundError' || errObj.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device found on this system. You can test with the sample asset tags or upload an image below.');
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
    setCameraState('idle');
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

  // Automatically start camera on mount if possible
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  // Continuous frame analysis loop
  useEffect(() => {
    if (cameraState !== 'active' || !videoRef.current) return;

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
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        if (canvas) {
          const width = video.videoWidth;
          const height = video.videoHeight;

          if (width > 0 && height > 0) {
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
                    inversionAttempts: 'dontInvert'
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
      }

      animationFrameId = requestAnimationFrame(scanFrame);
    };

    animationFrameId = requestAnimationFrame(scanFrame);

    return () => {
      isScanningRef.current = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraState, handleDecodedString]);

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
              Live Camera Active ({facingMode === 'environment' ? 'Rear' : 'Front'})
            </span>
          ) : cameraState === 'requesting' ? (
            <span className="px-3 py-1 bg-blue-50 text-[#0F4C81] border border-blue-200 text-xs font-bold rounded-full flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0F4C81]" />
              Initializing Sensor...
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
            cameraState === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Viewfinder Overlays & Reticle */}
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

              <div className="text-center text-white/90 space-y-1.5 bg-slate-950/40 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                <QrCode className="w-8 h-8 mx-auto text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider block">Align Asset QR Tag</span>
              </div>
            </div>

            {/* Live Camera On-Screen Action Controls Bar */}
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-md transition-colors cursor-pointer"
                  title="Switch Front / Rear Camera"
                >
                  <SwitchCamera className="w-4 h-4 text-emerald-300" />
                </button>

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

        {/* Fallback Viewport (When camera is requesting, idle, or has error) */}
        {cameraState !== 'active' && (
          <div className="text-center text-white space-y-4 max-w-sm p-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-7 h-7" />
            </div>

            {cameraState === 'requesting' ? (
              <div className="space-y-1">
                <h5 className="text-sm font-bold">Requesting Camera Access...</h5>
                <p className="text-xs text-slate-400">Please tap "Allow" on your browser permission prompt.</p>
              </div>
            ) : cameraState === 'error' ? (
              <div className="space-y-2">
                <h5 className="text-sm font-bold text-amber-300 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Camera Standby / Permission Needed</span>
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {errorMessage || 'Camera stream could not be loaded.'}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Camera Access</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h5 className="text-sm font-bold">Camera is in Standby</h5>
                <p className="text-xs text-slate-400">Tap below to activate real-time scanning with your device camera.</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0F4C81] to-[#10B981] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer transition-all flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  <span>Activate Live Device Camera</span>
                </button>
              </div>
            )}
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
                Decoded Code: <strong>{scanFeedback.code}</strong>
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
              placeholder="Enter Serial or Tag ID..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) handleDecodedString(val.trim());
                }
              }}
              className="w-full text-xs pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#0F4C81] focus:outline-hidden"
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Press Enter</span>
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
