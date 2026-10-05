import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'sw' | 'fr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'sw', label: 'Kiswahili', shortLabel: 'SW', flag: '🇹🇿' },
  { code: 'fr', label: 'Français', shortLabel: 'FR', flag: '🇫🇷' },
];

export interface Translations {
  // Nav & Ribbon
  nav: {
    ribbonTitle: string;
    getQuote: string;
    home: string;
    about: string;
    departments: string;
    equipment: string;
    compliance: string;
    contact: string;
    bookAppointment: string;
    portalLogin: string;
    searchEquipment: string;
    installApp: string;
    installIOS: string;
  };
  // Hero
  hero: {
    kicker: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statHospitals: string;
    statHospitalsDesc: string;
    statUptime: string;
    statUptimeDesc: string;
    statResponse: string;
    statResponseDesc: string;
    tagDispatch: string;
    tagEngineers: string;
    tagIso: string;
  };
  // Departments
  departments: {
    kicker: string;
    title: string;
    subtitle: string;
    viewAll: string;
    emergencySla: string;
    viewSpecs: string;
    requestSla: string;
    close: string;
    modalTitle: string;
    dept1Title: string;
    dept1Desc: string;
    dept2Title: string;
    dept2Desc: string;
    dept3Title: string;
    dept3Desc: string;
    dept4Title: string;
    dept4Desc: string;
    dept5Title: string;
    dept5Desc: string;
    dept6Title: string;
    dept6Desc: string;
    dept7Title: string;
    dept7Desc: string;
    dept8Title: string;
    dept8Desc: string;
  };
  // Hospital Stats Split
  statsSplit: {
    kicker: string;
    title: string;
    desc1: string;
    desc2: string;
    counter1Value: string;
    counter1Label: string;
    counter2Value: string;
    counter2Label: string;
    counter3Value: string;
    counter3Label: string;
    counter4Value: string;
    counter4Label: string;
    cta: string;
  };
  // Featured Emergency Split
  featuredSplit: {
    leftKicker: string;
    leftTitle: string;
    leftDesc: string;
    leftCta: string;
    rightKicker: string;
    rightTitle: string;
    rightDesc: string;
    rightCall: string;
  };
  // Why Choose Us
  whyChoose: {
    kicker: string;
    title: string;
    subtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
  };
  // Equipment Catalog
  catalog: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    categoryAll: string;
    categoryDiagnostic: string;
    categoryIcu: string;
    categoryLab: string;
    categorySurgical: string;
    categoryGas: string;
    requestQuote: string;
    viewPassport: string;
    tmdaCompliant: string;
    inStock: string;
    specs: string;
  };
  // Testimonials & Booking Split
  testimonials: {
    kicker: string;
    title: string;
    verifiedDirector: string;
    bookTitle: string;
    bookDesc: string;
    bookCta: string;
    directLine: string;
  };
  // Blog
  blog: {
    kicker: string;
    title: string;
    subtitle: string;
    readArticle: string;
    article1Tag: string;
    article1Title: string;
    article1Desc: string;
    article2Tag: string;
    article2Title: string;
    article2Desc: string;
    article3Tag: string;
    article3Title: string;
    article3Desc: string;
  };
  // Footer
  footer: {
    tagline: string;
    hqArusha: string;
    depotDar: string;
    hotline: string;
    rights: string;
    quickLinks: string;
    services: string;
    compliance: string;
    portalAccess: string;
  };
  // Offline & Common
  common: {
    offlineTitle: string;
    offlineDesc: string;
    cached: string;
    close: string;
    emergencyHotline: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    nav: {
      ribbonTitle: 'Tanzania 24/7 Biomedical Emergency Dispatch & SLAs:',
      getQuote: 'Get a Free SLA Quote',
      home: 'Home',
      about: 'About',
      departments: 'Departments',
      equipment: 'Equipment',
      compliance: 'Compliance',
      contact: 'Contact',
      bookAppointment: 'Book Appointment',
      portalLogin: 'Portal Login',
      searchEquipment: 'Search Equipment',
      installApp: 'Install App',
      installIOS: 'Install on iOS',
    },
    hero: {
      kicker: 'BIOMEDICAL ENGINEERING & CLINICAL INFRASTRUCTURE · TANZANIA',
      titleLine1: 'Expert Care for a',
      titleHighlight: 'Healthier Tomorrow',
      titleLine2: 'in East Africa',
      subtitle:
        'Certified medical equipment calibration, ISO 17025 certified maintenance, and 24/7 emergency clinical engineering support across referral and regional hospitals in Tanzania.',
      ctaPrimary: 'Book an Appointment',
      ctaSecondary: 'Find Equipment & Specs',
      statHospitals: '120+',
      statHospitalsDesc: 'Partner Hospitals & Clinics',
      statUptime: '99.4%',
      statUptimeDesc: 'Clinical Uptime Guarantee',
      statResponse: '<4 Hrs',
      statResponseDesc: 'Rapid Regional Dispatch',
      tagDispatch: '24/7 Rapid Dispatch',
      tagEngineers: 'Certified Engineers',
      tagIso: 'ISO 17025 & TMDA Compliant',
    },
    departments: {
      kicker: 'OUR DEPARTMENTS & CLINICAL CAPABILITIES',
      title: 'Comprehensive Biomedical Solutions',
      subtitle: 'From ICU life-support calibration to advanced radiology and laboratory systems.',
      viewAll: 'View All Capabilities',
      emergencySla: 'Emergency SLA Available',
      viewSpecs: 'View Engineering Specs',
      requestSla: 'Request SLA & Support',
      close: 'Close',
      modalTitle: 'Engineering Specifications & Protocols',
      dept1Title: 'Cardiology & ECG Systems',
      dept1Desc: 'Patient telemetry, defibrillators, Holter monitors, and stress ECG systems.',
      dept2Title: 'Neurology & EEG',
      dept2Desc: 'Precision brain monitoring, EEG diagnostic arrays, and neuro-stimulation repair.',
      dept3Title: 'ICU & Critical Care',
      dept3Desc: 'Mechanical ventilators, CPAP/BiPAP, syringe pumps, and ICU multi-parameter monitors.',
      dept4Title: 'Pediatrics & Neonatal Care',
      dept4Desc: 'Infant incubators, radiant warmers, phototherapy, and neonatal vitals monitoring.',
      dept5Title: 'Surgical & Theatre Tech',
      dept5Desc: 'Electrosurgical units (ESU), anesthesia workstations, and operating LED lighting.',
      dept6Title: 'Medical Imaging & Ultrasound',
      dept6Desc: 'Color Doppler ultrasound, digital X-Ray calibration, and probe acoustic diagnostics.',
      dept7Title: 'Laboratory & Diagnostic',
      dept7Desc: 'Automated biochemistry analyzers, hematology counters, and centrifuges.',
      dept8Title: 'Medical Gas & Cryogenics',
      dept8Desc: 'Central oxygen manifolds, pipeline alarms, vacuum pumps, and IoT pressure sensors.',
    },
    statsSplit: {
      kicker: 'ENGINEERING EXCELLENCE IN TANZANIA',
      title: 'A Hospital Built Around You and Your Patients',
      desc1:
        'At COREMED TECH, we engineer healthcare resilience. For over a decade, we have partnered with public and private healthcare facilities across Tanzania to eliminate diagnostic downtime and uphold international clinical safety standards.',
      desc2:
        'Our certified biomedical engineers are equipped with calibrated electrical safety analyzers, gas flow analyzers, and TMDA-approved calibration standards.',
      counter1Value: '99.4%',
      counter1Label: 'Average Uptime Delivered',
      counter2Value: '1,450+',
      counter2Label: 'Devices Calibrated Annually',
      counter3Value: '120+',
      counter3Label: 'Partner Medical Centers',
      counter4Value: '24/7',
      counter4Label: 'On-Call Rapid Dispatch',
      cta: 'Explore Our Engineering Credentials',
    },
    featuredSplit: {
      leftKicker: 'CERTIFIED BIOMEDICAL ENGINEERS',
      leftTitle: 'Expert Engineers, Exceptional Clinical Reliability',
      leftDesc:
        'Our factory-trained biomedical engineering specialists provide preventative maintenance, precision calibration, and regulatory compliance dossiers for tier-one healthcare facilities.',
      leftCta: 'Meet Our Clinical Team',
      rightKicker: '24/7 RAPID DISPATCH',
      rightTitle: 'Emergency Clinical Support When You Need It Most',
      rightDesc:
        'Immediate on-site response for ICU ventilators, anesthesia workstations, and operating theatre life-support machinery across Tanzania.',
      rightCall: 'Direct Emergency Call',
    },
    whyChoose: {
      kicker: 'WHY CHOOSE COREMED TECH',
      title: 'Delivering Healthcare Reliability with Precision',
      subtitle: 'Committed to clinical safety, equipment uptime, and rigorous compliance.',
      feat1Title: 'TMDA & ISO 17025 Certified',
      feat1Desc: 'All calibration procedures strictly comply with national and international medical standards.',
      feat2Title: 'Under 4-Hour Response SLA',
      feat2Desc: 'Rapid deployment squads located strategically in Arusha and Dar es Salaam hubs.',
      feat3Title: 'Genuine OEM Spare Parts',
      feat3Desc: 'Direct supply chains for authentic medical equipment components with warranty coverage.',
      feat4Title: 'Digital Maintenance Passports',
      feat4Desc: 'QR-enabled asset tracking and verifiable cloud calibration history for every machine.',
    },
    catalog: {
      badge: 'CLINICAL GRADE MEDICAL SYSTEMS',
      title: 'Equipment Supply & Calibration Archive',
      subtitle: 'Browse certified hospital devices, download technical specifications, or generate pro-forma quotes.',
      searchPlaceholder: 'Search equipment by name, brand, model, or TMDA tag...',
      categoryAll: 'All Systems',
      categoryDiagnostic: 'Diagnostic & Ultrasound',
      categoryIcu: 'ICU & Life Support',
      categoryLab: 'Laboratory Analyzers',
      categorySurgical: 'Surgical & Theatre',
      categoryGas: 'Medical Gas & IoT',
      requestQuote: 'Request Quote & Specs',
      viewPassport: 'QR Tag & History',
      tmdaCompliant: 'TMDA Compliant',
      inStock: 'Depot Stock',
      specs: 'Key Specifications',
    },
    testimonials: {
      kicker: 'REAL STORIES, REAL IMPACT',
      title: 'Trusted by Tanzania’s Leading Healthcare Leaders',
      verifiedDirector: 'Verified Hospital Director',
      bookTitle: 'Schedule Equipment Inspection & Calibration',
      bookDesc: 'Get a tailored SLA contract or request immediate on-site equipment diagnostic triage for your hospital.',
      bookCta: 'Book an Appointment Now',
      directLine: 'Direct Hotline',
    },
    blog: {
      kicker: 'LATEST FROM OUR BIOMEDICAL BLOG',
      title: 'Biomedical Insights & Regulatory Updates',
      subtitle: 'Stay updated on medical device safety, TMDA compliance, and clinical equipment best practices.',
      readArticle: 'Read Full Guide',
      article1Tag: 'Clinical Safety',
      article1Title: 'Essential Calibration Protocols for ICU Ventilators in 2026',
      article1Desc: 'Learn how regular flow and oxygen cell testing protects critical patients and prevents costly failures.',
      article2Tag: 'Regulatory Compliance',
      article2Title: 'Navigating TMDA Medical Device Regulations in Tanzania',
      article2Desc: 'A comprehensive checklist for hospital administrators to maintain full legal and clinical accreditation.',
      article3Tag: 'IoT Telemetry',
      article3Title: 'Real-Time Medical Gas Monitoring: Preventing Oxygen Outages',
      article3Desc: 'How IoT manifold telemetry saves hospital costs and guarantees uninterrupted oxygen delivery.',
    },
    footer: {
      tagline: 'Premier biomedical engineering solutions, ISO 17025 calibration, and hospital infrastructure services in Tanzania.',
      hqArusha: 'Arusha HQ: Njiro Complex, Block 4, Arusha',
      depotDar: 'Dar Depot: Mikocheni Light Industrial Zone, Dar es Salaam',
      hotline: '24/7 Rapid Dispatch: +255 742 296 631',
      rights: 'COREMED TECH. All rights reserved. Registered under BRELA #482910.',
      quickLinks: 'Quick Links',
      services: 'Clinical Services',
      compliance: 'Compliance & Standards',
      portalAccess: 'Portal & Client Access',
    },
    common: {
      offlineTitle: 'Offline Clinical Mode Active',
      offlineDesc: 'Cached catalogs, calibration specs & emergency protocols ready.',
      cached: 'Cached',
      close: 'Close',
      emergencyHotline: 'Emergency Hotline',
    },
  },
  sw: {
    nav: {
      ribbonTitle: 'Huduma za Dharura ya Uhandisi Tiba Tanzania Saa 24/7:',
      getQuote: 'Pata Makisio ya SLA Bure',
      home: 'Mwanzo',
      about: 'Kuhusu Sisi',
      departments: 'Vitengo',
      equipment: 'Vifaa Tiba',
      compliance: 'Viwango na Sheria',
      contact: 'Wasiliana Nasi',
      bookAppointment: 'Weka Miadi ya Huduma',
      portalLogin: 'Ingia Portal',
      searchEquipment: 'Tafuta Vifaa Tiba',
      installApp: 'Sakinisha Programu',
      installIOS: 'Sakinisha kwenye iOS',
    },
    hero: {
      kicker: 'UHANDISI TIBA NA MIUNDOMBINU YA AFYA · TANZANIA',
      titleLine1: 'Huduma ya Kitaalamu kwa',
      titleHighlight: 'Afya Bora ya Kesho',
      titleLine2: 'Afrika Mashariki',
      subtitle:
        'Urekebishaji (calibration) wa vifaa tiba, matengenezo ya viwango vya ISO 17025, na msaada wa dharura wa saa 24/7 kwa hospitali za rufaa na mikoa kote Tanzania.',
      ctaPrimary: 'Weka Miadi ya Huduma',
      ctaSecondary: 'Tazama Vifaa na Sifa',
      statHospitals: '120+',
      statHospitalsDesc: 'Hospitali na Vituo vya Afya',
      statUptime: '99.4%',
      statUptimeDesc: 'Uhakika wa Vifaa Kufanya Kazi',
      statResponse: '<Saa 4',
      statResponseDesc: 'Majibu ya Haraka Mikoani',
      tagDispatch: 'Huduma ya Haraka 24/7',
      tagEngineers: 'Wahandisi Walioidhinishwa',
      tagIso: 'Viwango vya ISO 17025 na TMDA',
    },
    departments: {
      kicker: 'VITENGO NA UWEZO WETU WA KITAALAMU',
      title: 'Suluhisho Kamili za Uhandisi Tiba',
      subtitle: 'Kutoka urekebishaji wa mashine za ICU hadi mifumo ya kisasa ya radiolojia na maabara.',
      viewAll: 'Tazama Uwezo Wote',
      emergencySla: 'Mkataba wa Dharura Upo',
      viewSpecs: 'Tazama Sifa za Kihandisi',
      requestSla: 'Omba SLA na Msaada',
      close: 'Funga',
      modalTitle: 'Sifa za Kihandisi na Miongozo',
      dept1Title: 'Mifumo ya Moyo na ECG',
      dept1Desc: 'Mifumo ya telemetry ya wagonjwa, mashine za kushtua moyo (defibrillator), na vipimo vya moyo.',
      dept2Title: 'Mifumo ya Mishipa ya Fahamu na EEG',
      dept2Desc: 'Ufuatiliaji wa ubongo, vipimo vya EEG, na ukarabati wa vifaa vya mishipa ya fahamu.',
      dept3Title: 'ICU na Huduma Mahututi',
      dept3Desc: 'Mashine za kupumulia (ventilators), CPAP/BiPAP, pampu za sindano, na monitors za ICU.',
      dept4Title: 'Watoto na Watoto Wachanga',
      dept4Desc: 'Incubator za watoto njiti, radiant warmers, phototherapy, na vipimo vya watoto wachanga.',
      dept5Title: 'Upasuaji na Vyumba vya Upasuaji',
      dept5Desc: 'Mashine za kukatia za ESU, mashine za nusu kaputi (anesthesia), na taa za upasuaji.',
      dept6Title: 'Picha za Tiba na Ultrasound',
      dept6Desc: 'Color Doppler Ultrasound, mashine za X-Ray ya dijitali, na vipimo vya probe.',
      dept7Title: 'Maabara na Uchunguzi',
      dept7Desc: 'Mifumo ya otomatiki ya biochemistry, vifaa vya kuhesabu damu (CBC), na centrifuge.',
      dept8Title: 'Gesi Tiba na Mifumo ya Oksijeni',
      dept8Desc: 'Manifolds za oksijeni kuu, kengele za mfumo wa bomba, pampu za hewa, na sensor za IoT.',
    },
    statsSplit: {
      kicker: 'UBORA WA KIHANDISI NCHINI TANZANIA',
      title: 'Hospitali Iliyojengwa kwa Ajili Yako na Wagonjwa Wako',
      desc1:
        'Katika COREMED TECH, tunaimarisha uthabiti wa mifumo ya afya. Kwa zaidi ya muongo mmoja, tumeshirikiana na hospitali za umma na binafsi Tanzania kuzuia hitilafu za mashine na kukuza viwango vya usalama wa kimataifa.',
      desc2:
        'Wahandisi wetu wa tiba wana vyeti na wamejizatiti na vifaa vya kisasa vya kupima usalama wa umeme, mtiririko wa gesi, na miongozo iliyoidhinishwa na TMDA.',
      counter1Value: '99.4%',
      counter1Label: 'Wastani wa Mashine Kufanya Kazi',
      counter2Value: '1,450+',
      counter2Label: 'Vifaa Vinavyopimwa Kila Mwaka',
      counter3Value: '120+',
      counter3Label: 'Vituo vya Afya Vinavyotuhudumia',
      counter4Value: '24/7',
      counter4Label: 'Timu ya Dharura Tayari Saa Zote',
      cta: 'Tazama Vigezo na Vyeti Vyetu',
    },
    featuredSplit: {
      leftKicker: 'WAHANDISI TIBA WALIOIDHINISHWA',
      leftTitle: 'Wahandisi Bingwa, Uhakika wa Juu wa Kiutendaji',
      leftDesc:
        'Wataalamu wetu wa uhandisi tiba waliofunzwa viwandani hutoa matengenezo kinga, upimaji sahihi wa calibration, na nyaraka za TMDA kwa vituo vikubwa vya afya.',
      leftCta: 'Fahamu Timu Yetu ya Wahandisi',
      rightKicker: 'HUDUMA YA DHARURA 24/7',
      rightTitle: 'Msaada wa Haraka wa Dharura Unapohitajika Zaidi',
      rightDesc:
        'Majibu ya papo hapo kwa mashine za kupumulia ICU, mashine za nusu kaputi, na vifaa vya vyumba vya upasuaji kote Tanzania.',
      rightCall: 'Piga Simu ya Dharura Moja kwa Moja',
    },
    whyChoose: {
      kicker: 'KWA NINI UCHAGUE COREMED TECH',
      title: 'Kutoa Uhakika wa Vifaa Tiba kwa Usahihi wa Hali ya Juu',
      subtitle: 'Tumejitolea kwa usalama wa wagonjwa, vifaa kutoharibika, na kufuata sheria kikamilifu.',
      feat1Title: 'Vyeti vya TMDA na ISO 17025',
      feat1Desc: 'Taratibu zote za calibration zinafuata kikamilifu viwango vya kitaifa na kimataifa.',
      feat2Title: 'Muda wa Majibu Chini ya Saa 4',
      feat2Desc: 'Vikosi vya dharura vilivyopo kimkakati kwenye vitovu vya Arusha na Dar es Salaam.',
      feat3Title: 'Vipuri Halisi vya Asili (OEM)',
      feat3Desc: 'Ugavi wa moja kwa moja wa vipuri asilia vya vifaa tiba vyenye dhamana ya kiwanda.',
      feat4Title: 'Pasipoti za Kidijitali za Matengenezo',
      feat4Desc: 'Ufuatiliaji wa vifaa kwa QR code na rekodi za calibration mtandaoni kwa kila mashine.',
    },
    catalog: {
      badge: 'MIFUMO YA VIFAA TIBA VYA KIWANGO CHA JUU',
      title: 'Katalogi ya Vifaa na Kumbukumbu ya Calibration',
      subtitle: 'Chunguza vifaa vilivyoidhinishwa, pakua sifa za kiufundi, au omba makadirio ya bei (pro-forma).',
      searchPlaceholder: 'Tafuta vifaa kwa jina, modeli, au lebo ya TMDA...',
      categoryAll: 'Mifumo Yote',
      categoryDiagnostic: 'Uchunguzi na Ultrasound',
      categoryIcu: 'ICU na Kuokoa Maisha',
      categoryLab: 'Vifaa vya Maabara',
      categorySurgical: 'Vyumba vya Upasuaji',
      categoryGas: 'Gesi Tiba na IoT',
      requestQuote: 'Omba Makisio na Sifa',
      viewPassport: 'Lebo ya QR na Historia',
      tmdaCompliant: 'Imeidhinishwa na TMDA',
      inStock: 'Vipo Ghala',
      specs: 'Sifa Kuu za Kiufundi',
    },
    testimonials: {
      kicker: 'SIMULIZI HALISI, MATOKEO THABITI',
      title: 'Inaaminiwa na Viongozi Wakuu wa Afya Tanzania',
      verifiedDirector: 'Mkurugenzi wa Hospitali Aliyethibitishwa',
      bookTitle: 'Panga Ukaguzi na Calibration ya Vifaa Vyako',
      bookDesc: 'Pata mkataba wa huduma wa SLA au omba uchunguzi wa haraka wa mashine hospitalini kwako.',
      bookCta: 'Weka Miadi ya Huduma Sasa',
      directLine: 'Nambari ya Dharura',
    },
    blog: {
      kicker: 'HABARI MPYA KUTOKA KWENYE BLOG YETU',
      title: 'Uelewa wa Uhandisi Tiba na Miongozo ya TMDA',
      subtitle: 'Pata taarifa za hivi karibuni kuhusu usalama wa vifaa tiba, sheria za TMDA, na utunzaji bora wa mashine.',
      readArticle: 'Soma Mwongozo Kamili',
      article1Tag: 'Usalama wa Wagonjwa',
      article1Title: 'Miongozo Muhimu ya Calibration ya Mashine za ICU Mwaka 2026',
      article1Desc: 'Fahamu jinsi upimaji wa mtiririko na sensor za oksijeni unavyookoa maisha na kuzuia uharibifu wa gharama.',
      article2Tag: 'Sheria na Viwango',
      article2Title: 'Kuelewa Kanuni za Vifaa Tiba za TMDA Tanzania',
      article2Desc: 'Orodha muhimu kwa wasimamizi wa hospitali kudumisha vibali halali vya kisheria na kitaalamu.',
      article3Tag: 'Mifumo ya IoT',
      article3Title: 'Ufuatiliaji wa Gesi Tiba kwa IoT: Kuzuia Kukatika kwa Oksijeni',
      article3Desc: 'Jinsi sensor za IoT zinavyookoa gharama za hospitali na kuhakikisha oksijeni haikatiki.',
    },
    footer: {
      tagline: 'Suluhisho bora za uhandisi tiba, calibration ya ISO 17025, na huduma za miundombinu ya hospitali Tanzania.',
      hqArusha: 'Makao Makuu Arusha: Njiro Complex, Block 4, Arusha',
      depotDar: 'Ghala Dar es Salaam: Mikocheni Light Industrial Zone, Dar es Salaam',
      hotline: 'Dharura Saa 24/7: +255 742 296 631',
      rights: 'COREMED TECH. Haki zote zimehifadhiwa. Imesajiliwa BRELA #482910.',
      quickLinks: 'Viungo vya Haraka',
      services: 'Huduma za Kitabibu',
      compliance: 'Viwango na Sheria',
      portalAccess: 'Mlango wa Wateja na Wafanyakazi',
    },
    common: {
      offlineTitle: 'Hali ya Nje ya Mtandao Imeanza',
      offlineDesc: 'Katalogi, sifa za calibration na miongozo ya dharura ipo tayari.',
      cached: 'Imehifadhiwa',
      close: 'Funga',
      emergencyHotline: 'Nambari ya Dharura',
    },
  },
  fr: {
    nav: {
      ribbonTitle: 'Intervention d’Urgence Biomédicale 24/7 & Accords SLA en Tanzanie :',
      getQuote: 'Obtenir un Devis SLA Gratuit',
      home: 'Accueil',
      about: 'À Propos',
      departments: 'Départements',
      equipment: 'Équipements',
      compliance: 'Conformité',
      contact: 'Contact',
      bookAppointment: 'Prendre Rendez-vous',
      portalLogin: 'Connexion Portail',
      searchEquipment: 'Rechercher un Équipement',
      installApp: 'Installer l’Application',
      installIOS: 'Installer sur iOS',
    },
    hero: {
      kicker: 'GÉNIE BIOMÉDICAL & INFRASTRUCTURES CLINIQUES · TANZANIE',
      titleLine1: 'Des Soins Experts pour un',
      titleHighlight: 'Avenir Plus Sain',
      titleLine2: 'en Afrique de l’Est',
      subtitle:
        'Étalonnage certifié d’équipements médicaux, maintenance aux normes ISO 17025 et assistance d’ingénierie clinique 24h/24 et 7j/7 pour les hôpitaux de référence en Tanzanie.',
      ctaPrimary: 'Prendre un Rendez-vous',
      ctaSecondary: 'Consulter le Catalogue & Spécifications',
      statHospitals: '120+',
      statHospitalsDesc: 'Hôpitaux et Cliniques Partenaires',
      statUptime: '99.4%',
      statUptimeDesc: 'Garantie de Disponibilité Clinique',
      statResponse: '<4 Heures',
      statResponseDesc: 'Déploiement Régional d’Urgence',
      tagDispatch: 'Intervention Rapide 24/7',
      tagEngineers: 'Ingénieurs Certifiés',
      tagIso: 'Conforme ISO 17025 & TMDA',
    },
    departments: {
      kicker: 'NOS DÉPARTEMENTS & COMPÉTENCES CLINIQUES',
      title: 'Solutions Complètes de Génie Biomédical',
      subtitle: 'De l’étalonnage du matériel de réanimation aux systèmes avancés de radiologie et de laboratoire.',
      viewAll: 'Voir Toutes les Compétences',
      emergencySla: 'Contrat d’Urgence Disponible',
      viewSpecs: 'Spécifications Techniques',
      requestSla: 'Demander un SLA & Support',
      close: 'Fermer',
      modalTitle: 'Spécifications Techniques & Protocoles',
      dept1Title: 'Cardiologie & Systèmes ECG',
      dept1Desc: 'Télémétrie des patients, défibrillateurs, moniteurs Holter et systèmes ECG d’effort.',
      dept2Title: 'Neurologie & EEG',
      dept2Desc: 'Surveillance cérébrale de précision, réseaux de diagnostic EEG et réparation de neurostimulation.',
      dept3Title: 'Soins Intensifs & Réanimation (USI)',
      dept3Desc: 'Ventilateurs mécaniques, CPAP/BiPAP, pousse-seringues et moniteurs multiparamétriques.',
      dept4Title: 'Pédiatrie & Soins Néonataux',
      dept4Desc: 'Incubateurs néonataux, tables radiantes, photothérapie et surveillance des signes vitaux.',
      dept5Title: 'Chirurgie & Blocs Opératoires',
      dept5Desc: 'Bistouris électriques (ESU), stations d’anesthésie et éclairages opératoires à LED.',
      dept6Title: 'Imagerie Médicale & Échographie',
      dept6Desc: 'Échographie Doppler couleur, étalonnage de radiologie numérique et diagnostic acoustique des sondes.',
      dept7Title: 'Laboratoire & Diagnostic',
      dept7Desc: 'Automates de biochimie, compteurs d’hématologie (NFS) et centrifugeuses.',
      dept8Title: 'Fluides Médicaux & Cryogénie',
      dept8Desc: 'Centrales d’oxygène, alarmes de réseau, pompes à vide et capteurs de pression connectés (IoT).',
    },
    statsSplit: {
      kicker: 'EXCELLENCE EN INGÉNIERIE EN TANZANIE',
      title: 'Un Hôpital Conçu Pour Vous et Vos Patients',
      desc1:
        'Chez COREMED TECH, nous concevons la résilience des soins de santé. Depuis plus d’une décennie, nous collaborons avec les établissements de santé publics et privés en Tanzanie pour éliminer les temps d’arrêt critiques et garantir la sécurité des patients.',
      desc2:
        'Nos ingénieurs biomédicaux certifiés disposent d’analyseurs de sécurité électrique calibrés, d’analyseurs de débit de gaz et d’étalons approuvés par la TMDA.',
      counter1Value: '99.4%',
      counter1Label: 'Taux de Disponibilité Moyen',
      counter2Value: '1 450+',
      counter2Label: 'Appareils Étalonnés par An',
      counter3Value: '120+',
      counter3Label: 'Centres Médicaux Partenaires',
      counter4Value: '24/7',
      counter4Label: 'Équipe d’Urgence en Astreinte',
      cta: 'Découvrir Nos Certifications',
    },
    featuredSplit: {
      leftKicker: 'INGÉNIEURS BIOMÉDICAUX CERTIFIÉS',
      leftTitle: 'Ingénieurs Experts, Fiabilité Clinique Exceptionnelle',
      leftDesc:
        'Nos spécialistes biomédicaux formés par les fabricants assurent la maintenance préventive, l’étalonnage de précision et la conformité réglementaire pour les hôpitaux de premier plan.',
      leftCta: 'Découvrir Notre Équipe Clinique',
      rightKicker: 'INTERVENTION RAPIDE 24/7',
      rightTitle: 'Assistance d’Urgence Quand Vous en Avez le Plus Besoin',
      rightDesc:
        'Intervention immédiate sur site pour les respirateurs d’USI, les appareils d’anesthésie et le matériel de bloc opératoire en Tanzanie.',
      rightCall: 'Appel d’Urgence Direct',
    },
    whyChoose: {
      kicker: 'POURQUOI CHOISIR COREMED TECH',
      title: 'Garantir la Fiabilité Médicale avec une Précision Absolue',
      subtitle: 'Engagés envers la sécurité clinique, la disponibilité des équipements et la stricte conformité.',
      feat1Title: 'Certifié TMDA & ISO 17025',
      feat1Desc: 'Toutes les procédures d’étalonnage respectent scrupuleusement les normes médicales internationales.',
      feat2Title: 'Délai d’Intervention < 4 Heures',
      feat2Desc: 'Unités d’intervention rapide déployées stratégiquement depuis nos centres d’Arusha et de Dar es Salaam.',
      feat3Title: 'Pièces Détachées d’Origine (OEM)',
      feat3Desc: 'Approvisionnement direct en pièces d’origine certifiées constructeur avec garantie.',
      feat4Title: 'Passeports Numériques d’Équipement',
      feat4Desc: 'Traçabilité par QR code et historique d’étalonnage cloud vérifiable pour chaque dispositif.',
    },
    catalog: {
      badge: 'SYSTÈMES MÉDICAUX DE QUALITÉ CLINIQUE',
      title: 'Approvisionnement en Équipements & Registre d’Étalonnage',
      subtitle: 'Explorez nos dispositifs certifiés, téléchargez les fiches techniques ou générez des devis pro forma.',
      searchPlaceholder: 'Rechercher par nom, marque, modèle ou étiquette TMDA...',
      categoryAll: 'Tous les Systèmes',
      categoryDiagnostic: 'Diagnostic & Échographie',
      categoryIcu: 'Réanimation & Soins Intensifs',
      categoryLab: 'Analyseurs de Laboratoire',
      categorySurgical: 'Chirurgie & Bloc',
      categoryGas: 'Fluides Médicaux & IoT',
      requestQuote: 'Demander Devis & Fiche',
      viewPassport: 'Passeport QR & Historique',
      tmdaCompliant: 'Conforme TMDA',
      inStock: 'En Stock au Dépôt',
      specs: 'Spécifications Clés',
    },
    testimonials: {
      kicker: 'TÉMOIGNAGES RÉELS, IMPACT CONCRET',
      title: 'Plébiscité par les Dirigeants de Santé en Tanzanie',
      verifiedDirector: 'Directeur d’Hôpital Vérifié',
      bookTitle: 'Planifier l’Inspection & l’Étalonnage de vos Équipements',
      bookDesc: 'Bénéficiez d’un contrat SLA sur-mesure ou demandez un diagnostic d’urgence sur site pour votre établissement.',
      bookCta: 'Prendre Rendez-vous Maintenant',
      directLine: 'Ligne Directe d’Urgence',
    },
    blog: {
      kicker: 'DERNIERS ARTICLES DE NOTRE BLOG BIOMÉDICAL',
      title: 'Actualités Biomédicales & Directives Réglementaires',
      subtitle: 'Restez informé sur la sécurité des dispositifs médicaux, les normes TMDA et les meilleures pratiques.',
      readArticle: 'Lire le Guide Complet',
      article1Tag: 'Sécurité Clinique',
      article1Title: 'Protocoles d’Étalonnage Essentiels pour Ventilateurs d’USI en 2026',
      article1Desc: 'Comment le contrôle régulier des débits et des cellules O2 protège les patients en état critique.',
      article2Tag: 'Conformité Réglementaire',
      article2Title: 'Maîtriser les Réglementations TMDA des Dispositifs Médicaux en Tanzanie',
      article2Desc: 'La liste de contrôle complète pour les directeurs d’hôpitaux afin de maintenir leur accréditation légale.',
      article3Tag: 'Télémétrie IoT',
      article3Title: 'Surveillance des Fluides Médicaux par IoT : Éviter les Pénuries d’Oxygène',
      article3Desc: 'Comment la télémétrie des centrales d’oxygène réduit les coûts hospitaliers et garantit l’approvisionnement.',
    },
    footer: {
      tagline: 'Solutions de pointe en génie biomédical, étalonnage ISO 17025 et infrastructures hospitalières en Tanzanie.',
      hqArusha: 'Siège Arusha : Njiro Complex, Block 4, Arusha',
      depotDar: 'Dépôt Dar : Mikocheni Light Industrial Zone, Dar es Salaam',
      hotline: 'Urgence 24/7 : +255 742 296 631',
      rights: 'COREMED TECH. Tous droits réservés. Enregistré sous BRELA #482910.',
      quickLinks: 'Liens Rapides',
      services: 'Services Cliniques',
      compliance: 'Normes & Conformité',
      portalAccess: 'Accès Portail & Clients',
    },
    common: {
      offlineTitle: 'Mode Clinique Hors Ligne Actif',
      offlineDesc: 'Catalogues, fiches d’étalonnage et protocoles d’urgence disponibles.',
      cached: 'En Cache',
      close: 'Fermer',
      emergencyHotline: 'Ligne d’Urgence',
    },
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('coremed_language') as LanguageCode;
      if (saved && (saved === 'en' || saved === 'sw' || saved === 'fr')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('coremed_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
