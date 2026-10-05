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
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Team / Calibration Photo matching TechNova layout */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white group">
              <img
                src={aboutImageSrc}
                alt="CoreMed Tech Biomedical Engineering Team in Modern Office"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* View Switcher Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/20 text-[11px] z-10">
                <button
                  onClick={handleSwitchToTeam}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeAboutView === 'team'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Tech Team Office (Inspiration)
                </button>
                <button
                  onClick={handleSwitchToField}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeAboutView === 'field'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Field Calibration
                </button>
                <label
                  className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
                  title="Upload picture from your PDF document"
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

              {/* Inset facility highlight */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/50 text-slate-800 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Arusha AICC HQ & Dar es Salaam Depot</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0F4C81]">On-Site Rapid Support</span>
                </div>
              </div>
            </div>

            {/* Floating Experience Badge matching TechNova's "5+ Years of Experience" / "12+ Years" */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-6 sm:-right-6 bg-white text-slate-900 p-5 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F4C81] text-emerald-300 flex items-center justify-center font-bold text-xl">
                12+
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0F4C81] uppercase tracking-wide">
                  Years Engineering
                </p>
                <p className="text-sm font-extrabold text-slate-900">
                  Hospital Solutions in East Africa
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Competencies */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
                <span>02. Corporate Engineering Profile</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                Dedicated to Eliminating Hospital Equipment Downtime in Tanzania
              </h2>
            </div>

            <p className="text-base text-slate-600 leading-relaxed">
              Founded on the belief that uninterrupted healthcare technology saves lives, <strong className="text-slate-900">COREMED TECH</strong> is Tanzania's premier biomedical engineering firm. Headquartered in Arusha at the AICC Kilimanjaro Complex with a central logistics and spare parts warehouse in Dar es Salaam, we bridge the gap between world-class medical equipment and local technical sustainability.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Full NeST e-Procurement Tender Ready</h4>
                  <p className="text-xs text-slate-600">
                    Compliant with Tanzanian Public Procurement Regulatory Authority (PPRA) and NeST digital tender submissions for government and mission hospitals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Certified Biomedical Engineering Personnel</h4>
                  <p className="text-xs text-slate-600">
                    Engineers trained directly by OEM manufacturers (Mindray, Siemens, Sysmex, Dräger) equipped with calibrated electrical safety analyzers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Emergency Spares Stock in Dar es Salaam</h4>
                  <p className="text-xs text-slate-600">
                    Eliminating months of freight delay with over 12,000 sensors, boards, valves, and transducer replacements stocked locally.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenMaintenanceModal}
                className="px-6 py-3 text-xs font-semibold text-white bg-[#0F4C81] hover:bg-[#0A3357] rounded-xl shadow-md transition-all cursor-pointer"
              >
                Schedule Hospital Biomedical Audit
              </button>
              <a
                href="#contact"
                className="px-5 py-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
              >
                Contact Technical Management
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

