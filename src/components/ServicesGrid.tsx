import React, { useState } from 'react';
import { CORE_SERVICES } from '../data/mockData';
import { ServiceItem } from '../types';
import {
  Activity,
  Wrench,
  FlaskConical,
  ShieldCheck,
  Gauge,
  ArrowRight,
  X,
  CheckCircle2,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

interface ServicesGridProps {
  onRequestService: (service: ServiceItem) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onRequestService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#0F4C81]" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-emerald-600" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-[#0F4C81]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Gauge':
        return <Gauge className="w-6 h-6 text-[#0F4C81]" />;
      default:
        return <Activity className="w-6 h-6 text-[#0F4C81]" />;
    }
  };

  return (
    <section id="services" className="py-14 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
              <span>01. Core Capabilities</span>
              <span aria-hidden="true">·</span>
              <span>Engineering & Clinical Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Services Engineered for Hospital Excellence
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Delivering full-lifecycle biomedical solutions from equipment supply and turnkey installation to ISO 17025 accredited calibration across Tanzania.
          </p>
        </div>

        {/* 5 Core Service Cards Grid (Hick's Law: Clean, Reduced Cognitive Clutter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CORE_SERVICES.map((service, index) => {
            return (
              <div
                key={service.id}
                className="group rounded-3xl p-6 sm:p-7 bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-[#0F4C81]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Clean Icon Container */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-5 group-hover:scale-105 group-hover:shadow-md transition-all">
                    {getIcon(service.iconName)}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors mb-2.5 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                    {service.shortDesc}
                  </p>

                  {/* Top 2 Core Highlights (Hick's Law: Essential Info Only) */}
                  <ul className="space-y-2 mb-6 text-xs text-slate-700">
                    {service.highlights.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Primary Action Button Bar */}
                <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdvancedSpecs(false);
                      setSelectedService(service);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C81] hover:text-[#0A3357] group-hover:underline cursor-pointer"
                  >
                    <span>View Specifications & SLA</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    0{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail & Advanced Specifications Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(selectedService.iconName)}
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-emerald-600">
                    Biomedical Capability Profile
                  </span>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 font-display">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 sm:py-6 space-y-5">
              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-1.5">Scope of Technical Execution</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedService.fullDesc}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Core Technical Deliverables</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedService.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsible Advanced Options Drawer (Hick's Law) */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSpecs(!showAdvancedSpecs)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 text-left text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#0F4C81]" />
                    <span>Advanced Standards & Equipment Coverage</span>
                  </div>
                  {showAdvancedSpecs ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {showAdvancedSpecs && (
                  <div className="p-4 space-y-4 bg-white border-t border-slate-200 animate-in fade-in duration-150">
                    <div>
                      <h5 className="text-[11px] uppercase font-semibold text-slate-400 mb-2">Typical Equipment & Platforms Managed</h5>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {selectedService.equipmentCovered.map((eq, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[11px] uppercase font-semibold text-slate-400 mb-2">Accredited Compliance & Standards</h5>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {selectedService.standards.map((st, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81] shrink-0" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Rapid regional dispatch from Arusha & Dar es Salaam.
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const svc = selectedService;
                    setSelectedService(null);
                    onRequestService(svc);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  <span>Request SLA for this Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
