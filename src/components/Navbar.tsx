import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { PhoneCall, LogIn, Menu, X, ShieldCheck } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      {/* Top emergency dispatch ribbon */}
      <div className="bg-[#0F4C81] text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Tanzania Rapid Biomedical Engineering Hotline:</span>
          <a
            href="tel:+255742296631"
            className="font-bold underline hover:text-emerald-300 transition-colors"
          >
            +255 742 296 631
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-200 text-xs">
          <span>NeST Tender Compliant</span>
          <span>·</span>
          <span>TMDA Certified</span>
          <span>·</span>
          <span>Arusha HQ & Dar es Salaam Spares Hub</span>
        </div>
      </div>

      {/* Main Top Bar: Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[5.75rem] sm:min-h-[6.5rem] lg:min-h-[7.25rem] py-2.5 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <a href="#" className="flex items-center group focus:outline-none py-1" aria-label="CoreMed Tech Home">
          <BrandLogo size="md" theme="light" />
        </a>

        {/* Zone 2: 4-6 Clean navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a
            href="#services"
            className="hover:text-[#0F4C81] transition-colors py-1 hover:border-b-2 hover:border-[#0F4C81]"
          >
            Services
          </a>
          <a
            href="#equipment"
            onClick={onOpenCatalog}
            className="hover:text-[#0F4C81] transition-colors py-1 hover:border-b-2 hover:border-[#0F4C81]"
          >
            Equipment
          </a>
          <a
            href="#compliance"
            className="hover:text-[#0F4C81] transition-colors py-1 hover:border-b-2 hover:border-[#0F4C81]"
          >
            Compliance & SLAs
          </a>
          <a
            href="#about"
            className="hover:text-[#0F4C81] transition-colors py-1 hover:border-b-2 hover:border-[#0F4C81]"
          >
            About Us
          </a>
          <a
            href="#contact"
            className="hover:text-[#0F4C81] transition-colors py-1 hover:border-b-2 hover:border-[#0F4C81]"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMaintenanceModal}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F4C81] bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Request SLA</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F4C81] hover:bg-[#0B3860] active:scale-98 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-300" />
            <span>Client & Staff Login</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Services
          </a>
          <a
            href="#equipment"
            onClick={() => {
              onOpenCatalog();
              setMobileMenuOpen(false);
            }}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Equipment Catalog
          </a>
          <a
            href="#compliance"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Compliance & SLAs
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            About CoreMed Tech
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Contact & Arusha/Dar Hubs
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenMaintenanceModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <PhoneCall className="w-4 h-4" />
              Request Maintenance Dispatch
            </button>
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg bg-[#0F4C81] text-white hover:bg-[#0B3860]"
            >
              <LogIn className="w-4 h-4" />
              Client & Staff Login Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
