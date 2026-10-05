import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteImages {
  heroImage: string;
  aboutImage: string;
  diagnosticImage: string;
  mriImage: string;
  theatreImage: string;
  labImage: string;
  medicalGasImage: string;
  telemetryImage: string;
}

export const INSPIRATION_IMAGES: SiteImages = {
  // Attached Inspiration 1: Modern luxury architectural headquarters matching Nexora layout
  heroImage: '/src/assets/images/coremed_hq_architecture_1791132069393.jpg',
  // Attached Inspiration 2: Biomedical engineering collaborative team in modern office matching TechNova layout
  aboutImage: '/src/assets/images/biomedical_team_office_1791132080384.jpg',
  // Specialist clinical equipment assets
  diagnosticImage: '/src/assets/images/mindray_resona_ultrasound_1791133914392.jpg',
  mriImage: '/src/assets/images/siemens_mri_scanner_1791133923794.jpg',
  theatreImage: '/src/assets/images/operating_theatre_equipment_1791120372232.jpg',
  labImage: '/src/assets/images/laboratory_hematology_analyzer_1791133935435.jpg',
  medicalGasImage: '/src/assets/images/medical_gas_oxygen_manifold_1791133884278.jpg',
  telemetryImage: '/src/assets/images/biomedical_telemetry_dashboard_1791132096193.jpg',
};

export const CLINICAL_ALT_IMAGES: Partial<SiteImages> = {
  heroImage: '/src/assets/images/hero_operating_suite_1791133860838.jpg',
  aboutImage: '/src/assets/images/engineer_repairing_ultrasound_1791133872993.jpg',
};

interface BrandContextType {
  customLogo: string | null;
  logoScale: number;
  companyName: string;
  tagline: string;
  siteImages: SiteImages;
  updateLogo: (logoDataUrl: string) => void;
  updateLogoScale: (scale: number) => void;
  resetLogo: () => void;
  updateSiteImage: (slot: keyof SiteImages, imageDataUrl: string) => void;
  rechargeAllImages: () => void;
  resetAllImages: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('coremed_brand_logo');
    } catch {
      return null;
    }
  });

  const [logoScale, setLogoScale] = useState<number>(() => {
    try {
      const savedScale = localStorage.getItem('coremed_brand_logo_scale');
      if (savedScale) {
        const parsed = parseFloat(savedScale);
        if (!isNaN(parsed) && parsed >= 0.8 && parsed <= 2.5) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return 1.15; // Generous default scale for maximum clarity
  });

  const [siteImages, setSiteImages] = useState<SiteImages>(() => {
    try {
      const saved = localStorage.getItem('coremed_site_images');
      if (saved) {
        return { ...INSPIRATION_IMAGES, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return INSPIRATION_IMAGES;
  });

  const updateLogo = (logoDataUrl: string) => {
    setCustomLogo(logoDataUrl);
    try {
      localStorage.setItem('coremed_brand_logo', logoDataUrl);
    } catch (e) {
      console.warn('Could not save logo to localStorage', e);
    }
  };

  const updateLogoScale = (scale: number) => {
    setLogoScale(scale);
    try {
      localStorage.setItem('coremed_brand_logo_scale', scale.toString());
    } catch (e) {
      console.warn('Could not save logo scale to localStorage', e);
    }
  };

  const resetLogo = () => {
    setCustomLogo(null);
    setLogoScale(1.15);
    try {
      localStorage.removeItem('coremed_brand_logo');
      localStorage.removeItem('coremed_brand_logo_scale');
    } catch (e) {
      console.warn('Could not clear logo from localStorage', e);
    }
  };

  const updateSiteImage = (slot: keyof SiteImages, imageDataUrl: string) => {
    setSiteImages((prev) => {
      const next = { ...prev, [slot]: imageDataUrl };
      try {
        localStorage.setItem('coremed_site_images', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save images to localStorage', e);
      }
      return next;
    });
  };

  const rechargeAllImages = () => {
    setSiteImages(INSPIRATION_IMAGES);
    try {
      localStorage.setItem('coremed_site_images', JSON.stringify(INSPIRATION_IMAGES));
    } catch (e) {
      console.warn('Could not recharge images in localStorage', e);
    }
  };

  const resetAllImages = () => {
    setSiteImages(INSPIRATION_IMAGES);
    try {
      localStorage.removeItem('coremed_site_images');
    } catch (e) {
      console.warn('Could not reset images in localStorage', e);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        customLogo,
        logoScale,
        companyName: 'COREMED TECH',
        tagline: 'Biomedical Solutions',
        siteImages,
        updateLogo,
        updateLogoScale,
        resetLogo,
        updateSiteImage,
        rechargeAllImages,
        resetAllImages,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

