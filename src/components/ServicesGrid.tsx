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
  Calendar,
  FileCheck2
} from 'lucide-react';

interface ServicesGridProps {
  onRequestService: (service: ServiceItem) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onRequestService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

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
    <section id="services" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Inspired by Nexora & TechNova */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
              <span>01. Core Capabilities</span>
              <span aria-hidden="true">·</span>
              <span>Engineering & Clinical Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Services Engineered for Hospital Excellence
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Delivering full-lifecycle biomedical solutions from equipment supply and turnkey installation to ISO 17025 accredited calibration across Tanzania.
          </p>
        </div>

        {/* 5 Core Service Cards Grid (Dynamic responsive layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_SERVICES.map((service, index) => {
            const isWide = index === 0 || index === 4;
            return (
              <div
                key={service.id}
                className={`group rounded-2xl p-7 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-[#0F4C81]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isWide ? 'lg:col-span-1 xl:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Clean Icon Container */}
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-slate-50 transition-transform">
                    {getIcon(service.iconName)}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors mb-3 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {service.shortDesc}
                  </p>

                  {/* Highlights list */}
                  <ul className="space-y-2 mb-6 text-xs text-slate-700">
                    {service.highlights.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C81] group-hover:text-[#0A3357] transition-colors cursor-pointer"
                  >
                    <span>View Specifications & Protocols</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    0{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  {getIcon(selectedService.iconName)}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600">
                    Biomedical Capability Profile
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Scope of Technical Execution</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedService.fullDesc}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Core Technical Deliverables</h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {selectedService.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Typical Equipment & Platforms Managed</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedService.equipmentCovered.map((eq, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-400 mb-2">Accredited Compliance & Standards</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {selectedService.standards.map((st, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#0F4C81]" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Turnaround: Rapid regional dispatch from Arusha & Dar es Salaam.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const svc = selectedService;
                    setSelectedService(null);
                    onRequestService(svc);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-[#0F4C81] hover:bg-[#0B3860] rounded-lg shadow-sm transition-all"
                >
                  Request Service or SLA for this Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
