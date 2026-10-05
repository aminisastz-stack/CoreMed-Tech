import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  Clock,
  Users,
  Award,
  ShieldCheck
} from 'lucide-react';
import heroIcuImage from '../assets/images/hero_icu_resuscitation_1791237755980.jpg';

interface HeroProps {
  onOpenMaintenanceModal: () => void;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenMaintenanceModal, onScrollToCatalog }) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F8FC]/80 via-white to-white pt-8 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 w-full max-w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-bold text-[#0F4C81]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.hero.kicker}</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-2xl">
              {t.hero.titleLine1} <br className="hidden sm:inline" />
              <span className="text-[#0F4C81]">{t.hero.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons: Matching Reference Pill Style */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenMaintenanceModal}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0A3357] active:scale-98 rounded-full shadow-lg shadow-[#0F4C81]/25 hover:shadow-xl hover:shadow-[#0F4C81]/35 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>

              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{t.hero.ctaSecondary}</span>
              </button>
            </div>

            {/* 3 Bottom Trust Stats with rounded icon circles */}
            <div className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-slate-700">
              {/* Item 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F4C81] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{t.hero.statHospitals}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{t.hero.statHospitalsDesc}</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F4C81] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{t.hero.statResponse}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{t.hero.statResponseDesc}</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F4C81] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{t.hero.statUptime}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{t.hero.statUptimeDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Clinical ICU resuscitation photo */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border border-slate-200/80 group">
              <img
                src={heroIcuImage}
                alt="COREMED Biomedical Clinical Resuscitation System"
                className="w-full h-80 sm:h-[430px] lg:h-[480px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/60 shadow-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-900">
                  {t.hero.tagDispatch}
                </span>
              </div>

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-medium">{t.hero.tagEngineers}</p>
                  <p className="text-sm font-bold text-emerald-400">{t.hero.tagIso}</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenMaintenanceModal}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  {t.nav.bookAppointment}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
