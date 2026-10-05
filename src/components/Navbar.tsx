import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import {
  LogIn,
  Menu,
  X,
  Search,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenMaintenanceModal: () => void;
  onOpenCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenMaintenanceModal,
  onOpenCatalog,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopAnnouncement, setShowTopAnnouncement] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 transition-all shadow-xs w-full max-w-full font-sans">
      {/* Top Black/Navy Announcement Banner matching reference image */}
      {showTopAnnouncement && (
        <div className="bg-[#0B1E36] text-white text-xs py-2 px-3 sm:px-6 lg:px-8 flex justify-between items-center w-full">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-300">{t.nav.ribbonTitle}</span>
              <a
                href="tel:+255742296631"
                className="font-bold text-white hover:text-emerald-300 transition-colors underline ml-1"
              >
                +255 742 296 631
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={onOpenMaintenanceModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-[11px] font-semibold transition-colors border border-white/20 cursor-pointer"
              >
                <span>{t.nav.getQuote}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
              <button
                onClick={() => setShowTopAnnouncement(false)}
                className="text-slate-400 hover:text-white transition-colors p-0.5 cursor-pointer"
                aria-label="Close announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Wordmark */}
        <a href="#" className="flex items-center group focus:outline-none shrink-0" aria-label="CoreMed Tech Home">
          <BrandLogo size="md" theme="light" />
        </a>

        {/* Center: Clean Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-700">
          <a
            href="#"
            className="text-[#0F4C81] hover:text-[#0A3357] transition-colors"
          >
            {t.nav.home}
          </a>
          <a
            href="#about"
            className="hover:text-[#0F4C81] transition-colors"
          >
            {t.nav.about}
          </a>
          <a
            href="#departments"
            className="hover:text-[#0F4C81] transition-colors"
          >
            {t.nav.departments}
          </a>
          <a
            href="#equipment"
            onClick={onOpenCatalog}
            className="hover:text-[#0F4C81] transition-colors"
          >
            {t.nav.equipment}
          </a>
          <a
            href="#compliance"
            className="hover:text-[#0F4C81] transition-colors"
          >
            {t.nav.compliance}
          </a>
          <a
            href="#contact"
            className="hover:text-[#0F4C81] transition-colors"
          >
            {t.nav.contact}
          </a>
        </nav>

        {/* Right: Language Switcher + PWA Install + Book Appointment + Portal Login */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Switcher Dropdown */}
          <LanguageSwitcher variant="navbar" />

          {/* PWA Install Button */}
          <PWAInstallButton variant="navbar" />

          {/* Search Button */}
          <button
            onClick={onOpenCatalog}
            className="p-2 rounded-full text-slate-600 hover:text-[#0F4C81] hover:bg-slate-100 transition-colors hidden xl:flex items-center justify-center cursor-pointer"
            title={t.nav.searchEquipment}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Primary Action Button matching reference "Book Appointment ->" */}
          <button
            onClick={onOpenMaintenanceModal}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0F4C81] hover:bg-[#0A3357] active:scale-98 rounded-full shadow-md shadow-[#0F4C81]/25 hover:shadow-lg hover:shadow-[#0F4C81]/35 transition-all whitespace-nowrap cursor-pointer"
          >
            <span>{t.nav.bookAppointment}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
          </button>

          {/* Portal login button */}
          <button
            onClick={onOpenLogin}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>{t.nav.portalLogin}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Language Selector */}
          <div className="pb-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Language / Lugha / Langue
            </label>
            <LanguageSwitcher variant="mobile" />
          </div>

          <nav className="flex flex-col space-y-1">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-[#0F4C81] bg-blue-50 rounded-xl"
            >
              {t.nav.home}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F4C81] rounded-xl"
            >
              {t.nav.about}
            </a>
            <a
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F4C81] rounded-xl"
            >
              {t.nav.departments}
            </a>
            <a
              href="#equipment"
              onClick={() => {
                onOpenCatalog();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F4C81] rounded-xl"
            >
              {t.nav.equipment}
            </a>
            <a
              href="#compliance"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F4C81] rounded-xl"
            >
              {t.nav.compliance}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F4C81] rounded-xl"
            >
              {t.nav.contact}
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex justify-center pb-1">
              <PWAInstallButton variant="banner" />
            </div>
            <button
              onClick={() => {
                onOpenMaintenanceModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-xs font-bold rounded-full bg-[#0F4C81] text-white shadow-md cursor-pointer"
            >
              <span>{t.nav.bookAppointment}</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-xs font-bold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#0F4C81]" />
              <span>{t.nav.portalLogin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
