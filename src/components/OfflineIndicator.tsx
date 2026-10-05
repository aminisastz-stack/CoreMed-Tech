import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <aside aria-label="Offline Mode Notification" className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 animate-bounce-subtle pointer-events-auto">
      <div className="bg-slate-900/95 text-white border border-amber-500/40 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {t.common.offlineTitle}
            </h4>
          </div>
          <p className="text-xs text-slate-300 truncate font-normal">
            {t.common.offlineDesc}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-[10px] font-medium text-emerald-400 border border-slate-700 shrink-0">
          <Database className="w-3 h-3" />
          {t.common.cached}
        </div>
      </div>
    </aside>
  );
};
