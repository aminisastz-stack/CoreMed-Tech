import { ServiceItem, EquipmentItem, HospitalTicket } from '../types';

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'diagnostic-equipment',
    title: 'Medical Diagnostic Equipment',
    shortDesc: 'Turnkey procurement, precision installation, and maintenance of digital radiography, ultrasound, CT, MRI, and patient monitors.',
    fullDesc: 'We equip Tanzanian regional referral and private diagnostic facilities with state-of-the-art diagnostic imaging solutions. Every system includes clinical application training, TMDA certification verification, and power conditioning suited for local grid variations.',
    iconName: 'Activity',
    highlights: [
      'Digital Radiography (Fixed & Mobile X-Ray)',
      'High-Definition 3D/4D Color Doppler Ultrasounds',
      'Multi-Slice CT & Superconductive MRI Systems',
      'Electrocardiographs (12-Lead ECG & Holter Monitored)'
    ],
    equipmentCovered: ['Siemens / GE / Mindray Ultrasound', 'Carestream DR Panels', 'Digital C-Arms', 'Cardiac Defibrillators'],
    standards: ['TMDA Device Notification Compliant', 'TBS Electrical Safety Standard', 'ISO 13485 Quality Management']
  },
  {
    id: 'maintenance-calibration',
    title: 'Specialist Hospital Equipment Maintenance & Calibration',
    shortDesc: 'Preventive SLA maintenance, electrical safety analyzer testing, and ISO 17025 compliant calibration for zero unplanned downtime.',
    fullDesc: 'Our certified biomedical clinical engineers perform routine preventive maintenance and precision calibration using Fluke Biomedical analyzers. We verify safety parameters, dose accuracy, pressure sensors, and electrical leakage current to protect patient safety.',
    iconName: 'Wrench',
    highlights: [
      'Annual Maintenance Contracts (Comprehensive & Non-Comprehensive SLAs)',
      'Electrical Safety Analyzer Inspections (IEC 60601 / IEC 62353)',
      'Defibrillator, Ventilator & Infusion Pump Calibration',
      'Traceable Calibration Certificates for Hospital Accreditation'
    ],
    equipmentCovered: ['ICU Ventilators', 'Vital Signs Monitors', 'Electrosurgical Units (ESU)', 'Infusion & Syringe Pumps'],
    standards: ['ISO/IEC 17025 Calibration Traceability', 'IEC 62353 Hospital In-service Standard', 'MoH Inspection Ready']
  },
  {
    id: 'laboratory-supplies',
    title: 'Laboratory Supplies & Fixtures',
    shortDesc: 'Automated clinical chemistry, 5-part hematology systems, biosafety cabinets, and specialized blood bank cold chain equipment.',
    fullDesc: 'Complete diagnostic laboratory infrastructure engineered for high-throughput hospital labs and research facilities. We supply reagents, consumables, automated pipetting units, and calibrated temperature logging solutions across Tanzania.',
    iconName: 'FlaskConical',
    highlights: [
      'Automated 3-Part & 5-Part Differential Hematology Analyzers',
      'Benchtop Clinical Chemistry & Electrolyte Analyzers',
      'Class II Type A2 Biosafety Cabinets & Fume Extractors',
      '+4°C Blood Bank Refrigerators & -80°C Ultra-Low Freezers'
    ],
    equipmentCovered: ['Sysmex / Mindray Hematology', 'Hermle Clinical Centrifuges', 'Water Deionizers', 'Digital Micro-Pipettes'],
    standards: ['WHO Pre-qualified Diagnostics', 'TMDA Laboratory Reagent Registration', 'Cold Chain Verification Protocol']
  },
  {
    id: 'theatre-sterilization',
    title: 'Sterilization & Operating Theatre Products',
    shortDesc: 'Surgical operating tables, shadowless LED lights, anesthesia workstations, and Central Sterile Services Department (CSSD) autoclaves.',
    fullDesc: 'Engineering sterile surgical suites that maximize surgeon comfort and infection control. Our turnkey OT setups include surgical pendant columns, laminar air flow monitoring, and large-chamber CSSD steam sterilizers with automated Bowie-Dick cycle logging.',
    iconName: 'ShieldCheck',
    highlights: [
      'Multi-Movement Electro-Hydraulic Surgical Tables',
      'Ceiling-Mounted Double Dome Shadowless Surgical LED Lights',
      'Advanced Anesthesia Delivery Workstations with Gas Scavenging',
      'Horizontal Pulse Vacuum CSSD Autoclaves (100L to 1500L)'
    ],
    equipmentCovered: ['Dräger / Mindray Anesthesia Units', 'Tuttnauer / Melag Sterilizers', 'Surgical Diathermy', 'OT Pendants'],
    standards: ['EN 285 Steam Sterilization Standard', 'ISO 11140 Chemical Indicator Protocol', 'Hospital Infection Control Guidelines']
  },
  {
    id: 'medical-gas-infrastructure',
    title: 'Medical Gas Pipeline & Clinical Infrastructure',
    shortDesc: 'Complete hospital MGPS design, PSA on-site oxygen generation plants, vacuum pumps, manifold stations, and ICU bedhead units.',
    fullDesc: 'Reliable, uninterrupted clinical gases save lives. We design, weld, pressure-test, and maintain HTM 02-01 and ISO 7396-1 compliant medical gas pipeline systems (MGPS), on-site PSA oxygen generating plants, and medical air compressors for healthcare facilities.',
    iconName: 'Gauge',
    highlights: [
      'On-Site Containerized PSA Oxygen Generating Plants (93% ± 3%)',
      'Automatic Changeover Oxygen & Nitrous Oxide Manifolds',
      'Duplex & Triplex Medical Grade Vacuum and Plant Air Systems',
      'Modular ICU & Ward Bedhead Trunking Units with Integrated Flowmeters'
    ],
    equipmentCovered: ['Atlas Copco / Oxair PSA Plants', 'BeaconMedaes Gas Outlets', 'Medical Vacuum Pumps', 'Zone Valve Boxes'],
    standards: ['HTM 02-01 Medical Gas Pipeline Systems', 'ISO 7396-1 Gas Reticulation Standard', 'Tanzania Fire & Rescue Safety Certified']
  }
];

export const CREDIBILITY_METRICS = [
  { value: '180+', label: 'Hospitals & Labs Supported', sub: 'Across 31 Regions of Tanzania' },
  { value: '4,200+', label: 'Equipment Calibrated', sub: 'ISO 17025 Traceable Protocols' },
  { value: '4-Hour', label: 'Emergency SLA Dispatch', sub: 'Dar es Salaam & Arusha Zones' },
  { value: '99.4%', label: 'Equipment Uptime Guarantee', sub: 'On Comprehensive Maintenance SLAs' },
  { value: '100%', label: 'NeST & TMDA Compliant', sub: 'Registered e-Procurement Vendor' }
];

export const COMPLIANCE_BADGES = [
  { title: 'BRELA Registered', desc: 'Cert. No. 482910 (Tanzania Commercial Registrar)' },
  { title: 'NeST Tender Approved', desc: 'National e-Procurement System of Tanzania Vendor Code' },
  { title: 'TMDA Certified Importer', desc: 'Medical Devices and In-Vitro Diagnostics Distributor' },
  { title: 'Regional Spare Parts Hub', desc: 'Over 12,000 Critical Spares Stocked in Dar & Arusha' }
];

export const FEATURED_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq-1',
    name: 'Mindray Resona I9 Elite Diagnostic Ultrasound',
    category: 'Diagnostic',
    manufacturer: 'Mindray Biomedical',
    model: 'Resona I9 Pro',
    image: '/src/assets/images/mindray_resona_ultrasound_1791133914392.jpg',
    description: 'Breakthrough acoustic intelligence ultrasound platform with single-crystal matrix transducers and ZST+ technology for high-volume obstetrics, cardiology, and general radiology.',
    specifications: [
      '21.5-inch High-Resolution Frameless Medical Display',
      'ZST+ (Zone Sonography Technology) Processing Engine',
      'Sound Touch Elastography (STE) and Smart Breast Workflow',
      'Dual-battery power backup for uninterrupted ward rounds'
    ],
    certifications: ['TMDA Approved', 'CE Marked', 'ISO 13485'],
    availability: 'In Stock (Dar es Salaam)'
  },
  {
    id: 'eq-2',
    name: 'Wato EX-65 Pro Anesthesia Delivery Workstation',
    category: 'Theatre',
    manufacturer: 'Mindray Medical',
    model: 'EX-65 Pro',
    image: '/src/assets/images/operating_theatre_equipment_1791120372232.jpg',
    description: 'Precision anesthesia station with integrated ventilator, electronic flowmeters, anesthetic gas scavenging, and comprehensive patient monitoring for multi-specialty surgery.',
    specifications: [
      '12.1-inch Color Touchscreen with intuitive workflow',
      'Tidal volume down to 5ml (Pediatric to Adult suitability)',
      'Integrated active AGSS (Anesthetic Gas Scavenging System)',
      'Heated breathing circuit prevents water condensation'
    ],
    certifications: ['TMDA Registered', 'EN 60601-1-2', 'ISO 80601-2-13'],
    availability: 'In Stock (Dar es Salaam)'
  },
  {
    id: 'eq-3',
    name: 'BioSafe 360L Hospital CSSD Steam Sterilizer',
    category: 'Theatre',
    manufacturer: 'CoreMed Clinical Solutions',
    model: 'CSSD-P360',
    image: '/src/assets/images/hero_operating_suite_1791133860838.jpg',
    description: 'High-capacity, double-door pass-through steam autoclave with built-in steam generator, micro-computer touch control, and cycle receipt printer for sterile processing departments.',
    specifications: [
      '360 Litres chamber volume (SUS316L medical stainless steel)',
      'Pulsating vacuum drying system with 99.9% moisture removal',
      'Thermal printer output for audit logging and cycle validation',
      'Bowie-Dick and Helix leak test certified programs'
    ],
    certifications: ['EN 285 European Standard', 'TBS Certified', 'ISO 11140'],
    availability: 'On Display (Arusha)'
  },
  {
    id: 'eq-4',
    name: 'Sysmex XN-350 Automated 5-Part Hematology Analyzer',
    category: 'Laboratory',
    manufacturer: 'Sysmex Corporation',
    model: 'XN-350 Compact',
    image: '/src/assets/images/laboratory_hematology_analyzer_1791133935435.jpg',
    description: 'Compact 5-part differential hematology analyzer featuring fluorescence flow cytometry for high precision blood counts even with abnormal morphology.',
    specifications: [
      'Throughput: 60 samples per hour in whole blood mode',
      'Aspiration volume: Only 25 µL whole blood requirement',
      'Fluorescence flow cytometry technology for reliable flags',
      'Direct LIS interface and online reagent consumption monitoring'
    ],
    certifications: ['TMDA IVD Approved', 'WHO Pre-qualified', 'ISO 15189 Ready'],
    availability: 'In Stock (Dar es Salaam)'
  },
  {
    id: 'eq-5',
    name: 'CoreOxy 50Nm³/hr Hospital PSA Oxygen Generation Plant',
    category: 'MedicalGas',
    manufacturer: 'Oxair & CoreMed Systems',
    model: 'PSA-50HC Containerized',
    image: '/src/assets/images/medical_gas_oxygen_manifold_1791133884278.jpg',
    description: 'Turnkey containerized pressure swing adsorption (PSA) medical oxygen plant supplying 93% ± 3% purity clinical oxygen directly to hospital pipeline and cylinder filling ramps.',
    specifications: [
      'Output: 50 Nm³/hr (Equivalent to ~170 standard 50L cylinders/day)',
      'Oxygen purity: 93% ± 3% with automatic purity cut-off valve',
      'Integrated high-pressure cylinder filling booster ramp (150 bar)',
      'Remote telemetry with real-time pressure and purity monitoring'
    ],
    certifications: ['HTM 02-01 Compliant', 'ISO 7396-1', 'Tanzania TBS & TMDA'],
    availability: 'Direct Hospital Import (14 Days)'
  },
  {
    id: 'eq-6',
    name: 'Bellavista 1000 Neo Advanced ICU Ventilator',
    category: 'LifeSupport',
    manufacturer: 'Imtmedical / Vyaire',
    model: 'BV-1000-TZ',
    image: '/src/assets/images/engineer_calibration_hospital_1791120360131.jpg',
    description: 'High-performance turbine-driven ICU ventilator providing non-invasive and invasive ventilation for neonates, pediatric, and adult intensive care patients without compressed air wall feeds.',
    specifications: [
      'High-performance internal turbine (requires zero external compressed air)',
      '13.3-inch glass touch interface with target lung graphics',
      'High-flow oxygen therapy (HFNC) and Lung Recruitment tools',
      'Up to 4 hours hot-swappable internal battery runtime'
    ],
    certifications: ['TMDA Registered', 'IEC 60601-1-8 Alarm Certified', 'CE 0124'],
    availability: 'In Stock (Dar es Salaam)'
  },
  {
    id: 'eq-7',
    name: 'Siemens Magnetom Altea 1.5T Superconductive MRI',
    category: 'Diagnostic',
    manufacturer: 'Siemens Healthineers',
    model: 'Magnetom Altea 1.5T',
    image: '/src/assets/images/siemens_mri_scanner_1791133923794.jpg',
    description: 'Advanced 70cm wide-bore 1.5T superconductive MRI scanner with BioMatrix technology for patient personalization and rapid diagnostic throughput.',
    specifications: [
      '70cm Open Bore with Quiet Suite acoustic reduction',
      'BioMatrix Select technology and Turbo Suite acceleration',
      'Zero-helium boil-off magnet design for tropical conditions',
      'Integrated clinical coil portfolio for neuro, spine, and MSK'
    ],
    certifications: ['TMDA Approved', 'IEC 60601-2-33', 'CE Marked'],
    availability: 'Direct Hospital Import (14 Days)'
  }
];

export const DEMO_TICKETS: HospitalTicket[] = [
  {
    ticketId: 'CMT-2026-9041',
    hospitalName: 'Muhimbili National Hospital (MNH)',
    department: 'Cardio-Thoracic ICU',
    equipmentName: 'Mindray Resona Ultrasound & Philips Monitor Rack',
    issueDescription: 'Semi-annual calibration check & probe acoustic safety verification.',
    priority: 'Scheduled',
    status: 'Calibrated',
    assignedEngineer: 'Eng. Josephat Mwita (Biomedical Lead)',
    dateReported: '2026-10-02',
    estimatedArrival: 'Completed · Certificate Issued'
  },
  {
    ticketId: 'CMT-2026-9048',
    hospitalName: 'Kilimanjaro Christian Medical Centre (KCMC)',
    department: 'Central Sterilization (CSSD)',
    equipmentName: 'BioSafe 360L Steam Autoclave',
    issueDescription: 'Vacuum leak error code E-04 during cycle phase 2. Requires gasket inspection.',
    priority: 'Emergency',
    status: 'Dispatched',
    assignedEngineer: 'Eng. Francisca Mrema (Northern Zone Hub)',
    dateReported: '2026-10-04 (07:15 AM)',
    estimatedArrival: 'En Route · ETA 45 Mins'
  },
  {
    ticketId: 'CMT-2026-9052',
    hospitalName: 'Arusha Lutheran Medical Centre (ALMC)',
    department: 'Main Operating Theatre 2',
    equipmentName: 'Wato EX-65 Anesthesia Machine',
    issueDescription: 'Annual preventive maintenance and oxygen flow sensor recalibration.',
    priority: 'High',
    status: 'Diagnosing',
    assignedEngineer: 'Eng. Kelvin Lyimo',
    dateReported: '2026-10-03',
    estimatedArrival: 'On Site · Work in Progress'
  }
];

export const TESTIMONIALS = [
  {
    quote: 'CoreMed Tech transformed our clinical equipment reliability. Before their SLA, our digital X-ray experienced weeks of downtime waiting for overseas components. Now, their Dar es Salaam spare parts depot and rapid engineers solve repairs within hours.',
    author: 'Dr. Neema M. Kimaro',
    role: 'Clinical Director & Lead Radiologist',
    facility: 'Regency Medical Centre, Dar es Salaam'
  },
  {
    quote: 'During our recent hospital accreditation inspection, CoreMed Tech provided documented Fluke calibration certificates for all 42 ICU ventilators and anesthesia machines. Their technical compliance with TMDA and ISO 17025 is unmatched in Tanzania.',
    author: 'Eng. Baraka J. Mwangi',
    role: 'Head of Biomedical Engineering',
    facility: 'Kilimanjaro Christian Medical Centre (KCMC), Moshi'
  },
  {
    quote: 'The containerized PSA oxygen plant installed by CoreMed Tech has made our regional hospital self-sufficient in medical oxygen. The remote purity telemetry gives our administration absolute peace of mind.',
    author: 'Dr. Emmanuel Shayo',
    role: 'Medical Officer in Charge',
    facility: 'St. Elizabeth Hospital, Arusha'
  }
];
