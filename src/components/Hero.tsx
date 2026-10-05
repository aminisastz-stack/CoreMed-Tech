import React, { useState } from 'react';
import { useBrand, INSPIRATION_IMAGES, CLINICAL_ALT_IMAGES } from '../context/BrandContext';
import { ShieldCheck, ArrowRight, FileSpreadsheet, CheckCircle2, Clock, Upload, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenMaintenanceModal: () => void;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenMaintenanceModal, onScrollToCatalog }) => {
  const { siteImages, updateSiteImage } = useBrand();
  const [activeHeroView, setActiveHeroView] = useState<'architecture' | 'clinical'>('architecture');

  const heroImageSrc = siteImages.heroImage;

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSiteImage('heroImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitchToArchitecture = () => {
    setActiveHeroView('architecture');
    updateSiteImage('heroImage', INSPIRATION_IMAGES.heroImage);
  };

  const handleSwitchToClinical = () => {
    setActiveHeroView('clinical');
    if (CLINICAL_ALT_IMAGES.heroImage) {
      updateSiteImage('heroImage', CLINICAL_ALT_IMAGES.heroImage);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/60 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80">
      {/* Subtle clinical grid background texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0F4C81 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Background glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#0F4C81]/8 to-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Clean editorial unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F4C81] tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Biomedical Engineering & Clinical Infrastructure · Tanzania</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-display">
              Precision Medical Engineering & Lifesaving Equipment Uptime
            </h1>

            {/* Concrete Value Proposition for Tanzanian Hospitals */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Empowering Tanzanian national referral hospitals, private health centers, and clinical laboratories with turnkey diagnostic systems, accredited ISO 17025 equipment calibration, preventive maintenance SLAs, and rapid spare parts distribution.
            </p>

            {/* Two Action Buttons: "Request Maintenance / SLA" and "View Equipment Catalog" */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenMaintenanceModal}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#0F4C81] hover:bg-[#0A3357] active:scale-98 rounded-xl shadow-lg shadow-[#0F4C81]/25 hover:shadow-xl hover:shadow-[#0F4C81]/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Request Maintenance / SLA</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={onScrollToCatalog}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#0F4C81]" />
                <span>View Equipment Catalog</span>
              </button>
            </div>

            {/* Human Editorial Proof Bullets (Anti-slop zero pills) */}
            <div className="pt-4 border-t border-slate-200/90 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>BRELA Reg #482910</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NeST Tender Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4-Hr SLA Response in Dar & Arusha</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Matching Nexora layout with architectural image and overlay badge) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
              <img
                src={heroImageSrc}
                alt="CoreMed Tech Corporate Biomedical Engineering Headquarters"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[460px] object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* View Switcher Bar (Matching document photos) */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/20 text-[11px] z-10">
                <button
                  onClick={handleSwitchToArchitecture}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeHeroView === 'architecture'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  HQ Architecture (Inspiration)
                </button>
                <button
                  onClick={handleSwitchToClinical}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeHeroView === 'clinical'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Clinical Suite
                </button>
                <label
                  className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                  title="Upload custom image for hero banner"
                >
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Upload Pic</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Bottom tag inside photo */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#0F4C81] uppercase tracking-wide">
                    {activeHeroView === 'architecture' ? 'CoreMed Arusha & Dar Facilities' : 'Clinical Diagnostic Suite'}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    24/7 Biomedical On-Call Engineers
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Stocked Hub</span>
                  <p className="text-xs font-bold text-emerald-600">Dar es Salaam Depot</p>
                </div>
              </div>
            </div>

            {/* Floating Experience Badge (Inspired by Nexora's "8+ Years of Experience" box) */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-[#0F4C81] text-white p-4 sm:p-5 rounded-2xl shadow-xl border-2 border-white flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                  8+
                </span>
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-slate-200 uppercase">
                Years of Experience
              </span>
              <span className="text-[10px] text-emerald-400 font-bold mt-0.5">
                99.4% Uptime SLA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

