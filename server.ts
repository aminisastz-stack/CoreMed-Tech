import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// PostgreSQL Connection String provided by user
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://postgres:uNmmwjzaeJ5Np9P@169.58.108.190:5434/postgres?sslmode=require';

// Configure PostgreSQL Pool with SSL
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 15
});

// INITIAL SEED DATA
const SEED_FACILITIES = [
  {
    id: 'fac-mnh',
    name: 'Muhimbili National Hospital (MNH)',
    location: 'Upanga West, Dar es Salaam',
    region: 'Dar es Salaam',
    type: 'National Referral & Teaching Hospital',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'TZ-MOH-SLA-2024-001',
    contactPerson: 'Dr. Frank Mrema / Eng. Mwamba',
    phone: '+255 742 296 631',
    activeEquipmentCount: 84,
    openTicketsCount: 2
  },
  {
    id: 'fac-agakhan',
    name: 'The Aga Khan Hospital Dar es Salaam',
    location: 'Ocean Road, Sea View, Dar es Salaam',
    region: 'Dar es Salaam',
    type: 'Private Tertiary Hospital (JCI Accredited)',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'AKH-CMT-2023-089',
    contactPerson: 'Priya Sharma / Biomedical Team',
    phone: '+255 742 296 631',
    activeEquipmentCount: 42,
    openTicketsCount: 1
  },
  {
    id: 'fac-bugando',
    name: 'Bugando Medical Centre (BMC)',
    location: 'Bugando Hill, Mwanza',
    region: 'Mwanza',
    type: 'Zonal Referral Hospital (Lake Zone)',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'BMC-MOH-SLA-2024-045',
    contactPerson: 'Eng. Dennis Maro, Chief BioMed',
    phone: '+255 742 296 631',
    activeEquipmentCount: 68,
    openTicketsCount: 1
  },
  {
    id: 'fac-ccbrt',
    name: 'CCBRT Hospital',
    location: 'Msasani, Dar es Salaam',
    region: 'Dar es Salaam',
    type: 'Specialized Disability & Maternal Hospital',
    slaTier: 'Preventive & Calibration SLA',
    contractNumber: 'CCBRT-ENG-2024-11',
    contactPerson: 'Matron Hilda Tesha',
    phone: '+255 742 296 631',
    activeEquipmentCount: 29,
    openTicketsCount: 0
  },
  {
    id: 'fac-regency',
    name: 'Regency Medical Centre',
    location: 'Alykhan Road, Upanga, Dar es Salaam',
    region: 'Dar es Salaam',
    type: 'Private Multi-Specialty Hospital',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'RMC-SLA-2024-78',
    contactPerson: 'Dr. Rajeev Kumar / OT Manager',
    phone: '+255 742 296 631',
    activeEquipmentCount: 35,
    openTicketsCount: 1
  },
  {
    id: 'fac-mtmeru',
    name: 'Mount Meru Regional Referral Hospital',
    location: 'Hospital Road, Arusha',
    region: 'Arusha',
    type: 'Regional Referral Hospital',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'MMH-ARU-2024-012',
    contactPerson: 'Eng. Kelvin Lyimo, Regional BioMed',
    phone: '+255 742 296 631',
    activeEquipmentCount: 52,
    openTicketsCount: 0
  },
  {
    id: 'fac-kcmc',
    name: 'Kilimanjaro Christian Medical Centre (KCMC)',
    location: 'Moshi Rural, Kilimanjaro',
    region: 'Kilimanjaro / Moshi',
    type: 'Zonal Referral & Research Hospital',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'KCMC-CMT-2023-99',
    contactPerson: 'Prof. E. Msuya / Lead BioMed',
    phone: '+255 742 296 631',
    activeEquipmentCount: 76,
    openTicketsCount: 1
  },
  {
    id: 'fac-bmh',
    name: 'Benjamin Mkapa Hospital (BMH)',
    location: 'UDOM Campus, Dodoma',
    region: 'Dodoma',
    type: 'National Zonal Referral Hospital',
    slaTier: 'Comprehensive Tier 1 24/7 Priority',
    contractNumber: 'BMH-DOD-2024-033',
    contactPerson: 'Eng. Sarah Malisa',
    phone: '+255 742 296 631',
    activeEquipmentCount: 64,
    openTicketsCount: 0
  }
];

const SEED_EQUIPMENT = [
  {
    id: 'eq-001',
    facilityId: 'fac-mnh',
    name: 'Mindray Resona I9 Elite Diagnostic Ultrasound',
    category: 'Diagnostic Ultrasound & Radiology',
    manufacturer: 'Mindray Biomedical',
    model: 'Resona I9 Elite',
    serialNumber: 'SN-RESONA-I9-2024-0982',
    qrCodeTag: 'CMT-QR-948102-MNH',
    department: 'Radiology & Fetal Imaging Suite (Room 104)',
    installationDate: '2024-03-15',
    lastCalibrationDate: '2026-08-10',
    nextCalibrationDue: '2027-02-10',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.8,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz · Dedicated Online UPS',
    lastServiceNotes: 'Acoustic output verification and transducer impedance testing completed. Zero artifacts detected.'
  },
  {
    id: 'eq-002',
    facilityId: 'fac-mnh',
    name: 'Dräger Perseus A500 Anesthesia Workstation & Ventilator',
    category: 'Operating Theatre & Sterilization',
    manufacturer: 'Dräger Medical Germany',
    model: 'Perseus A500',
    serialNumber: 'SN-DRAGER-A500-88412',
    qrCodeTag: 'CMT-QR-948103-MNH',
    department: 'Main Theatre 2 (Cardiothoracic OT)',
    installationDate: '2023-11-20',
    lastCalibrationDate: '2026-07-14',
    nextCalibrationDue: '2027-01-14',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.5,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz · Battery Backup 120min',
    lastServiceNotes: 'Gas mixing precision ±1% verified with Fluke VT650 Gas Flow Analyzer. Vaporizer interlocks certified.'
  },
  {
    id: 'eq-003',
    facilityId: 'fac-agakhan',
    name: 'GE SIGNA Pioneer 3.0T High-Field MRI Scanner',
    category: 'Diagnostic Ultrasound & Radiology',
    manufacturer: 'GE Healthcare USA',
    model: 'SIGNA Pioneer 3.0T',
    serialNumber: 'SN-GE-SIGNA-3T-0041',
    qrCodeTag: 'CMT-QR-948104-AGK',
    department: 'Radiology Department MRI Wing',
    installationDate: '2023-06-10',
    lastCalibrationDate: '2026-09-01',
    nextCalibrationDue: '2027-03-01',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.2,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '400V 3-Phase · 50Hz · 120kVA Dedicated Chiller',
    lastServiceNotes: 'Liquid helium level at 84% nominal. Gradient coil shim and SNR test PASSED across all RF head coils.'
  },
  {
    id: 'eq-004',
    facilityId: 'fac-bugando',
    name: 'Siemens Healthineers SOMATOM go.Top 128-Slice CT',
    category: 'Diagnostic Ultrasound & Radiology',
    manufacturer: 'Siemens Healthineers',
    model: 'SOMATOM go.Top',
    serialNumber: 'SN-SIEMENS-CT128-091',
    qrCodeTag: 'CMT-QR-948105-BMC',
    department: 'Emergency & Trauma Diagnostic Wing',
    installationDate: '2024-01-08',
    lastCalibrationDate: '2026-08-22',
    nextCalibrationDue: '2027-02-22',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.4,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '400V 3-Phase · 50Hz · 80kVA Stabilizer',
    lastServiceNotes: 'X-ray tube heat units and dose index (CTDIvol) verified within TMDA / TAEC radiation safety limits.'
  },
  {
    id: 'eq-005',
    facilityId: 'fac-ccbrt',
    name: 'Olympus EVIS EXERA III Video Endoscopy System',
    category: 'Diagnostic Ultrasound & Radiology',
    manufacturer: 'Olympus Japan',
    model: 'EVIS EXERA III CV-190',
    serialNumber: 'SN-OLYMPUS-CV190-7721',
    qrCodeTag: 'CMT-QR-948106-CCB',
    department: 'Gastroenterology Procedure Suite',
    installationDate: '2023-09-12',
    lastCalibrationDate: '2026-06-30',
    nextCalibrationDue: '2026-12-30',
    calibrationStatus: 'Valid',
    uptimePercentage: 98.9,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz · Medical Isolation Xfmr',
    lastServiceNotes: 'Xenon light source intensity test PASSED. Scope leak-tester audit completed with zero pressure loss.'
  },
  {
    id: 'eq-006',
    facilityId: 'fac-mnh',
    name: 'Getinge GSS67H Hospital Steam Sterilizer (Autoclave)',
    category: 'Operating Theatre & Sterilization',
    manufacturer: 'Getinge Sweden',
    model: 'GSS67H 600L',
    serialNumber: 'SN-GETINGE-GSS-5510',
    qrCodeTag: 'CMT-QR-948107-MNH',
    department: 'Central Sterile Services Department (CSSD)',
    installationDate: '2023-04-18',
    lastCalibrationDate: '2026-08-18',
    nextCalibrationDue: '2027-02-18',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.7,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '400V 3-Phase · 45kW Steam Generator',
    lastServiceNotes: 'Bowie-Dick vacuum test cycle PASSED. Temperature sensor calibrated to ±0.2°C at 134°C sterilization dwell.'
  },
  {
    id: 'eq-007',
    facilityId: 'fac-regency',
    name: 'Fisher & Paykel Healthcare Airvo 2 High Flow System',
    category: 'ICU & Life Support Systems',
    manufacturer: 'Fisher & Paykel Healthcare',
    model: 'Airvo 2 Optiflow',
    serialNumber: 'SN-FP-AIRVO-2291',
    qrCodeTag: 'CMT-QR-948108-RMC',
    department: 'Intensive Care Unit (ICU Bed 4)',
    installationDate: '2024-05-10',
    lastCalibrationDate: '2026-07-20',
    nextCalibrationDue: '2027-01-20',
    calibrationStatus: 'Valid',
    uptimePercentage: 99.9,
    slaCoverage: 'Comprehensive Tier 1',
    operationalStatus: 'Operational',
    powerRequirements: '230V AC · 50Hz · Internal Battery',
    lastServiceNotes: 'Flow accuracy verified up to 60 L/min using TSI flow calibrator. Humidification chamber heating verified.'
  }
];

const SEED_TICKETS = [
  {
    ticketId: 'CMT-SLA-94821',
    hospitalName: 'Muhimbili National Hospital (MNH)',
    department: 'Operating Theatre 3 (Emergency Surgery)',
    equipmentName: 'Mindray Resona I9 Elite Ultrasound',
    issueDescription: 'Convex probe connector lock mechanism stiff. Periodic image freeze during abdominal scan.',
    priority: 'Emergency',
    status: 'Dispatched',
    assignedEngineer: 'Eng. Kelvin Lyimo (ERB #9482)',
    dateReported: '2026-10-05',
    estimatedArrival: 'Under 2 Hours (Engineer in Transit)'
  },
  {
    ticketId: 'CMT-SLA-94819',
    hospitalName: 'The Aga Khan Hospital Dar es Salaam',
    department: 'Radiology MRI Suite',
    equipmentName: 'GE SIGNA Pioneer 3.0T MRI',
    issueDescription: 'Routine quarterly liquid helium pressure telemetry verification & RF coil calibration.',
    priority: 'Scheduled',
    status: 'Calibrated',
    assignedEngineer: 'Eng. Sarah Malisa, Senior BioMed',
    dateReported: '2026-10-04',
    estimatedArrival: 'Completed & Certified'
  },
  {
    ticketId: 'CMT-SLA-94815',
    hospitalName: 'Bugando Medical Centre (BMC)',
    department: 'Trauma ICU Ward',
    equipmentName: 'Hamilton-C6 Mechanical Ventilator',
    issueDescription: 'Oxygen cell sensor calibration drift notification. Requesting OEM O2 sensor replacement.',
    priority: 'High',
    status: 'Diagnosing',
    assignedEngineer: 'Eng. Dennis Maro, Lake Zone Lead',
    dateReported: '2026-10-03',
    estimatedArrival: 'Under 4 Hours'
  }
];

const SEED_SPARE_PARTS = [
  {
    partNumber: 'CMT-SP-US-091',
    name: 'Mindray 3C5A Convex Ultrasound Probe (1.5-6.0 MHz)',
    category: 'Ultrasound',
    compatibleEquipment: 'Mindray Resona I9 / Resona 7 / DC-80',
    inStockDar: 8,
    inStockArusha: 4,
    unit: 'Units',
    criticality: 'Critical (Patient Life Support)'
  },
  {
    partNumber: 'CMT-SP-VEN-102',
    name: 'Dräger Medical Paramagnetic Fast O2 Sensor Cell',
    category: 'Ventilator / Anesthesia',
    compatibleEquipment: 'Dräger Perseus A500 / Primus / Evita V500',
    inStockDar: 24,
    inStockArusha: 12,
    unit: 'Pieces',
    criticality: 'Critical (Patient Life Support)'
  },
  {
    partNumber: 'CMT-SP-AUT-304',
    name: 'Getinge Steam Chamber Silicone Door Gasket (600L)',
    category: 'Sterilization',
    compatibleEquipment: 'Getinge GSS67H / HS6610 Series',
    inStockDar: 15,
    inStockArusha: 6,
    unit: 'Sets',
    criticality: 'Scheduled Replacement'
  },
  {
    partNumber: 'CMT-SP-GAS-501',
    name: 'HTM 02-01 Medical Oxygen Terminal Unit Socket Valve',
    category: 'Medical Gas',
    compatibleEquipment: 'Central Hospital MGPS Outlets (NIST / BS)',
    inStockDar: 85,
    inStockArusha: 40,
    unit: 'Units',
    criticality: 'Standard Consumable'
  },
  {
    partNumber: 'CMT-SP-MRI-802',
    name: 'Cryogenic Liquid Helium Pressure Relief Safety Valve (0.5 Bar)',
    category: 'Radiology',
    compatibleEquipment: 'GE 1.5T / 3.0T SIGNA & Siemens Magnetom',
    inStockDar: 4,
    inStockArusha: 2,
    unit: 'Units',
    criticality: 'Critical (Patient Life Support)'
  }
];

const SEED_SMS_LOGS = [
  {
    id: 'SMS-2026-901',
    timestamp: '2026-10-05 11:42:15',
    recipientName: 'Dr. Frank Mrema',
    recipientRole: 'Medical Superintendent (MNH)',
    phoneNumber: '+255 742 296 631',
    messageType: 'Emergency SLA Dispatch',
    content: '[COREMED TECH] Dispatch Alert: Ticket CMT-SLA-94821 for MNH OT 3 assigned to Eng. Kelvin Lyimo. ETA: Under 2 hours.',
    status: 'Delivered (Handset ACK)'
  },
  {
    id: 'SMS-2026-902',
    timestamp: '2026-10-04 15:20:00',
    recipientName: 'Priya Sharma',
    recipientRole: 'Head of Clinical Services (Aga Khan)',
    phoneNumber: '+255 742 296 631',
    messageType: 'ISO 17025 Certification',
    content: '[COREMED TECH] Calibration Certificate #CMT-CAL-AGK-003 for 3.0T MRI generated & verified: PASSED.',
    status: 'Delivered (Handset ACK)'
  }
];

// Initialize database schema and seed all tables
async function initDatabaseAndSeed() {
  try {
    const client = await pool.connect();
    try {
      console.log('🔗 Connecting to PostgreSQL at 169.58.108.190:5434...');

      // 1. Create all CoreMed tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS hospital_facilities (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          region VARCHAR(100) NOT NULL,
          type VARCHAR(100) NOT NULL,
          sla_tier VARCHAR(100),
          contract_number VARCHAR(100),
          contact_person VARCHAR(255),
          phone VARCHAR(100),
          active_equipment_count INTEGER DEFAULT 0,
          open_tickets_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS hospital_equipment (
          id VARCHAR(100) PRIMARY KEY,
          facility_id VARCHAR(100) REFERENCES hospital_facilities(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          manufacturer VARCHAR(100) NOT NULL,
          model VARCHAR(100) NOT NULL,
          serial_number VARCHAR(100) NOT NULL,
          qr_code_tag VARCHAR(100),
          department VARCHAR(255),
          installation_date DATE,
          last_calibration_date DATE,
          next_calibration_due DATE,
          calibration_status VARCHAR(50) DEFAULT 'Valid',
          uptime_percentage NUMERIC(5,2) DEFAULT 99.4,
          sla_coverage VARCHAR(100) DEFAULT 'Comprehensive Tier 1',
          operational_status VARCHAR(50) DEFAULT 'Operational',
          power_requirements VARCHAR(255),
          last_service_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS hospital_tickets (
          ticket_id VARCHAR(100) PRIMARY KEY,
          hospital_name VARCHAR(255) NOT NULL,
          department VARCHAR(255),
          equipment_name VARCHAR(255) NOT NULL,
          issue_description TEXT,
          priority VARCHAR(50) DEFAULT 'Emergency',
          status VARCHAR(50) DEFAULT 'Dispatched',
          assigned_engineer VARCHAR(255),
          date_reported DATE DEFAULT CURRENT_DATE,
          estimated_arrival VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS regional_spare_parts (
          part_number VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          compatible_equipment TEXT,
          in_stock_dar INTEGER DEFAULT 0,
          in_stock_arusha INTEGER DEFAULT 0,
          unit VARCHAR(50) DEFAULT 'Units',
          criticality VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sms_logs (
          id VARCHAR(100) PRIMARY KEY,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          recipient_name VARCHAR(255) NOT NULL,
          recipient_role VARCHAR(100),
          phone_number VARCHAR(100) NOT NULL,
          message_type VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'Delivered (Handset ACK)'
        );
      `);

      console.log('✅ PostgreSQL tables created successfully.');

      // 2. Seed Facilities
      for (const f of SEED_FACILITIES) {
        await client.query(
          `INSERT INTO hospital_facilities 
           (id, name, location, region, type, sla_tier, contract_number, contact_person, phone, active_equipment_count, open_tickets_count)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           location = EXCLUDED.location,
           region = EXCLUDED.region,
           phone = EXCLUDED.phone,
           active_equipment_count = EXCLUDED.active_equipment_count,
           open_tickets_count = EXCLUDED.open_tickets_count`,
          [f.id, f.name, f.location, f.region, f.type, f.slaTier, f.contractNumber, f.contactPerson, f.phone, f.activeEquipmentCount, f.openTicketsCount]
        );
      }

      // 3. Seed Equipment
      for (const eq of SEED_EQUIPMENT) {
        await client.query(
          `INSERT INTO hospital_equipment
           (id, facility_id, name, category, manufacturer, model, serial_number, qr_code_tag, department, installation_date, last_calibration_date, next_calibration_due, calibration_status, uptime_percentage, sla_coverage, operational_status, power_requirements, last_service_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
           ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           calibration_status = EXCLUDED.calibration_status,
           operational_status = EXCLUDED.operational_status,
           uptime_percentage = EXCLUDED.uptime_percentage`,
          [
            eq.id, eq.facilityId, eq.name, eq.category, eq.manufacturer, eq.model,
            eq.serialNumber, eq.qrCodeTag, eq.department, eq.installationDate,
            eq.lastCalibrationDate, eq.nextCalibrationDue, eq.calibrationStatus,
            eq.uptimePercentage, eq.slaCoverage, eq.operationalStatus,
            eq.powerRequirements, eq.lastServiceNotes
          ]
        );
      }

      // 4. Seed Tickets
      for (const t of SEED_TICKETS) {
        await client.query(
          `INSERT INTO hospital_tickets
           (ticket_id, hospital_name, department, equipment_name, issue_description, priority, status, assigned_engineer, date_reported, estimated_arrival)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (ticket_id) DO UPDATE SET
           status = EXCLUDED.status,
           assigned_engineer = EXCLUDED.assigned_engineer`,
          [t.ticketId, t.hospitalName, t.department, t.equipmentName, t.issueDescription, t.priority, t.status, t.assignedEngineer, t.dateReported, t.estimatedArrival]
        );
      }

      // 5. Seed Spare Parts
      for (const sp of SEED_SPARE_PARTS) {
        await client.query(
          `INSERT INTO regional_spare_parts
           (part_number, name, category, compatible_equipment, in_stock_dar, in_stock_arusha, unit, criticality)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (part_number) DO UPDATE SET
           in_stock_dar = EXCLUDED.in_stock_dar,
           in_stock_arusha = EXCLUDED.in_stock_arusha`,
          [sp.partNumber, sp.name, sp.category, sp.compatibleEquipment, sp.inStockDar, sp.inStockArusha, sp.unit, sp.criticality]
        );
      }

      // 6. Seed SMS Logs
      for (const sms of SEED_SMS_LOGS) {
        await client.query(
          `INSERT INTO sms_logs
           (id, timestamp, recipient_name, recipient_role, phone_number, message_type, content, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [sms.id, sms.timestamp, sms.recipientName, sms.recipientRole, sms.phoneNumber, sms.messageType, sms.content, sms.status]
        );
      }

      console.log('🌟 PostgreSQL database fully populated with all tables and live clinical data!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('⚠️ Warning during PostgreSQL initialization/seeding:', (err as Error).message);
  }
}

// ---------------- REST API ENDPOINTS ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'COREMED TECH Biomedical Backend (Tanzania)' });
});

// Database Status & Diagnostics
app.get('/api/db/status', async (req, res) => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT version(), current_database(), current_user, NOW() as server_time');
      const latencyMs = Date.now() - start;

      const countsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM hospital_facilities) as facilities_count,
          (SELECT COUNT(*) FROM hospital_equipment) as equipment_count,
          (SELECT COUNT(*) FROM hospital_tickets) as tickets_count,
          (SELECT COUNT(*) FROM regional_spare_parts) as spare_parts_count,
          (SELECT COUNT(*) FROM sms_logs) as sms_logs_count
      `);

      res.json({
        success: true,
        provider: 'postgresql',
        database: result.rows[0].current_database,
        user: result.rows[0].current_user,
        version: result.rows[0].version,
        serverTime: result.rows[0].server_time,
        latencyMs,
        counts: countsResult.rows[0],
        host: '169.58.108.190:5434',
        ssl: true
      });
    } finally {
      client.release();
    }
  } catch (err) {
    const latencyMs = Date.now() - start;
    res.status(500).json({
      success: false,
      error: (err as Error).message,
      latencyMs,
      host: '169.58.108.190:5434'
    });
  }
});

// Force Re-seed endpoint
app.post('/api/db/seed', async (req, res) => {
  try {
    await initDatabaseAndSeed();
    res.json({ success: true, message: 'PostgreSQL database seeded successfully with all tables and rows.' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// 1. Facilities API
app.get('/api/facilities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, name, location, region, type, 
        sla_tier as "slaTier", 
        contract_number as "contractNumber", 
        contact_person as "contactPerson", 
        phone, 
        active_equipment_count as "activeEquipmentCount", 
        open_tickets_count as "openTicketsCount"
      FROM hospital_facilities 
      ORDER BY name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/facilities', async (req, res) => {
  try {
    const f = req.body;
    const id = f.id || `fac-${Date.now().toString(36)}`;
    const result = await pool.query(
      `INSERT INTO hospital_facilities 
       (id, name, location, region, type, sla_tier, contract_number, contact_person, phone, active_equipment_count, open_tickets_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, location = EXCLUDED.location, region = EXCLUDED.region, phone = EXCLUDED.phone
       RETURNING 
         id, name, location, region, type, 
         sla_tier as "slaTier", contract_number as "contractNumber", 
         contact_person as "contactPerson", phone, 
         active_equipment_count as "activeEquipmentCount", 
         open_tickets_count as "openTicketsCount"`,
      [
        id, f.name, f.location || '', f.region || 'Dar es Salaam',
        f.type || 'Hospital', f.slaTier || 'Comprehensive Tier 1',
        f.contractNumber || `TZ-SLA-${Date.now()}`,
        f.contactPerson || '', f.phone || '',
        f.activeEquipmentCount || 0, f.openTicketsCount || 0
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 2. Equipment API
app.get('/api/equipment', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        facility_id as "facilityId", 
        name, category, manufacturer, model, 
        serial_number as "serialNumber", 
        qr_code_tag as "qrCodeTag", 
        department, 
        installation_date as "installationDate", 
        last_calibration_date as "lastCalibrationDate", 
        next_calibration_due as "nextCalibrationDue", 
        calibration_status as "calibrationStatus", 
        uptime_percentage as "uptimePercentage", 
        sla_coverage as "slaCoverage", 
        operational_status as "operationalStatus", 
        power_requirements as "powerRequirements", 
        last_service_notes as "lastServiceNotes"
      FROM hospital_equipment 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const eq = req.body;
    const id = eq.id || `eq-${Date.now().toString(36)}`;
    const result = await pool.query(
      `INSERT INTO hospital_equipment
       (id, facility_id, name, category, manufacturer, model, serial_number, qr_code_tag, department, installation_date, last_calibration_date, next_calibration_due, calibration_status, uptime_percentage, sla_coverage, operational_status, power_requirements, last_service_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       calibration_status = EXCLUDED.calibration_status,
       operational_status = EXCLUDED.operational_status,
       uptime_percentage = EXCLUDED.uptime_percentage
       RETURNING 
         id, facility_id as "facilityId", name, category, manufacturer, model,
         serial_number as "serialNumber", qr_code_tag as "qrCodeTag", department,
         installation_date as "installationDate", last_calibration_date as "lastCalibrationDate",
         next_calibration_due as "nextCalibrationDue", calibration_status as "calibrationStatus",
         uptime_percentage as "uptimePercentage", sla_coverage as "slaCoverage",
         operational_status as "operationalStatus", power_requirements as "powerRequirements",
         last_service_notes as "lastServiceNotes"`,
      [
        id, eq.facilityId || null, eq.name, eq.category || 'Diagnostic', eq.manufacturer || '',
        eq.model || '', eq.serialNumber || `SN-${Date.now()}`, eq.qrCodeTag || `CMT-QR-${id}`,
        eq.department || 'Clinical Engineering',
        eq.installationDate || new Date().toISOString().split('T')[0],
        eq.lastCalibrationDate || new Date().toISOString().split('T')[0],
        eq.nextCalibrationDue || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        eq.calibrationStatus || 'Valid',
        eq.uptimePercentage || 99.4,
        eq.slaCoverage || 'Comprehensive Tier 1',
        eq.operationalStatus || 'Operational',
        eq.powerRequirements || '230V AC',
        eq.lastServiceNotes || 'Calibrated and certified.'
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hospital_equipment WHERE id = $1', [req.params.id]);
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 3. Tickets API
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ticket_id as "ticketId", 
        hospital_name as "hospitalName", 
        department, 
        equipment_name as "equipmentName", 
        issue_description as "issueDescription", 
        priority, 
        status, 
        assigned_engineer as "assignedEngineer", 
        date_reported as "dateReported", 
        estimated_arrival as "estimatedArrival"
      FROM hospital_tickets 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const t = req.body;
    const ticketId = t.ticketId || `CMT-SLA-${Math.floor(10000 + Math.random() * 90000)}`;
    const result = await pool.query(
      `INSERT INTO hospital_tickets
       (ticket_id, hospital_name, department, equipment_name, issue_description, priority, status, assigned_engineer, date_reported, estimated_arrival)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING 
         ticket_id as "ticketId", hospital_name as "hospitalName", department,
         equipment_name as "equipmentName", issue_description as "issueDescription",
         priority, status, assigned_engineer as "assignedEngineer",
         date_reported as "dateReported", estimated_arrival as "estimatedArrival"`,
      [
        ticketId, t.hospitalName || 'Regency Medical Centre', t.department || 'ICU',
        t.equipmentName || 'Biomedical Machine', t.issueDescription || '',
        t.priority || 'Emergency', t.status || 'Dispatched',
        t.assignedEngineer || 'Eng. Kelvin Lyimo, B.Sc. Biomedical (ERB #9482)',
        t.dateReported || new Date().toISOString().split('T')[0],
        t.estimatedArrival || 'Under 2 Hours'
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.patch('/api/tickets/:id', async (req, res) => {
  try {
    const { status, assignedEngineer } = req.body;
    const result = await pool.query(
      `UPDATE hospital_tickets 
       SET status = COALESCE($1, status),
           assigned_engineer = COALESCE($2, assigned_engineer)
       WHERE ticket_id = $3
       RETURNING 
         ticket_id as "ticketId", hospital_name as "hospitalName", department,
         equipment_name as "equipmentName", issue_description as "issueDescription",
         priority, status, assigned_engineer as "assignedEngineer",
         date_reported as "dateReported", estimated_arrival as "estimatedArrival"`,
      [status, assignedEngineer, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 4. Regional Spare Parts API
app.get('/api/spare-parts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        part_number as "partNumber", 
        name, category, 
        compatible_equipment as "compatibleEquipment", 
        in_stock_dar as "inStockDar", 
        in_stock_arusha as "inStockArusha", 
        unit, criticality
      FROM regional_spare_parts 
      ORDER BY in_stock_dar DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 5. SMS & WhatsApp Audit Logs API
app.get('/api/sms-logs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, timestamp, 
        recipient_name as "recipientName", 
        recipient_role as "recipientRole", 
        phone_number as "phoneNumber", 
        message_type as "messageType", 
        content, status
      FROM sms_logs 
      ORDER BY timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/sms-logs', async (req, res) => {
  try {
    const s = req.body;
    const id = s.id || `SMS-${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO sms_logs 
       (id, recipient_name, recipient_role, phone_number, message_type, content, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING 
         id, timestamp, recipient_name as "recipientName", 
         recipient_role as "recipientRole", phone_number as "phoneNumber", 
         message_type as "messageType", content, status`,
      [
        id, s.recipientName || 'Hospital Director', s.recipientRole || 'BioMed Head',
        s.phoneNumber || '+255 742 296 631', s.messageType || 'SLA Alert',
        s.content || '', s.status || 'Delivered (Handset ACK)'
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  await initDatabaseAndSeed();

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
