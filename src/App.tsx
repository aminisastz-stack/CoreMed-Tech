import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DepartmentsSection } from './components/DepartmentsSection';
import { HospitalStatsSplit } from './components/HospitalStatsSplit';
import { FeaturedEmergencySplit } from './components/FeaturedEmergencySplit';
import { WhyChooseUs } from './components/WhyChooseUs';
import { EquipmentCatalog } from './components/EquipmentCatalog';
import { TestimonialAndBookingSplit } from './components/TestimonialAndBookingSplit';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { MaintenanceSLAModal } from './components/MaintenanceSLAModal';
import { ChatbotAndWhatsAppWidget } from './components/ChatbotAndWhatsAppWidget';
import { OfflineIndicator } from './components/OfflineIndicator';

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

  const scrollToCatalog = () => {
    const el = document.getElementById('equipment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 antialiased font-sans">
      {/* 1. Header & Navigation matching reference */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenMaintenanceModal={() => {
          setSelectedServiceForSLA('');
          setIsMaintenanceOpen(true);
        }}
        onOpenCatalog={scrollToCatalog}
      />

      {/* Main Landing Page Flow exactly mirroring the reference design */}
      <main className="flex-1">
        {/* 2. Hero Section: "Expert Care for a Healthier Tomorrow" */}
        <Hero
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
          onScrollToCatalog={scrollToCatalog}
        />

        {/* 3. "Our Departments" 8 Pastel Category Cards Grid */}
        <DepartmentsSection
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
          onOpenCatalog={scrollToCatalog}
        />

        {/* 4. "A Hospital Built Around You" Architecture Photo + 4 Big Stat Counters */}
        <HospitalStatsSplit
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />

        {/* 5. Two Split Featured Cards: "Experienced Doctors" + "Emergency Care When You Need It Most" */}
        <FeaturedEmergencySplit
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* 6. "Why Choose COREMED TECH" 4-Column Feature Row */}
        <WhyChooseUs
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />

        {/* 7. Clinical Grade Equipment Supply & Quotation Catalog */}
        <EquipmentCatalog
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />

        {/* 8. "Real Stories, Real Impact" Testimonial Carousel + "Book Your Appointment Today" Card */}
        <TestimonialAndBookingSplit
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />

        {/* 9. "Latest from Our Blog" 3 Article Cards */}
        <BlogSection
          onOpenMaintenanceModal={() => {
            setSelectedServiceForSLA('');
            setIsMaintenanceOpen(true);
          }}
        />
      </main>

      {/* 10. Corporate Footer */}
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

      {/* Floating AI Chatbot & WhatsApp Widget */}
      <ChatbotAndWhatsAppWidget
        onOpenMaintenanceModal={() => {
          setSelectedServiceForSLA('');
          setIsMaintenanceOpen(true);
        }}
      />

      {/* Offline Connectivity Notification Banner for Remote Clinics */}
      <OfflineIndicator />
    </div>
  );
}
