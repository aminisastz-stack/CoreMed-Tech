import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ShieldCheck, Cpu, Clock, Award } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenMaintenanceModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenMaintenanceModal }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Award className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
      title: t.whyChoose.feat1Title,
      desc: t.whyChoose.feat1Desc
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: t.whyChoose.feat2Title,
      desc: t.whyChoose.feat2Desc
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: t.whyChoose.feat3Title,
      desc: t.whyChoose.feat3Desc
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      title: t.whyChoose.feat4Title,
      desc: t.whyChoose.feat4Desc
    }
  ];

  return (
    <section id="compliance" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
              {t.whyChoose.kicker}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t.whyChoose.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
              {t.whyChoose.subtitle}
            </p>
          </div>
          <button
            onClick={onOpenMaintenanceModal}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F4C81] hover:text-[#0A3357] transition-colors cursor-pointer group shrink-0"
          >
            <span>{t.statsSplit.cta}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Feature Columns matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5`}>
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
