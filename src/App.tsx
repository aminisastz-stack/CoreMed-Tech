import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { CredibilityStats } from './components/CredibilityStats';
import { AboutSection } from './components/AboutSection';
import { EquipmentCatalog } from './components/EquipmentCatalog';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CallToActionBanner } from './components/CallToActionBanner';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { MaintenanceSLAModal } from './components/MaintenanceSLAModal';
import { ChatbotAndWhatsAppWidget } from './components/ChatbotAndWhatsAppWidget';
import { ServiceItem } from './types';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [selectedServiceForSLA, setSelectedServiceForSLA] = useState<string>('');

  // Handle direct url hash for #login or pathname /login
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#login' || window.location.pathname === '/login') {
        setIsLoginOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenMaintenanceWithCategory = (service: ServiceItem) => {
    setSelectedServiceForSLA(service.title);
    setIsMaintenanceOpen(true);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('equipment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased">
      {/* Navigation Bar */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenMaintenanceModal={() => {
          setSelectedServiceForSLA('');
          setIsMaintenanceOpen(true);
        }}
        onOpenCatalog={scrollToCatalog}
      />

      {/* Main Landing Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
          onScrollToCatalog={scrollToCatalog}
        />

        {/* 5 Core Service Cards Grid */}
        <ServicesGrid onRequestService={handleOpenMaintenanceWithCategory} />

        {/* Credibility & Compliance Bar (BRELA, NeST, Dar Spares, Stats) */}
        <CredibilityStats />

        {/* About CoreMed Tech Section */}
        <AboutSection
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />

        {/* Equipment Catalog & Inquiry */}
        <EquipmentCatalog
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />

        {/* Testimonials from Tanzanian Hospital Leaders */}
        <TestimonialsSection />

        {/* High-Contrast Conversion CTA Banner */}
        <CallToActionBanner
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />
      </main>

      {/* Corporate Footer */}
      <Footer
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenMaintenanceModal={() => {
          setSelectedServiceForSLA('');
          setIsMaintenanceOpen(true);
        }}
      />

      {/* Interactive Portal Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* Interactive Hospital Maintenance / SLA Request Modal */}
      <MaintenanceSLAModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
        initialServiceCategory={selectedServiceForSLA}
      />

      {/* Fixed Floating AI Chatbot & WhatsApp Widget */}
      <ChatbotAndWhatsAppWidget
        onOpenMaintenanceModal={() => {
          setSelectedServiceForSLA('');
          setIsMaintenanceOpen(true);
        }}
      />
    </div>
  );
}
