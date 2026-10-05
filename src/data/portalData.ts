export interface HospitalFacility {
  id: string;
  name: string;
  location: string;
  region: string;
  type: string;
  slaTier: string;
  contractNumber: string;
  contactPerson: string;
  phone: string;
  activeEquipmentCount: number;
  openTicketsCount: number;
}

export interface RegisteredEquipment {
  id: string;
  serialNumber: string;
  facilityId: string;
  name: string;
  department: string;
  manufacturer: string;
  model: string;
  installationDate: string;
  lastCalibrationDate: string;
  nextCalibrationDue: string;
  calibrationStatus: 'Valid' | 'Due Soon' | 'Overdue';
  uptimePercentage: number;
  slaCoverage: 'Comprehensive Tier 1' | 'Calibration Only' | 'Warranty';
  operationalStatus: 'Operational' | 'Requires Attention' | 'Under Maintenance';
  qrCodeTag: string;
  powerRequirements: string;
  lastServiceNotes: string;
}

export interface CalibrationRecord {
  id: string;
  certificateNumber: string;
  equipmentId: string;
  equipmentName: string;
  facilityName: string;
  department: string;
  calibrationDate: string;
  validUntil: string;
  leadEngineer: string;
  analyzerUsed: string;
  standard: string;
  result: 'PASSED' | 'CONDITIONAL';
  electricalSafetyStandard: string;
  tmdaRegistryId: string;
}

export interface SparePartItem {
  partNumber: string;
  name: string;
  category: 'Ultrasound' | 'Ventilator / Anesthesia' | 'Sterilization' | 'Radiology' | 'Medical Gas';
  compatibleEquipment: string;
  inStockDar: number;
  inStockArusha: number;
  unit: string;
  criticality: 'Critical (Patient Life Support)' | 'Standard Consumable' | 'Scheduled Replacement';
}

// 1. REAL-TIME TELEMETRY & IOT SENSOR DATA
export interface OxygenManifoldTelemetry {
  linePressureBar: number;
  linePressureTarget: number;
  purityPercentage: number;
  bankAPressureBar: number;
  bankBPressureBar: number;
  activeBank: 'Bank A (Primary)' | 'Bank B (Standby)';
  medicalAirPressureBar: number;
  vacuumSuctionBar: number;
  flowRateLpm: number;
  status: 'Nominal / Optimal' | 'Warning' | 'Critical Alert';
  lastTelemetryPing: string;
}

export interface MriCryogenicTelemetry {
  heliumLevelPercentage: number;
  cryostatTempKelvin: number;
  coldheadVacuumMbar: string;
  compressorPressurePsi: number;
  rfShieldAttenuationDb: number;
  compressorRuntimeHours: number;
  status: 'Superconducting Nominal' | 'Helium Level Watch' | 'Compressor Service';
  lastTelemetryPing: string;
}

// 2. CONTRACT & NeST TENDER DOCUMENT REPOSITORY
export interface TenderDocument {
  id: string;
  title: string;
  category: 'Hospital SLA Agreement' | 'NeST e-Procurement' | 'TMDA Regulatory' | 'Tax & Corporate Compliance';
  documentNumber: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  fileSize: string;
  securityClassification: 'Official Verified' | 'Public Tender Ready';
  description: string;
  pdfUrl: string;
}

// 3. AUTOMATED SMS DISPATCH NOTIFICATIONS
export interface SmsNotification {
  id: string;
  ticketId: string;
  recipientName: string;
  recipientPhone: string;
  recipientRole: string;
  carrier: 'Vodacom Tanzania' | 'Airtel Tanzania' | 'Tigo / Yas';
  messageBody: string;
  timestamp: string;
  deliveryStatus: 'Delivered (Handset ACK)' | 'Queued' | 'Sent';
}

export const DEMO_FACILITIES: HospitalFacility[] = [
  {
    id: 'fac-mnh',
    name: 'Muhimbili National Hospital (MNH)',
    location: 'Kalenga Street, Upanga',
    region: 'Dar es Salaam',
    type: 'National Referral Hospital',
    slaTier: 'Comprehensive Tier 1 (24/7 Rapid Coverage)',
    contractNumber: 'CMT-TZ-2026-MNH-01',
    contactPerson: 'Dr. John R. Mlay (Head of Radiology & Biomedical)',
    phone: '+255 22 215 1367',
    activeEquipmentCount: 64,
    openTicketsCount: 1,
  },
  {
    id: 'fac-kcmc',
    name: 'Kilimanjaro Christian Medical Centre (KCMC)',
    location: 'Moshi Urban',
    region: 'Kilimanjaro',
    type: 'Zonal Referral Hospital',
    slaTier: 'Comprehensive Tier 1 (4-Hour Response)',
    contractNumber: 'CMT-TZ-2026-KCMC-04',
    contactPerson: 'Eng. Baraka J. Mwangi (Biomedical Lead)',
    phone: '+255 27 275 4377',
    activeEquipmentCount: 42,
    openTicketsCount: 1,
  },
  {
    id: 'fac-almc',
    name: 'Arusha Lutheran Medical Centre (ALMC)',
    location: 'Makao Mapya Area',
    region: 'Arusha',
    type: 'Regional Referral & Trauma Centre',
    slaTier: 'Comprehensive Tier 1 (Immediate Arusha Dispatch)',
    contractNumber: 'CMT-TZ-2026-ALMC-09',
    contactPerson: 'Sister Grace Mollel (OT Supervisor)',
    phone: '+255 27 254 8030',
    activeEquipmentCount: 28,
    openTicketsCount: 1,
  },
  {
    id: 'fac-bmc',
    name: 'Bugando Medical Centre (BMC)',
    location: 'Bugando Hill',
    region: 'Mwanza',
    type: 'Lake Zone Referral Hospital',
    slaTier: 'Preventive Calibration SLA',
    contractNumber: 'CMT-TZ-2026-BMC-12',
    contactPerson: 'Eng. Michael K. Sitta',
    phone: '+255 28 250 0513',
    activeEquipmentCount: 36,
    openTicketsCount: 0,
  }
];

export const REGISTERED_HOSPITAL_EQUIPMENT: RegisteredEquipment[] = [
  {
    id: 'EQ-MNH-001',
    serialNumber: 'SN-RES-948102',
    facilityId: 'fac-mnh',
    name: 'Mindray Resona I9 Elite Ultrasound',
    department: 'Radiology & Imaging',
    manufacturer: 'Mindray Biomedical',
    model: 'Resona I9 Pro',
    installationDate: '2024-03-12',
    lastCalibrationDate: '2026-08-15',
    nextCalibrationDue: '2027-02-15',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.8,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    qrCodeTag: 'CMT-QR-948102-MNH',
    powerRequirements: '230V AC · 50Hz · Dedicated Online UPS 3kVA',
    lastServiceNotes: 'Transducer crystal scan test nominal; power supply ripple <15mV; calibrated to IEC 60601-2-37.',
  },
  {
    id: 'EQ-MNH-002',
    serialNumber: 'SN-MRI-119382',
    facilityId: 'fac-mnh',
    name: 'Siemens Magnetom Altea 1.5T MRI',
    department: 'Advanced Diagnostic Centre',
    manufacturer: 'Siemens Healthineers',
    model: 'Magnetom Altea BioMatrix',
    installationDate: '2023-11-05',
    lastCalibrationDate: '2026-06-20',
    nextCalibrationDue: '2026-12-20',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.1,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    qrCodeTag: 'CMT-QR-119382-MNH',
    powerRequirements: '400V 3-Phase · 120kVA Isolation Transformer',
    lastServiceNotes: 'Helium boil-off zero; coldhead absorber refreshed; gradient shimming verified with ACR phantom.',
  },
  {
    id: 'EQ-MNH-003',
    serialNumber: 'SN-VNT-883910',
    facilityId: 'fac-mnh',
    name: 'Mindray SV300 ICU Ventilator',
    department: 'Main Intensive Care Unit (ICU)',
    manufacturer: 'Mindray',
    model: 'SV-300 Smart Vent',
    installationDate: '2024-01-20',
    lastCalibrationDate: '2026-09-02',
    nextCalibrationDue: '2026-11-02',
    calibrationStatus: 'Due Soon',
    uptimePercentage: 98.4,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Requires Attention',
    qrCodeTag: 'CMT-QR-883910-MNH',
    powerRequirements: 'Internal Li-ion battery + 230V Mains',
    lastServiceNotes: 'O2 cell lifetime estimated at 88 days; flow sensor recalibration scheduled; tidal volume verified.',
  },
  {
    id: 'EQ-KCMC-001',
    serialNumber: 'SN-AUT-360182',
    facilityId: 'fac-kcmc',
    name: 'BioSafe 360L Pulse Vacuum Steam Autoclave',
    department: 'Central Sterilization (CSSD)',
    manufacturer: 'Tuttnauer / CoreMed Bio',
    model: 'BS-360V Pulse',
    installationDate: '2023-08-14',
    lastCalibrationDate: '2026-04-10',
    nextCalibrationDue: '2026-10-10',
    calibrationStatus: 'Due Soon',
    uptimePercentage: 96.9,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Under Maintenance',
    qrCodeTag: 'CMT-QR-360182-KCMC',
    powerRequirements: '400V 3-Phase 36kW Steam Generator',
    lastServiceNotes: 'Door silicone gasket showing micro-pitting; error code E-04; replacement part SP-TUT-GSK-360 allocated.',
  },
  {
    id: 'EQ-KCMC-002',
    serialNumber: 'SN-PSA-500021',
    facilityId: 'fac-kcmc',
    name: 'Oxair Containerized PSA Oxygen Plant (50 Nm³/h)',
    department: 'Hospital Central Plant & MGPS',
    manufacturer: 'Oxair Gas Systems',
    model: 'PSA-50 High Purity',
    installationDate: '2022-09-18',
    lastCalibrationDate: '2026-07-28',
    nextCalibrationDue: '2027-01-28',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.9,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    qrCodeTag: 'CMT-QR-500021-KCMC',
    powerRequirements: 'Duplex 45kW Atlas Copco Air Compressors',
    lastServiceNotes: 'Desiccant drying tower molecular sieve efficiency 95.2%; automated manifold switchover verified.',
  },
  {
    id: 'EQ-ALMC-001',
    serialNumber: 'SN-ANS-650091',
    facilityId: 'fac-almc',
    name: 'Mindray Wato EX-65 Anesthesia Workstation',
    department: 'Main Operating Theatre 2',
    manufacturer: 'Mindray Biomedical',
    model: 'Wato EX-65 Pro',
    installationDate: '2024-05-10',
    lastCalibrationDate: '2026-03-15',
    nextCalibrationDue: '2026-09-15',
    calibrationStatus: 'Overdue',
    uptimePercentage: 97.2,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Under Maintenance',
    qrCodeTag: 'CMT-QR-650091-ALMC',
    powerRequirements: 'Pneumatic Gas Drive + 230V Electrical',
    lastServiceNotes: 'Vaporizer concentration calibration overdue; Fluke VT650 flow analyzer dispatch scheduled.',
  },
];

// LIVE IOT TELEMETRY SAMPLES
export const DEMO_OXYGEN_TELEMETRY: OxygenManifoldTelemetry = {
  linePressureBar: 4.18,
  linePressureTarget: 4.20,
  purityPercentage: 94.8,
  bankAPressureBar: 138.4,
  bankBPressureBar: 145.0,
  activeBank: 'Bank A (Primary)',
  medicalAirPressureBar: 7.22,
  vacuumSuctionBar: -0.68,
  flowRateLpm: 340.5,
  status: 'Nominal / Optimal',
  lastTelemetryPing: 'Live · 2s ago (IoT GSM Telemetry)',
};

export const DEMO_MRI_TELEMETRY: MriCryogenicTelemetry = {
  heliumLevelPercentage: 98.4,
  cryostatTempKelvin: 4.18,
  coldheadVacuumMbar: '1.2 × 10⁻⁷',
  compressorPressurePsi: 285.0,
  rfShieldAttenuationDb: 104.2,
  compressorRuntimeHours: 4120,
  status: 'Superconducting Nominal',
  lastTelemetryPing: 'Live · 5s ago (SCADA Gateway)',
};

// NeST TENDER & CONTRACT REPOSITORY
export const TENDER_DOCUMENTS: TenderDocument[] = [
  {
    id: 'doc-sla-2026',
    title: '2026/2027 Annual Comprehensive Biomedical Maintenance SLA Agreement',
    category: 'Hospital SLA Agreement',
    documentNumber: 'CMT-AGR-2026-MNH-001',
    issuedBy: 'CoreMed Tech & Muhimbili National Hospital Administration',
    issueDate: '2026-01-10',
    expiryDate: '2027-01-09',
    fileSize: '3.4 MB (Digital PDF / Signed)',
    securityClassification: 'Official Verified',
    description: 'Legally binding Tier 1 Comprehensive SLA including 24/7 emergency dispatch, 4-hour SLA response guarantee in Dar es Salaam, 100% spare parts and IEC 62353 calibration coverage.',
    pdfUrl: '#download-sla-2026',
  },
  {
    id: 'doc-nest-cert',
    title: 'National e-Procurement System of Tanzania (NeST) Registered Vendor Certificate',
    category: 'NeST e-Procurement',
    documentNumber: 'NeST-REG-TZ-2026-482910',
    issuedBy: 'Public Procurement Regulatory Authority (PPRA Tanzania)',
    issueDate: '2026-02-01',
    expiryDate: '2027-01-31',
    fileSize: '1.8 MB (Verified e-Stamp)',
    securityClassification: 'Public Tender Ready',
    description: 'Official PPRA validation granting CoreMed Tech verified national supplier status for public hospital tenders, diagnostic equipment procurement, and hospital gas infrastructure contracts.',
    pdfUrl: '#download-nest-cert',
  },
  {
    id: 'doc-tmda-permit',
    title: 'TMDA Medical Device Dealer & Technical Maintenance Authorization',
    category: 'TMDA Regulatory',
    documentNumber: 'TMDA/MDA/TECH/2026/0118',
    issuedBy: 'Tanzania Medicines and Medical Devices Authority (TMDA)',
    issueDate: '2026-01-15',
    expiryDate: '2027-01-14',
    fileSize: '2.1 MB (QR Authenticated)',
    securityClassification: 'Official Verified',
    description: 'Accreditation permit authorizing installation, wholesale importation, field servicing, and ISO 17025 electrical safety calibration of Class II and Class III electromedical devices in Tanzania.',
    pdfUrl: '#download-tmda-permit',
  },
  {
    id: 'doc-tra-clearance',
    title: 'Tanzania Revenue Authority (TRA) Valid Tax Clearance Certificate',
    category: 'Tax & Corporate Compliance',
    documentNumber: 'TRA-TCC-2026-0941827',
    issuedBy: 'Tanzania Revenue Authority (TRA Large Taxpayers Dept)',
    issueDate: '2026-01-05',
    expiryDate: '2026-12-31',
    fileSize: '1.2 MB (Watermarked)',
    securityClassification: 'Public Tender Ready',
    description: 'Unrestricted tax compliance certificate for participation in regional hospital and Ministry of Health (MoH) institutional procurement frameworks.',
    pdfUrl: '#download-tra-clearance',
  },
  {
    id: 'doc-brela-incorp',
    title: 'BRELA Certificate of Commercial Incorporation (Cert #482910)',
    category: 'Tax & Corporate Compliance',
    documentNumber: 'BRELA-INC-482910-TZ',
    issuedBy: 'Business Registrations and Licensing Agency (BRELA)',
    issueDate: '2019-06-22',
    expiryDate: 'Perpetual Commercial Entity',
    fileSize: '1.5 MB (Certified Copy)',
    securityClassification: 'Official Verified',
    description: 'Certificate of Incorporation establishing CoreMed Tech Biomedical Solutions as an accredited Tanzanian corporate entity with headquarters in Arusha and Spares Depot in Dar es Salaam.',
    pdfUrl: '#download-brela-cert',
  }
];

// AUTOMATED SMS DISPATCH LOGS
export const INITIAL_SMS_LOGS: SmsNotification[] = [
  {
    id: 'SMS-2026-9048',
    ticketId: 'CMT-2026-9048',
    recipientName: 'Eng. Francisca Mrema (Lead BioMed)',
    recipientPhone: '+255 742 296 631',
    recipientRole: 'Northern Zone Rapid Dispatch Lead',
    carrier: 'Vodacom Tanzania',
    messageBody: '🚨 [CoreMed Emergency Dispatch]: Breakdown incident logged at KCMC Hospital (CSSD Autoclave #BS-360V, Error E-04). Priority: Emergency. You have been assigned. ETA: 45 min. Hotline: +255 742 296 631.',
    timestamp: 'Today · 07:16 AM',
    deliveryStatus: 'Delivered (Handset ACK)',
  },
  {
    id: 'SMS-2026-9052',
    ticketId: 'CMT-2026-9052',
    recipientName: 'Sister Grace Mollel (OT Supervisor)',
    recipientPhone: '+255 754 819 023',
    recipientRole: 'ALMC Main Operating Theatre',
    carrier: 'Airtel Tanzania',
    messageBody: '✅ [CoreMed Ticket Assigned]: Eng. Kelvin Lyimo is en route to ALMC Operating Theatre 2 for Wato EX-65 Anesthesia Machine sensor recalibration. Work order #CMT-2026-9052.',
    timestamp: 'Yesterday · 02:40 PM',
    deliveryStatus: 'Delivered (Handset ACK)',
  },
  {
    id: 'SMS-2026-9012',
    ticketId: 'CMT-2026-9012',
    recipientName: 'Dr. John R. Mlay (Radiology Director)',
    recipientPhone: '+255 713 409 112',
    recipientRole: 'Muhimbili National Hospital',
    carrier: 'Tigo / Yas',
    messageBody: '📋 [CoreMed ISO Calibration]: Annual IEC 62353 safety verification completed for Siemens MRI and Mindray Resona Ultrasound. Certificate #CMT-CAL-2026-MNH-089 active. Uptime: 99.8%.',
    timestamp: '2026-09-30 · 11:05 AM',
    deliveryStatus: 'Delivered (Handset ACK)',
  }
];

export const CALIBRATION_CERTIFICATES: CalibrationRecord[] = [
  {
    id: 'CERT-2026-0815',
    certificateNumber: 'CMT-CAL-2026-MNH-089',
    equipmentId: 'EQ-MNH-001',
    equipmentName: 'Mindray Resona I9 Elite Ultrasound',
    facilityName: 'Muhimbili National Hospital (MNH)',
    department: 'Radiology & Imaging',
    calibrationDate: '2026-08-15',
    validUntil: '2027-02-15',
    leadEngineer: 'Eng. Kelvin Lyimo, B.Sc. Biomedical (Reg. ERB #9482)',
    analyzerUsed: 'Fluke Biomedical ProSim 8 / ESA620 Electrical Safety Analyzer',
    standard: 'ISO/IEC 17025:2017 & IEC 60601-2-37',
    result: 'PASSED',
    electricalSafetyStandard: 'IEC 62353 Class I Type BF (Chassis Leakage: 42 µA, Limit: 100 µA)',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0491',
  },
  {
    id: 'CERT-2026-0728',
    certificateNumber: 'CMT-CAL-2026-KCMC-042',
    equipmentId: 'EQ-KCMC-002',
    equipmentName: 'Containerized PSA Oxygen Plant (50 Nm³/h)',
    facilityName: 'Kilimanjaro Christian Medical Centre (KCMC)',
    department: 'Hospital Central Plant & MGPS',
    calibrationDate: '2026-07-28',
    validUntil: '2027-01-28',
    leadEngineer: 'Eng. Francisca Mrema, M.Sc. Clinical Engineering',
    analyzerUsed: 'Servomex Paramagnetic Oxygen Purity Analyzer (Purity Verified: 94.8%)',
    standard: 'HTM 02-01 & ISO 7396-1 Pipeline Compliance',
    result: 'PASSED',
    electricalSafetyStandard: 'Tanzania TBS & Fire Safety Certified',
    tmdaRegistryId: 'TMDA/GAS/PSA/2026/1104',
  },
  {
    id: 'CERT-2026-0620',
    certificateNumber: 'CMT-CAL-2026-MNH-034',
    equipmentId: 'EQ-MNH-002',
    equipmentName: 'Siemens Magnetom Altea 1.5T MRI',
    facilityName: 'Muhimbili National Hospital (MNH)',
    department: 'Advanced Diagnostic Centre',
    calibrationDate: '2026-06-20',
    validUntil: '2026-12-20',
    leadEngineer: 'Eng. Casto Mwita, Lead MRI Systems Specialist',
    analyzerUsed: 'Siemens Quality Phantom Suite & Magnetic Field Homogeneity Gauge',
    standard: 'IEC 60601-2-33 Specific Requirements for MRI Safety',
    result: 'PASSED',
    electricalSafetyStandard: 'IEC 62353 Hospital In-Service Standard',
    tmdaRegistryId: 'TMDA/RAD/MRI/2026/0019',
  }
];

export const REGIONAL_SPARE_PARTS: SparePartItem[] = [
  {
    partNumber: 'SP-MIN-TR-SC51',
    name: 'Mindray Single Crystal Convex Ultrasound Transducer (SC5-1U)',
    category: 'Ultrasound',
    compatibleEquipment: 'Resona I9 / Resona 7 / DC-80',
    inStockDar: 4,
    inStockArusha: 2,
    unit: 'Units',
    criticality: 'Critical (Patient Life Support)',
  },
  {
    partNumber: 'SP-DRG-O2-CEL',
    name: 'Paramagnetic Medical Oxygen Sensor Cell (Fast Response)',
    category: 'Ventilator / Anesthesia',
    compatibleEquipment: 'Dräger Fabius / Mindray Wato / SV300',
    inStockDar: 28,
    inStockArusha: 14,
    unit: 'Pcs',
    criticality: 'Critical (Patient Life Support)',
  },
  {
    partNumber: 'SP-TUT-GSK-360',
    name: 'High-Temperature Silicone Chamber Door Gasket (360L/500L)',
    category: 'Sterilization',
    compatibleEquipment: 'BioSafe 360L / Tuttnauer CSSD Sterilizers',
    inStockDar: 12,
    inStockArusha: 6,
    unit: 'Gaskets',
    criticality: 'Scheduled Replacement',
  },
  {
    partNumber: 'SP-BEA-N2O-O2',
    name: 'BeaconMedaes Quick-Connect Medical Gas Terminal Outlets (BS 5682)',
    category: 'Medical Gas',
    compatibleEquipment: 'Ward Bedhead Units & OT Ceiling Pendants',
    inStockDar: 85,
    inStockArusha: 40,
    unit: 'Units',
    criticality: 'Standard Consumable',
  },
  {
    partNumber: 'SP-FLU-HV-BD',
    name: 'Digital Radiography High-Voltage Generator Board Assembly',
    category: 'Radiology',
    compatibleEquipment: 'Digital C-Arm / Floor-Mounted Digital X-Ray',
    inStockDar: 2,
    inStockArusha: 1,
    unit: 'Boards',
    criticality: 'Critical (Patient Life Support)',
  }
];
