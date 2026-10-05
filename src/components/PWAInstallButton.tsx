import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    try {
      setIsInstalling(true);
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'navbar') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition shadow-sm active:scale-95"
          title="Install COREMED App for offline hospital access"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#0F4C81] hover:bg-[#0c3c66] text-white transition shadow-md active:scale-95"
      >
        <Smartphone className="w-4 h-4 text-emerald-400" />
        <span>Install Hospital App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition shadow-sm active:scale-95"
          title="Add to iPhone/iPad Home Screen"
        >
          <Download className="w-3.5 h-3.5 text-[#0F4C81]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Install COREMED TECH</h3>
                    <p className="text-[11px] text-slate-500">Offline clinical access on iOS</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 mb-5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>Tap the <strong>Share</strong> button (square icon with up arrow) in your Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>Tap <strong>Add</strong> at top right to launch offline biomedical tools anytime.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#0c3c66] text-white text-xs font-bold transition shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
