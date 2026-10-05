import React from 'react';
import { ArrowRight, MessageSquare, Phone, Wrench, ShieldCheck } from 'lucide-react';

interface CallToActionBannerProps {
  onOpenMaintenanceModal: () => void;
}

export const CallToActionBanner: React.FC<CallToActionBannerProps> = ({ onOpenMaintenanceModal }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0F4C81] via-[#0D3F6D] to-[#0A2E50] p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          {/* Subtle geometric circle textures */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Downtime Hospital Assurance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-display">
                Ready to Safeguard Your Hospital's Equipment Uptime?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Whether you require an immediate biomedical emergency repair dispatch, an annual preventive calibration contract, or NeST tender supply, CoreMed Tech is standing by.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                onClick={onOpenMaintenanceModal}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Wrench className="w-4 h-4" />
                <span>Request Maintenance / SLA</span>
              </button>

              <a
                href="https://wa.me/255742296631?text=Hello%20CoreMed%20Tech%20Biomedical,%20we%20would%20like%20to%20inquire%20about%20hospital%20equipment%20maintenance%20and%20SLA."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white border border-white/30 text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
