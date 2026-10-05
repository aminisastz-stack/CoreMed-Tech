import { FEATURED_EQUIPMENT } from './mockData';
import { RegisteredEquipment, REGISTERED_HOSPITAL_EQUIPMENT, CALIBRATION_CERTIFICATES } from './portalData';

export interface MaintenanceEvent {
  id: string;
  date: string;
  type:
    | 'Commissioning & Handover'
    | 'Preventive Maintenance'
    | 'Calibration & Safety Audit'
    | 'Emergency Repair'
    | 'Sensor & Flow Calibration'
    | 'Electrical Safety Test (IEC 62353)';
  engineer: string;
  facility: string;
  description: string;
  status: 'Passed' | 'Completed' | 'Certified';
  findings: string;
  standardsComplied: string[];
}

export interface EquipmentRecordWithHistory {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  qrCodeTag: string;
  hospitalAssigned: string;
  facilityId: string;
  department: string;
  installationDate: string;
  lastCalibrationDate: string;
  nextCalibrationDue: string;
  calibrationStatus: 'Valid' | 'Due Soon' | 'Overdue';
  uptimePercentage: number;
  slaCoverage: string;
  operationalStatus: 'Operational' | 'Requires Attention' | 'Under Maintenance';
  powerRequirements: string;
  tmdaRegistryId: string;
  calibrationCertificate: {
    certificateNumber: string;
    leadEngineer: string;
    analyzerUsed: string;
    standard: string;
    result: 'PASSED' | 'CONDITIONAL';
    electricalSafetyStandard: string;
    validUntil: string;
  };
  maintenanceEvents: MaintenanceEvent[];
  image: string;
}

export const EQUIPMENT_RECORDS_CATALOG: EquipmentRecordWithHistory[] = [
  {
    id: 'rec-eq-1',
    catalogId: 'eq-1',
    name: 'Mindray Resona I9 Elite Diagnostic Ultrasound',
    category: 'Diagnostic Ultrasound & Radiology',
    manufacturer: 'Mindray Biomedical',
    model: 'Resona I9 Pro',
    serialNumber: 'SN-RES-948102',
    qrCodeTag: 'CMT-QR-948102-MNH',
    hospitalAssigned: 'Muhimbili National Hospital (MNH)',
    facilityId: 'fac-mnh',
    department: 'Radiology & Clinical Imaging',
    installationDate: '2024-03-12',
    lastCalibrationDate: '2026-08-15',
    nextCalibrationDue: '2027-02-15',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.8,
    slaCoverage: 'Comprehensive Tier 1 (24/7 Rapid Coverage)',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz · Dual Li-ion Hot-swap Batteries',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0491',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-MNH-089',
      leadEngineer: 'Eng. Kelvin Lyimo, B.Sc. Biomedical (ERB #9482)',
      analyzerUsed: 'Fluke Biomedical ProSim 8 / ESA620 Safety Analyzer',
      standard: 'ISO/IEC 17025:2017 & IEC 60601-2-37',
      result: 'PASSED',
      electricalSafetyStandard: 'IEC 62353 Class I Type BF (Chassis Leakage: 42 µA, Limit: 100 µA)',
      validUntil: '2027-02-15'
    },
    maintenanceEvents: [
      {
        id: 'ME-001',
        date: '2026-08-15',
        type: 'Calibration & Safety Audit',
        engineer: 'Eng. Kelvin Lyimo (Lead Biomedical Engineer)',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Bi-annual ISO 17025 calibration and transducer acoustic power emission verification.',
        status: 'Certified',
        findings: 'Single-crystal probe acoustic matrix within ±1.5% manufacturer tolerance. Zero dead crystals.',
        standardsComplied: ['ISO 17025', 'IEC 60601-2-37', 'TMDA Notice 2026']
      },
      {
        id: 'ME-002',
        date: '2026-05-18',
        type: 'Preventive Maintenance',
        engineer: 'Eng. Josephat Mwita',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Quarterly scheduled hardware service, cooling dust filtration replacement, and software firmware update to v4.8.',
        status: 'Completed',
        findings: 'Internal thermal dissipation nominal; cooling fans cleaned; power conditioning filter ripple <12mV.',
        standardsComplied: ['IEC 62353', 'Manufacturer Tier 1 SLA']
      },
      {
        id: 'ME-003',
        date: '2024-03-12',
        type: 'Commissioning & Handover',
        engineer: 'Eng. Francisca Mrema & Dr. John R. Mlay',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Initial turnkey hospital commissioning, medical isolation transformer installation, and radiologist team clinical training.',
        status: 'Passed',
        findings: 'All 4 transducers (Convex, Linear, Phased Array, Endocavity) certified for high-volume obstetrics & vascular imaging.',
        standardsComplied: ['BRELA / TMDA Import Clearance', 'TBS Power Grid Specs']
      }
    ],
    image: '/src/assets/images/mindray_resona_ultrasound_1791133914392.jpg'
  },
  {
    id: 'rec-eq-2',
    catalogId: 'eq-2',
    name: 'Wato EX-65 Pro Anesthesia Delivery Workstation',
    category: 'Operating Theatre & Sterilization',
    manufacturer: 'Mindray Medical',
    model: 'EX-65 Pro',
    serialNumber: 'SN-ANS-650091',
    qrCodeTag: 'CMT-QR-650091-ALMC',
    hospitalAssigned: 'Arusha Lutheran Medical Centre (ALMC)',
    facilityId: 'fac-almc',
    department: 'Main Operating Theatre 2',
    installationDate: '2024-05-10',
    lastCalibrationDate: '2026-03-15',
    nextCalibrationDue: '2026-11-15',
    calibrationStatus: 'Valid',
    uptimePercentage: 98.6,
    slaCoverage: 'Comprehensive Tier 1 (4-Hour Response)',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz + 120min Internal Backup Battery',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0812',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-ALMC-034',
      leadEngineer: 'Eng. Francisca Mrema, M.Sc. Clinical Engineering',
      analyzerUsed: 'Fluke VT900A Gas Flow Analyzer & Vapor Anesthetic Agent Monitor',
      standard: 'ISO 80601-2-13 Anesthetic Systems Standard',
      result: 'PASSED',
      electricalSafetyStandard: 'IEC 62353 Class I Type B (Patient Leakage: 18 µA)',
      validUntil: '2026-11-15'
    },
    maintenanceEvents: [
      {
        id: 'ME-004',
        date: '2026-03-15',
        type: 'Sensor & Flow Calibration',
        engineer: 'Eng. Francisca Mrema',
        facility: 'Arusha Lutheran Medical Centre (ALMC)',
        description: 'Tidal volume accuracy calibration across 5ml to 1500ml range and Sevoflurane vaporizer concentration audit.',
        status: 'Certified',
        findings: 'Electronic gas mixer pressure regulated at 2.8 bar. AGSS scavenge flow rate confirmed at 45 L/min.',
        standardsComplied: ['ISO 80601-2-13', 'TMDA Operating Theatre Guideline']
      },
      {
        id: 'ME-005',
        date: '2025-11-04',
        type: 'Preventive Maintenance',
        engineer: 'Eng. Kelvin Lyimo',
        facility: 'Arusha Lutheran Medical Centre (ALMC)',
        description: 'Breathing circuit autoclave validation, O2 sensor cell replacement, and bellows integrity test.',
        status: 'Completed',
        findings: 'Zero pressure drop observed during 5-minute circuit static hold test at 30 cmH2O.',
        standardsComplied: ['IEC 62353', 'ISO 5356']
      },
      {
        id: 'ME-006',
        date: '2024-05-10',
        type: 'Commissioning & Handover',
        engineer: 'Eng. Francisca Mrema & Sister Grace Mollel',
        facility: 'Arusha Lutheran Medical Centre (ALMC)',
        description: 'Installation and medical gas terminal pipeline integration in Operating Theatre 2.',
        status: 'Passed',
        findings: 'High-pressure pipeline quick-connect NIST pins verified for O2, N2O, and Medical Air.',
        standardsComplied: ['HTM 02-01', 'ISO 7396-1']
      }
    ],
    image: '/src/assets/images/operating_theatre_equipment_1791120372232.jpg'
  },
  {
    id: 'rec-eq-3',
    catalogId: 'eq-3',
    name: 'BioSafe 360L Hospital CSSD Steam Sterilizer',
    category: 'Operating Theatre & Sterilization',
    manufacturer: 'Tuttnauer / CoreMed Bio',
    model: 'CSSD-P360 Pulse',
    serialNumber: 'SN-AUT-360182',
    qrCodeTag: 'CMT-QR-360182-KCMC',
    hospitalAssigned: 'Kilimanjaro Christian Medical Centre (KCMC)',
    facilityId: 'fac-kcmc',
    department: 'Central Sterilization Services (CSSD)',
    installationDate: '2023-08-14',
    lastCalibrationDate: '2026-04-10',
    nextCalibrationDue: '2026-10-10',
    calibrationStatus: 'Due Soon',
    uptimePercentage: 96.9,
    slaCoverage: 'Comprehensive Tier 1 (Northern Zone Dispatch)',
    operationalStatus: 'Under Maintenance',
    powerRequirements: '400V 3-Phase · 36kW Dedicated Steam Generator',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0204',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-KCMC-071',
      leadEngineer: 'Eng. Baraka J. Mwangi (Biomedical Lead)',
      analyzerUsed: 'Lives International Wireless Temperature & Pressure Data Loggers',
      standard: 'EN 285 Steam Sterilizers & ISO 17665 Validation',
      result: 'PASSED',
      electricalSafetyStandard: 'IEC 61010-2-040 Safety for Sterilizers',
      validUntil: '2026-10-10'
    },
    maintenanceEvents: [
      {
        id: 'ME-007',
        date: '2026-10-04',
        type: 'Emergency Repair',
        engineer: 'Eng. Francisca Mrema',
        facility: 'Kilimanjaro Christian Medical Centre (KCMC)',
        description: 'Incident ticket #CMT-2026-9048: Chamber door silicone gasket replacement and vacuum leak test.',
        status: 'Completed',
        findings: 'Allocated genuine OEM spare part SP-TUT-GSK-360 from Dar es Salaam central depot. Vacuum hold test successful.',
        standardsComplied: ['EN 285', 'CoreMed 4-Hour Emergency SLA']
      },
      {
        id: 'ME-008',
        date: '2026-04-10',
        type: 'Calibration & Safety Audit',
        engineer: 'Eng. Baraka J. Mwangi',
        facility: 'Kilimanjaro Christian Medical Centre (KCMC)',
        description: 'Multi-point thermodynamic profile at 134°C (3-minute plateau) and 121°C (15-minute plateau) with biological spore tests.',
        status: 'Certified',
        findings: 'Geobacillus stearothermophilus spore kill 100% negative at 48-hour incubation. Temperature uniformity within ±0.4°C.',
        standardsComplied: ['ISO 11138', 'EN 285']
      }
    ],
    image: '/src/assets/images/hero_operating_suite_1791133860838.jpg'
  },
  {
    id: 'rec-eq-4',
    catalogId: 'eq-4',
    name: 'Sysmex XN-350 Automated 5-Part Hematology Analyzer',
    category: 'Clinical Laboratory',
    manufacturer: 'Sysmex Corporation',
    model: 'XN-350 Compact',
    serialNumber: 'SN-LAB-350992',
    qrCodeTag: 'CMT-QR-350992-MNH',
    hospitalAssigned: 'Muhimbili National Hospital (MNH)',
    facilityId: 'fac-mnh',
    department: 'Central Clinical Pathology Lab',
    installationDate: '2024-02-18',
    lastCalibrationDate: '2026-07-11',
    nextCalibrationDue: '2027-01-11',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.4,
    slaCoverage: 'Comprehensive Tier 1 + Reagent Protocol',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz · Dedicated 2kVA Online Pure Sine Wave UPS',
    tmdaRegistryId: 'TMDA/IVD/REG/2026/0199',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-MNH-104',
      leadEngineer: 'Eng. Josephat Mwita, Specialist Laboratory Clinical Engineer',
      analyzerUsed: 'Sysmex XN-Check Multi-Level Control (Level 1, 2, 3) & Photometer Standard',
      standard: 'ISO 15189 Medical Laboratories Quality & TMDA IVD Spec',
      result: 'PASSED',
      electricalSafetyStandard: 'IEC 61010-2-101 IVD Medical Equipment',
      validUntil: '2027-01-11'
    },
    maintenanceEvents: [
      {
        id: 'ME-009',
        date: '2026-07-11',
        type: 'Preventive Maintenance',
        engineer: 'Eng. Josephat Mwita',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Hydrodynamic focusing flow cell decontamination, micro-tubing flush, and laser diode alignment verification.',
        status: 'Completed',
        findings: 'WBC, RBC, and Platelet CV% all <2.0%, well within ISO 15189 reference requirements.',
        standardsComplied: ['ISO 15189', 'Sysmex OEM Standard']
      },
      {
        id: 'ME-010',
        date: '2024-02-18',
        type: 'Commissioning & Handover',
        engineer: 'Eng. Josephat Mwita & Hospital Lab Director',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Installation, LIS interface bidirectional TCP/IP connection, and technician training.',
        status: 'Passed',
        findings: 'Direct hospital LIS integration transmitting full 5-part results in <60 seconds.',
        standardsComplied: ['TMDA IVD Approved', 'WHO Pre-qualified']
      }
    ],
    image: '/src/assets/images/laboratory_hematology_analyzer_1791133935435.jpg'
  },
  {
    id: 'rec-eq-5',
    catalogId: 'eq-5',
    name: 'CoreOxy 50Nm³/hr Hospital PSA Oxygen Generation Plant',
    category: 'Medical Gas Systems',
    manufacturer: 'Oxair & CoreMed Systems',
    model: 'PSA-50HC Containerized',
    serialNumber: 'SN-PSA-500021',
    qrCodeTag: 'CMT-QR-500021-KCMC',
    hospitalAssigned: 'Kilimanjaro Christian Medical Centre (KCMC)',
    facilityId: 'fac-kcmc',
    department: 'Hospital Central Plant & MGPS',
    installationDate: '2022-09-18',
    lastCalibrationDate: '2026-07-28',
    nextCalibrationDue: '2027-01-28',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.9,
    slaCoverage: 'Comprehensive Tier 1 (MGPS Continuous Coverage)',
    operationalStatus: 'Operational',
    powerRequirements: '400V 3-Phase · 2 × 45kW Atlas Copco Air Compressors',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0014',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-KCMC-042',
      leadEngineer: 'Eng. Francisca Mrema, M.Sc. Clinical Engineering',
      analyzerUsed: 'Servomex Paramagnetic Oxygen Purity Analyzer (Purity: 94.8% ± 0.2%)',
      standard: 'HTM 02-01 & ISO 7396-1 Pipeline Compliance',
      result: 'PASSED',
      electricalSafetyStandard: 'ISO 7396-1 Pipeline Safety & TBS Mechanical Code',
      validUntil: '2027-01-28'
    },
    maintenanceEvents: [
      {
        id: 'ME-011',
        date: '2026-07-28',
        type: 'Calibration & Safety Audit',
        engineer: 'Eng. Francisca Mrema',
        facility: 'Kilimanjaro Christian Medical Centre (KCMC)',
        description: 'Quarterly continuous oxygen concentration audit, dew point measurement (-52°C), and auto-venting valve check.',
        status: 'Certified',
        findings: 'Oxygen purity 94.8% steady at full 50 Nm³/h demand. Cylinder booster ramp (150 bar) safety valves tested.',
        standardsComplied: ['HTM 02-01', 'ISO 7396-1', 'European Pharmacopoeia 93%']
      },
      {
        id: 'ME-012',
        date: '2026-03-22',
        type: 'Preventive Maintenance',
        engineer: 'Eng. Baraka J. Mwangi',
        facility: 'Kilimanjaro Christian Medical Centre (KCMC)',
        description: 'Compressor oil change, intake HEPA element replacement, and pneumatic solenoid valve seal kit installation.',
        status: 'Completed',
        findings: 'Desiccant drying tower molecular sieve efficiency confirmed at 95.2%.',
        standardsComplied: ['Atlas Copco OEM SLA', 'HTM 02-01']
      }
    ],
    image: '/src/assets/images/medical_gas_oxygen_manifold_1791133884278.jpg'
  },
  {
    id: 'rec-eq-6',
    catalogId: 'eq-6',
    name: 'Bellavista 1000 Neo Advanced ICU Ventilator',
    category: 'ICU & Life Support',
    manufacturer: 'Imtmedical / Vyaire',
    model: 'BV-1000-TZ',
    serialNumber: 'SN-VNT-883910',
    qrCodeTag: 'CMT-QR-883910-MNH',
    hospitalAssigned: 'Muhimbili National Hospital (MNH)',
    facilityId: 'fac-mnh',
    department: 'Cardio-Thoracic ICU',
    installationDate: '2024-01-20',
    lastCalibrationDate: '2026-09-02',
    nextCalibrationDue: '2026-11-02',
    calibrationStatus: 'Due Soon',
    uptimePercentage: 98.4,
    slaCoverage: 'Comprehensive Tier 1 (Emergency Dispatch)',
    operationalStatus: 'Requires Attention',
    powerRequirements: 'Internal Li-ion Battery (4 Hours) + 230V Mains',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0339',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-MNH-095',
      leadEngineer: 'Eng. Kelvin Lyimo, B.Sc. Biomedical (ERB #9482)',
      analyzerUsed: 'Fluke VT900A Precision High-Frequency Gas Flow Analyzer',
      standard: 'ISO 80601-2-12 Critical Care Ventilators Standard',
      result: 'PASSED',
      electricalSafetyStandard: 'IEC 62353 Class II Type BF (Chassis Leakage: 26 µA)',
      validUntil: '2026-11-02'
    },
    maintenanceEvents: [
      {
        id: 'ME-013',
        date: '2026-09-02',
        type: 'Sensor & Flow Calibration',
        engineer: 'Eng. Kelvin Lyimo',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Turbine flow meter recalibration, inspiratory valve pressure sensor zeroing, and FiO2 ultrasonic cell check.',
        status: 'Certified',
        findings: 'O2 galvanic fuel cell estimated remaining life: 88 days. Flow delivery accurate within ±2.5%. Next service scheduled.',
        standardsComplied: ['ISO 80601-2-12', 'IEC 60601-1-8 Alarm Standards']
      },
      {
        id: 'ME-014',
        date: '2025-08-14',
        type: 'Preventive Maintenance',
        engineer: 'Eng. Josephat Mwita',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Expiratory valve sterilization cycle check, internal Li-ion battery health cycle test (4.2 hours verified).',
        status: 'Completed',
        findings: 'Battery internal resistance 18 mΩ (excellent). Alarm loud speaker pressure >75 dBA at 1 meter.',
        standardsComplied: ['IEC 62353', 'TMDA Critical Care Guideline']
      }
    ],
    image: '/src/assets/images/engineer_calibration_hospital_1791120360131.jpg'
  },
  {
    id: 'rec-eq-7',
    catalogId: 'eq-7',
    name: 'Siemens Magnetom Altea 1.5T Superconductive MRI',
    category: 'Diagnostic Ultrasound & Radiology',
    manufacturer: 'Siemens Healthineers',
    model: 'Magnetom Altea 1.5T',
    serialNumber: 'SN-MRI-119382',
    qrCodeTag: 'CMT-QR-119382-MNH',
    hospitalAssigned: 'Muhimbili National Hospital (MNH)',
    facilityId: 'fac-mnh',
    department: 'Advanced Diagnostic Imaging Wing',
    installationDate: '2023-11-05',
    lastCalibrationDate: '2026-06-20',
    nextCalibrationDue: '2026-12-20',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.1,
    slaCoverage: 'Comprehensive Tier 1 (Cryogenic SCADA & Fast Response)',
    operationalStatus: 'Operational',
    powerRequirements: '400V 3-Phase · 120kVA Dedicated Isolation Transformer',
    tmdaRegistryId: 'TMDA/MED/DEV/2026/0011',
    calibrationCertificate: {
      certificateNumber: 'CMT-CAL-2026-MNH-052',
      leadEngineer: 'Dr. John R. Mlay & Eng. Kelvin Lyimo',
      analyzerUsed: 'Siemens BioMatrix Field Probe, ACR Quality Assurance MRI Phantom',
      standard: 'IEC 60601-2-33 Superconductive MRI Safety Standard',
      result: 'PASSED',
      electricalSafetyStandard: 'IEC 62353 Class I Type B (RF Cage Shielding: 104.2 dB)',
      validUntil: '2026-12-20'
    },
    maintenanceEvents: [
      {
        id: 'ME-015',
        date: '2026-06-20',
        type: 'Calibration & Safety Audit',
        engineer: 'Eng. Kelvin Lyimo & Siemens Field Specialist',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'ACR QA phantom geometric distortion, SNR measurement, slice thickness verification, and helium coldhead check.',
        status: 'Certified',
        findings: 'Zero helium boil-off maintained. Cryostat temperature 4.18 Kelvin. RF cage attenuation >100dB across 64MHz band.',
        standardsComplied: ['IEC 60601-2-33', 'ACR MRI Accreditation Standard']
      },
      {
        id: 'ME-016',
        date: '2025-12-10',
        type: 'Preventive Maintenance',
        engineer: 'Eng. Francisca Mrema',
        facility: 'Muhimbili National Hospital (MNH)',
        description: 'Helium compressor oil absorber cylinder changeover, chilled water heat exchanger flush, and gradient amplifier cooling check.',
        status: 'Completed',
        findings: 'Compressor static pressure 285 PSI. Closed-loop chiller inlet temperature 8.2°C.',
        standardsComplied: ['Siemens Global SLA', 'IEC 62353']
      }
    ],
    image: '/src/assets/images/siemens_mri_scanner_1791133923794.jpg'
  }
];

/**
 * Helper to look up an equipment record by any identifier:
 * QR Tag ID, Serial Number, Equipment ID, Catalog ID, or Machine Name substring.
 */
export function findEquipmentRecord(identifier: string): EquipmentRecordWithHistory | null {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();

  // Try exact match on QR tag, serial, id, or catalogId
  const match = EQUIPMENT_RECORDS_CATALOG.find(
    (r) =>
      r.qrCodeTag.toLowerCase() === clean ||
      r.serialNumber.toLowerCase() === clean ||
      r.id.toLowerCase() === clean ||
      r.catalogId.toLowerCase() === clean ||
      clean.includes(r.qrCodeTag.toLowerCase()) ||
      clean.includes(r.serialNumber.toLowerCase())
  );
  if (match) return match;

  // Try substring search on name or model
  const subMatch = EQUIPMENT_RECORDS_CATALOG.find(
    (r) =>
      r.name.toLowerCase().includes(clean) ||
      r.model.toLowerCase().includes(clean) ||
      clean.includes(r.model.toLowerCase())
  );
  if (subMatch) return subMatch;

  // Check numeric digits (e.g. "948102" or "119382")
  const digits = clean.replace(/\D/g, '');
  if (digits.length >= 4) {
    const digitMatch = EQUIPMENT_RECORDS_CATALOG.find(
      (r) =>
        r.serialNumber.replace(/\D/g, '').includes(digits) ||
        r.qrCodeTag.replace(/\D/g, '').includes(digits)
    );
    if (digitMatch) return digitMatch;
  }

  return null;
}
