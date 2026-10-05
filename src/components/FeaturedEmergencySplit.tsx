import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Clock, ShieldCheck, PhoneCall } from 'lucide-react';

interface FeaturedEmergencySplitProps {
  onOpenMaintenanceModal: () => void;
  onOpenLogin?: () => void;
}

export const FeaturedEmergencySplit: React.FC<FeaturedEmergencySplitProps> = ({
  onOpenMaintenanceModal,
  onOpenLogin,
}) => {
  const { t } = useLanguage();
  const doctorPhoto =
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop';
  
  const emergencyEntrancePhoto =
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop';

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Card: Light Blue/Slate Card matching reference */}
          <div className="rounded-3xl bg-[#EEF5FB] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden relative shadow-xs border border-blue-100/80">
            <div className="relative z-10 max-w-sm space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[#0F4C81] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.featuredSplit.leftKicker}</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {t.featuredSplit.leftTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.featuredSplit.leftDesc}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenMaintenanceModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0A3357] rounded-full shadow-md transition-all cursor-pointer"
                >
                  <span>{t.featuredSplit.leftCta}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>

            <div className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-0 w-full md:w-56 lg:w-64 h-52 md:h-64 rounded-2xl md:rounded-none overflow-hidden flex items-end justify-end pointer-events-none">
              <img
                src={doctorPhoto}
                alt="Certified Biomedical Engineer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Right Card: Dark Navy Card matching reference */}
          <div className="rounded-3xl bg-[#0B1E36] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between overflow-hidden relative shadow-xl border border-slate-800">
            <div className="relative z-10 max-w-sm space-y-3">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.featuredSplit.rightKicker}</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {t.featuredSplit.rightTitle}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.featuredSplit.rightDesc}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="tel:+255742296631"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0B1E36] bg-emerald-400 hover:bg-emerald-300 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#0B1E36]" />
                  <span>{t.featuredSplit.rightCall}</span>
                </a>
              </div>
            </div>

            <div className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-0 w-full md:w-56 lg:w-64 h-52 md:h-64 rounded-2xl md:rounded-none overflow-hidden opacity-90 pointer-events-none">
              <img
                src={emergencyEntrancePhoto}
                alt="Hospital Emergency Entrance Illuminated at Night"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0B1E36] via-[#0B1E36]/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
