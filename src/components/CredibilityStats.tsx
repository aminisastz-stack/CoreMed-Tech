import React from 'react';
import { CREDIBILITY_METRICS, COMPLIANCE_BADGES } from '../data/mockData';
import { Award, Building2, FileCheck, Warehouse, ShieldAlert, Cpu } from 'lucide-react';

export const CredibilityStats: React.FC = () => {
  return (
    <section id="compliance" className="bg-[#0A2540] text-white py-14 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compliance Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-700/80">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Building2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                BRELA Registered
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Cert. No. 482910 · Verified corporate entity under the laws of Tanzania.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <FileCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                NeST Tender Compliant
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                National e-Procurement System of Tanzania authorized medical supplier.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Warehouse className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Dar es Salaam Spares Hub
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Regional climate-controlled depot with 12,000+ OEM replacement parts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Award className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                ISO 17025 Protocols
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Traceable electrical safety and medical gas calibration standards.
              </p>
            </div>
          </div>
        </div>

        {/* Big Numbers Stat Bar (Directly inspired by Nexora's 250+ / 650+ / 8+ banner) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-10 text-center">
          {CREDIBILITY_METRICS.map((metric, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display tabular-nums">
                {metric.value}
              </span>
              <span className="text-sm font-semibold text-emerald-300 mt-2">
                {metric.label}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                {metric.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
