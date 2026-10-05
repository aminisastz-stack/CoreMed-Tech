import React, { useState } from 'react';
import { useBrand, INSPIRATION_IMAGES, CLINICAL_ALT_IMAGES } from '../context/BrandContext';
import { CheckCircle2, ShieldCheck, MapPin, Building, Users, Award, Upload } from 'lucide-react';

interface AboutSectionProps {
  onOpenMaintenanceModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenMaintenanceModal }) => {
  const { siteImages, updateSiteImage } = useBrand();
  const [activeAboutView, setActiveAboutView] = useState<'team' | 'field'>('team');

  const aboutImageSrc = siteImages.aboutImage;

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSiteImage('aboutImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitchToTeam = () => {
    setActiveAboutView('team');
    updateSiteImage('aboutImage', INSPIRATION_IMAGES.aboutImage);
  };

  const handleSwitchToField = () => {
    setActiveAboutView('field');
    if (CLINICAL_ALT_IMAGES.aboutImage) {
      updateSiteImage('aboutImage', CLINICAL_ALT_IMAGES.aboutImage);
    }
  };

  return (
    <section id="about" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80 scroll-mt-20 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Team / Calibration Photo */}
          <div className="lg:col-span-6 relative pb-6 sm:pb-0">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white group">
              <img
                src={aboutImageSrc}
                alt="CoreMed Tech Biomedical Engineering Team in Modern Office"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[420px] lg:h-[480px] object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* View Switcher Tag */}
              <div className="absolute top-2.5 left-2.5 right-2.5 sm:right-auto flex items-center gap-1 p-1 bg-slate-900/85 backdrop-blur-md rounded-lg border border-white/20 text-[10px] sm:text-[11px] z-10 overflow-x-auto no-scrollbar">
                <button
                  onClick={handleSwitchToTeam}
                  className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer shrink-0 ${
                    activeAboutView === 'team'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Tech Team
                </button>
                <button
                  onClick={handleSwitchToField}
                  className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer shrink-0 ${
                    activeAboutView === 'field'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Field Calibration
                </button>
                <label
                  className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  title="Upload picture from your PDF document"
                >
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Inset facility highlight */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/50 text-slate-800 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 truncate">Arusha HQ & Dar es Salaam Depot</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0F4C81] shrink-0">Rapid Support</span>
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-3 right-2 sm:-bottom-6 sm:-right-6 bg-white text-slate-900 p-3.5 sm:p-5 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-2.5 sm:gap-3 z-20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0F4C81] text-emerald-300 flex items-center justify-center font-bold text-lg sm:text-xl shrink-0">
                12+
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs font-bold text-[#0F4C81] uppercase tracking-wide">
                  Years Engineering
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Hospital Solutions in East Africa
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Competencies */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
                <span>02. Corporate Engineering Profile</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                Dedicated to Eliminating Hospital Equipment Downtime in Tanzania
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Founded on the belief that uninterrupted healthcare technology saves lives, <strong className="text-slate-900">COREMED TECH</strong> is Tanzania's premier biomedical engineering firm. Headquartered in Arusha at the AICC Kilimanjaro Complex with a central logistics and spare parts warehouse in Dar es Salaam, we bridge the gap between world-class medical equipment and local technical sustainability.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Full NeST e-Procurement Tender Ready</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized vendor on the National e-Procurement System of Tanzania for regional referral hospitals and Ministry tenders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ISO 17025 Traceable Fluke Biomedical Analyzers</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our field calibration standards are NIST & Fluke traceable for verified radiation safety, electrical leakage, and gas flow tolerances.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">4-Hour Emergency Response SLA</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rapid clinical engineering deployment across Dar es Salaam, Arusha, Moshi, Mwanza, Dodoma, and nationwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
