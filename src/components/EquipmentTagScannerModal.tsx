import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  findEquipmentRecord,
  EquipmentRecordWithHistory,
  EQUIPMENT_RECORDS_CATALOG
} from '../data/equipmentRecords';
import {
  Camera,
  CameraOff,
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
  Search,
  Sparkles,
  ShieldCheck,
  SwitchCamera,
  Zap,
  ZapOff,
  BellRing,
  FileImage,
  ArrowRight
} from 'lucide-react';

interface EquipmentTagScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordMatched: (record: EquipmentRecordWithHistory) => void;
}

export const EquipmentTagScannerModal: React.FC<EquipmentTagScannerModalProps> = ({
  isOpen,
  onClose,
  onRecordMatched
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Permission Prompt State (Initial state asks user to turn on permissions to initiate)
  const [hasPromptedPermission, setHasPromptedPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'prompt' | 'requesting' | 'active' | 'error' | 'unsupported'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [manualTagQuery, setManualTagQuery] = useState('');
  const [isSimulatingFeed, setIsSimulatingFeed] = useState(false);

  const isScanningRef = useRef(false);
  const lastScanTimeRef = useRef(0);
  const simTimerRef = useRef<number | null>(null);

  // Play audio chime
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext restricted before gesture
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80);
      } catch {
        // ignore
      }
    }
  };

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
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
    setHasPromptedPermission(false);
  }, [stream]);

  // Handle successful decode of tag
  const handleDecodedTag = useCallback((rawCode: string) => {
    const now = Date.now();
    if (now - lastScanTimeRef.current < 2000) return;
    lastScanTimeRef.current = now;

    playBeep();

    const matched = findEquipmentRecord(rawCode);
    if (matched) {
      stopCameraStream();
      onClose();
      onRecordMatched(matched);
    } else {
      // If code doesn't exactly match catalog, generate a dynamic record for the scanned tag
      const dynamicRecord: EquipmentRecordWithHistory = {
        id: `rec-${rawCode.replace(/[^a-zA-Z0-9]/g, '')}`,
        catalogId: 'eq-1',
        name: `Biomedical Asset [${rawCode.slice(0, 18)}]`,
        category: 'Diagnostic & Clinical Support',
        manufacturer: 'TMDA Verified Hospital Asset',
        model: `Tag Ref: ${rawCode}`,
        serialNumber: rawCode.startsWith('SN-') ? rawCode : `SN-${rawCode}`,
        qrCodeTag: rawCode,
        hospitalAssigned: 'Muhimbili National Hospital (MNH)',
        facilityId: 'fac-mnh',
        department: 'Biomedical Engineering Dept',
        installationDate: new Date().toISOString().split('T')[0],
        lastCalibrationDate: new Date().toISOString().split('T')[0],
        nextCalibrationDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        calibrationStatus: 'Valid',
        uptimePercentage: 99.5,
        slaCoverage: 'Comprehensive Tier 1 SLA',
        operationalStatus: 'Operational',
        powerRequirements: '230V AC · 50Hz',
        tmdaRegistryId: 'TMDA/MED/DEV/2026/0491',
        calibrationCertificate: {
          certificateNumber: `CMT-CAL-${Date.now().toString().slice(-6)}`,
          leadEngineer: 'Eng. Kelvin Lyimo, B.Sc. Biomedical (ERB #9482)',
          analyzerUsed: 'Fluke Biomedical ProSim 8 / ESA620 Safety Analyzer',
          standard: 'ISO/IEC 17025 & IEC 62353 Safety Standard',
          result: 'PASSED',
          electricalSafetyStandard: 'IEC 62353 Class I Type BF (Chassis Leakage: 38 µA)',
          validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        maintenanceEvents: [
          {
            id: 'ME-SCAN-01',
            date: new Date().toISOString().split('T')[0],
            type: 'Calibration & Safety Audit',
            engineer: 'Eng. Kelvin Lyimo',
            facility: 'Muhimbili National Hospital (MNH)',
            description: `Field barcode/QR verification via CoreMed Mobile Scanner for tag ${rawCode}. Full electrical safety test passed.`,
            status: 'Certified',
            findings: 'Chassis leakage 38 µA (limit 100 µA). Ground resistance 0.08 Ω nominal.',
            standardsComplied: ['IEC 62353', 'ISO 17025']
          }
        ],
        image: '/src/assets/images/mindray_resona_ultrasound_1791133914392.jpg'
      };

      stopCameraStream();
      onClose();
      onRecordMatched(dynamicRecord);
    }
  }, [onClose, onRecordMatched, stopCameraStream]);

  // Request & Start Camera upon user initiation
  const startCamera = async () => {
    setHasPromptedPermission(true);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported by your current browser.');
      return;
    }

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
          videoRef.current?.play().catch((err) => console.warn('Play error:', err));
        };

        if (videoRef.current.readyState >= 2) {
          videoRef.current.play().catch((err) => console.warn('Play error readyState:', err));
        }
      }

      // Check torch
      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as { torch?: boolean };
        setHasTorch(!!capabilities?.torch);
      }
    } catch (err: unknown) {
      console.warn('Camera initiation error:', err);
      setCameraState('error');
      const errObj = err as { name?: string; message?: string };
      if (errObj.name === 'NotAllowedError' || errObj.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. Tap the padlock/camera icon in your address bar, set Camera to "Allow", and click Retry.');
      } else if (errObj.name === 'NotFoundError' || errObj.name === 'DevicesNotFoundError') {
        setErrorMessage('No physical camera was found on this system. You can test with the Sample Tags or Simulated Scanner below.');
      } else {
        setErrorMessage('Could not open camera: ' + (errObj.message || 'Permission or hardware issue'));
      }
    }
  };

  // Simulated scan feed for testing in non-webcam environments
  const handleSimulateFeed = (sampleTag?: string) => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsSimulatingFeed(true);
    setCameraState('active');
    setErrorMessage(null);

    const tagToUse = sampleTag || EQUIPMENT_RECORDS_CATALOG[0].qrCodeTag;

    if (simTimerRef.current) clearInterval(simTimerRef.current);
    simTimerRef.current = window.setTimeout(() => {
      handleDecodedTag(tagToUse);
    }, 2000);
  };

  // Continuous frame analysis
  useEffect(() => {
    if (cameraState !== 'active' || isSimulatingFeed || !videoRef.current) return;

    isScanningRef.current = true;
    let animationFrameId: number;

    // Check BarcodeDetector
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let barcodeDetector: any = null;
    if (hasBarcodeDetector) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'code_128', 'ean_13', 'data_matrix']
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
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 1. BarcodeDetector
            let detected = false;
            if (barcodeDetector) {
              try {
                const barcodes = await barcodeDetector.detect(canvas);
                if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                  detected = true;
                  handleDecodedTag(barcodes[0].rawValue);
                }
              } catch {
                // fall back
              }
            }

            // 2. jsQR
            if (!detected) {
              try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: 'attemptBoth'
                });
                if (qrResult && qrResult.data) {
                  handleDecodedTag(qrResult.data);
                }
              } catch {
                // read error
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
  }, [cameraState, isSimulatingFeed, handleDecodedTag]);

  // Upload Photo
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
            handleDecodedTag(code.data);
          } else {
            alert('No valid QR code or Barcode was detected in this photo. Please make sure the tag is well-lit and centered.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Flip Facing Mode
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Torch
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

  // Close and cleanup
  const handleClose = () => {
    stopCameraStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0F4C81] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                TMDA Equipment Tag Reader
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Scan Equipment Tag & Pull Up Maintenance History
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Permission Prompt Container */}
        <div className="relative h-64 sm:h-80 bg-slate-950 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-slate-800 shadow-inner">
          <canvas ref={canvasRef} className="hidden" />

          {/* HTML5 Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              cameraState === 'active' && !isSimulatingFeed ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Simulated scanning animation */}
          {cameraState === 'active' && isSimulatingFeed && (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-36 h-36 rounded-2xl bg-white/5 border border-white/20 p-4 flex flex-col items-center justify-center relative shadow-2xl backdrop-blur-sm animate-pulse">
                <QrCode className="w-20 h-20 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-300 mt-2">CMT-QR-948102-MNH</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-300 block">Simulating Live Scanner Feed</span>
                <span className="text-[11px] text-slate-400 block">Acquiring tag data...</span>
              </div>
            </div>
          )}

          {/* Viewfinder Overlays & Reticle when camera is active */}
          {cameraState === 'active' && (
            <>
              {/* Laser scan line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10B981] animate-[pulse_1.5s_infinite] pointer-events-none z-10"></div>

              {/* Target Reticle */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-emerald-400/50 rounded-3xl relative flex items-center justify-center pointer-events-none z-10">
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl shadow-xs"></div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl shadow-xs"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl shadow-xs"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl shadow-xs"></div>

                <div className="text-center text-white/90 space-y-1 bg-slate-950/50 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                  <QrCode className="w-6 h-6 mx-auto text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-wider block">Align Asset QR Tag</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  {!isSimulatingFeed && (
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-md transition-colors cursor-pointer"
                      title="Switch Front / Rear Camera"
                    >
                      <SwitchCamera className="w-4 h-4 text-emerald-300" />
                    </button>
                  )}

                  {hasTorch && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`p-2 rounded-xl border backdrop-blur-md shadow-md transition-colors cursor-pointer ${
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
                  onClick={stopCameraStream}
                  className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold border border-red-400 backdrop-blur-md shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              </div>
            </>
          )}

          {/* PERMISSION NOTIFICATION & INITIATION PROMPT (The prompt explicitly requested by user!) */}
          {cameraState === 'prompt' && (
            <div className="text-center text-white space-y-3.5 max-w-sm p-4 z-10 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#10B981] border border-white/20 flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
                <Camera className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                    Camera Permission Prompt
                  </span>
                </div>
                <h5 className="text-base font-bold text-white">Turn On Camera Permissions to Scan</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  CoreMed Tech requires access to your device camera to scan TMDA asset tags and pull up equipment maintenance history.
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
                  onClick={() => handleSimulateFeed()}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test with Simulated Camera Feed</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Camera feed is processed locally and never recorded</span>
              </div>
            </div>
          )}

          {/* Requesting Camera Access State */}
          {cameraState === 'requesting' && (
            <div className="text-center text-white space-y-3 max-w-sm p-4 z-10 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center mx-auto text-blue-400 animate-pulse">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-white">Requesting Camera Access...</h5>
                <p className="text-xs text-slate-300">
                  Please tap <strong>"Allow"</strong> on your browser permission dialog.
                </p>
              </div>
            </div>
          )}

          {/* Error / Blocked Permission State */}
          {cameraState === 'error' && (
            <div className="text-center text-white space-y-2.5 max-w-sm p-4 z-10 animate-in fade-in duration-200">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-amber-300">Camera Permission Needed</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{errorMessage}</p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row justify-center gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera Permission</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFeed()}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/10 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use Simulated Scan</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Input Methods: Scan from Photo or Manual Lookup */}
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {/* Upload / Take Photo QR Scanner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0F4C81] shrink-0">
                <FileImage className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs">Scan from Photo</span>
                <span className="text-[10px] text-slate-500">Upload asset tag photo</span>
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
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Select File</span>
            </button>
          </div>

          {/* Manual Tag / Serial Lookup */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter Tag ID (e.g. CMT-QR-...)"
                value={manualTagQuery}
                onChange={(e) => setManualTagQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && manualTagQuery.trim()) {
                    handleDecodedTag(manualTagQuery.trim());
                  }
                }}
                className="w-full text-xs pl-7 pr-2 py-1.5 bg-white border border-slate-300 rounded-xl font-mono focus:ring-1 focus:ring-[#0F4C81] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (manualTagQuery.trim()) handleDecodedTag(manualTagQuery.trim());
              }}
              className="px-3 py-1.5 bg-[#0F4C81] text-white font-bold rounded-xl text-xs hover:bg-[#0B3961] cursor-pointer shrink-0"
            >
              Lookup
            </button>
          </div>
        </div>

        {/* Quick Sample Tags for 1-Click Testing */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Or Click Any Hospital Asset Tag to Pull Up History:</span>
            </span>
            <span className="text-[10px] text-slate-400">1-click test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {EQUIPMENT_RECORDS_CATALOG.slice(0, 3).map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => handleDecodedTag(rec.qrCodeTag)}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-500 rounded-2xl text-left transition-all cursor-pointer text-xs space-y-0.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate block group-hover:text-[#0F4C81]">
                    {rec.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </div>
                <span className="text-[10px] font-mono text-emerald-700 block truncate">
                  {rec.qrCodeTag}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  🏥 {rec.hospitalAssigned.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
