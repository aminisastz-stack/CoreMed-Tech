import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface HospitalStatsSplitProps {
  onOpenMaintenanceModal: () => void;
}

export const HospitalStatsSplit: React.FC<HospitalStatsSplitProps> = ({ onOpenMaintenanceModal }) => {
  const { t } = useLanguage();
  const hospitalBuildingImage =
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1000&auto=format&fit=crop';

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-100 scroll-mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hospital Architecture Photo matching reference */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
              <img
                src={hospitalBuildingImage}
                alt="Modern Hospital Architecture and Medical Facility"
                className="w-full h-[320px] sm:h-[400px] object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Middle & Right Column: Editorial & Big Stats Grid */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <p className="text-xs font-extrabold tracking-widest text-[#0F4C81] uppercase">
                {t.statsSplit.kicker}
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.statsSplit.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                {t.statsSplit.desc1}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenMaintenanceModal}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0A3357] rounded-full shadow-md shadow-[#0F4C81]/20 transition-all cursor-pointer"
                >
                  <span>{t.statsSplit.cta}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            </div>

            {/* 2x2 Clean Big Stat Grid matching reference layout */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {t.statsSplit.counter1Value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t.statsSplit.counter1Label}
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {t.statsSplit.counter2Value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t.statsSplit.counter2Label}
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {t.statsSplit.counter3Value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t.statsSplit.counter3Label}
                </p>
              </div>

              <div>
                <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {t.statsSplit.counter4Value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {t.statsSplit.counter4Label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
