import React from 'react';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenLogin: () => void;
  onOpenMaintenanceModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin, onOpenMaintenanceModal }) => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-[#071B2D] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Compliance */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="md" theme="dark" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>BRELA Incorporation: Cert #482910</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NeST Vendor Registered · TMDA Certified</span>
              </div>
            </div>

            {/* Language Switcher in Footer */}
            <div className="pt-3">
              <LanguageSwitcher variant="footer" />
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.services}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition-colors">
                  {t.departments.dept1Title}
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition-colors">
                  {t.departments.dept3Title}
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition-colors">
                  {t.departments.dept5Title}
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition-colors">
                  {t.departments.dept6Title}
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-emerald-400 transition-colors">
                  {t.departments.dept8Title}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenMaintenanceModal}
                  className="text-emerald-400 font-semibold hover:underline mt-1 cursor-pointer"
                >
                  {t.departments.emergencySla}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Hubs in Tanzania */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Regional Operations Hubs
            </h4>
            <div className="space-y-4 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Arusha Headquarters:</strong>
                  <span>AICC, Kilimanjaro Building, Room 341</span>
                  <span className="block text-slate-500">Arusha, Tanzania</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Dar es Salaam Depot:</strong>
                  <span>Mikocheni Light Industrial Zone, Depot 12</span>
                  <span className="block text-slate-500">Dar es Salaam, Tanzania</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Rapid Contact & Login */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.nav.contact}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <a
                href="tel:+255742296631"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">+255 742 296 631</span>
              </a>

              <a
                href="mailto:support@coremedtech.co.tz"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@coremedtech.co.tz</span>
              </a>

              <a
                href="mailto:info@coremedtech.co.tz"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>info@coremedtech.co.tz</span>
              </a>

              <div className="pt-2">
                <button
                  onClick={onOpenLogin}
                  className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.nav.portalLogin}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <a href="#compliance" className="hover:text-slate-300 transition-colors">
              TMDA Compliance
            </a>
            <span aria-hidden="true">·</span>
            <a href="#compliance" className="hover:text-slate-300 transition-colors">
              ISO 17025 Protocols
            </a>
            <span aria-hidden="true">·</span>
            <a href="#compliance" className="hover:text-slate-300 transition-colors">
              Biomedical SLA Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
