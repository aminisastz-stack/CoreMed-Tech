import {
  HospitalFacility,
  RegisteredEquipment,
  DEMO_FACILITIES,
  REGISTERED_HOSPITAL_EQUIPMENT,
  CALIBRATION_CERTIFICATES,
  CalibrationRecord,
  TENDER_DOCUMENTS,
  TenderDocument,
  INITIAL_SMS_LOGS,
  SmsNotification
} from '../data/portalData';
import { HospitalTicket } from '../types';
import { DEMO_TICKETS } from '../data/mockData';

export interface DatabaseConfig {
  provider: 'local_embedded' | 'postgresql' | 'supabase' | 'firebase' | 'rest_api';
  databaseName: string;
  connectionUri: string;
  apiKey?: string;
  status: 'connected' | 'standby' | 'ready';
  lastSync?: string;
  autoSync: boolean;
}

const STORAGE_KEYS = {
  FACILITIES: 'coremed_tz_facilities_v2',
  EQUIPMENT: 'coremed_tz_equipment_v2',
  TICKETS: 'coremed_tz_tickets_v2',
  SMS_LOGS: 'coremed_tz_sms_logs_v2',
  DB_CONFIG: 'coremed_tz_database_config_v2',
};

const DEFAULT_DB_CONFIG: DatabaseConfig = {
  provider: 'local_embedded',
  databaseName: 'coremed_biomedical_tz_db',
  connectionUri: 'postgresql://coremed_admin:••••••••@tz-db-cluster-01.internal.coremed.tz:5432/coremed_hospital_os',
  apiKey: 'cmt_live_sec_tz9948201',
  status: 'ready',
  lastSync: 'Synced with local cache',
  autoSync: true,
};

class DatabaseService {
  // --- FACILITIES / HOSPITALS ---
  getFacilities(): HospitalFacility[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FACILITIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading facilities from localStorage:', e);
    }
    // Fallback to default initial facilities
    this.saveFacilities(DEMO_FACILITIES);
    return DEMO_FACILITIES;
  }

  saveFacilities(facilities: HospitalFacility[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
    } catch (e) {
      console.warn('Error saving facilities to localStorage:', e);
    }
  }

  addFacility(newFacility: Omit<HospitalFacility, 'id'> & { id?: string }): HospitalFacility {
    const facilities = this.getFacilities();
    const id = newFacility.id || `fac-${Date.now().toString(36)}`;
    const fullFacility: HospitalFacility = {
      ...newFacility,
      id,
      activeEquipmentCount: newFacility.activeEquipmentCount || 0,
      openTicketsCount: newFacility.openTicketsCount || 0,
    };
    const updated = [fullFacility, ...facilities];
    this.saveFacilities(updated);
    return fullFacility;
  }

  // --- REGISTERED EQUIPMENT / DEVICES ---
  getEquipment(): RegisteredEquipment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading equipment from localStorage:', e);
    }
    this.saveEquipment(REGISTERED_HOSPITAL_EQUIPMENT);
    return REGISTERED_HOSPITAL_EQUIPMENT;
  }

  saveEquipment(equipment: RegisteredEquipment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
    } catch (e) {
      console.warn('Error saving equipment to localStorage:', e);
    }
  }

  addEquipment(device: Omit<RegisteredEquipment, 'id'> & { id?: string }): RegisteredEquipment {
    const equipment = this.getEquipment();
    const id = device.id || `EQ-${Date.now().toString(36).toUpperCase()}`;
    const fullDevice: RegisteredEquipment = {
      ...device,
      id,
    };
    const updated = [fullDevice, ...equipment];
    this.saveEquipment(updated);

    // Also update facility activeEquipmentCount
    const facilities = this.getFacilities();
    const facilityIdx = facilities.findIndex((f) => f.id === device.facilityId);
    if (facilityIdx >= 0) {
      facilities[facilityIdx] = {
        ...facilities[facilityIdx],
        activeEquipmentCount: (facilities[facilityIdx].activeEquipmentCount || 0) + 1,
      };
      this.saveFacilities(facilities);
    }

    return fullDevice;
  }

  deleteEquipment(deviceId: string): void {
    const equipment = this.getEquipment();
    const toRemove = equipment.find((e) => e.id === deviceId);
    const updated = equipment.filter((e) => e.id !== deviceId);
    this.saveEquipment(updated);

    if (toRemove?.facilityId) {
      const facilities = this.getFacilities();
      const facilityIdx = facilities.findIndex((f) => f.id === toRemove.facilityId);
      if (facilityIdx >= 0 && facilities[facilityIdx].activeEquipmentCount > 0) {
        facilities[facilityIdx] = {
          ...facilities[facilityIdx],
          activeEquipmentCount: facilities[facilityIdx].activeEquipmentCount - 1,
        };
        this.saveFacilities(facilities);
      }
    }
  }

  // --- TICKETS / SLA WORK ORDERS ---
  getTickets(): HospitalTicket[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading tickets from localStorage:', e);
    }
    this.saveTickets(DEMO_TICKETS);
    return DEMO_TICKETS;
  }

  saveTickets(tickets: HospitalTicket[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Error saving tickets to localStorage:', e);
    }
  }

  addTicket(ticket: HospitalTicket): void {
    const tickets = this.getTickets();
    const updated = [ticket, ...tickets];
    this.saveTickets(updated);
  }

  // --- SMS LOGS ---
  getSmsLogs(): SmsNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SMS_LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading SMS logs from localStorage:', e);
    }
    return INITIAL_SMS_LOGS;
  }

  saveSmsLogs(logs: SmsNotification[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Error saving SMS logs to localStorage:', e);
    }
  }

  // --- DATABASE CONNECTION CONFIG ---
  getDbConfig(): DatabaseConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DB_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading DB config from localStorage:', e);
    }
    return DEFAULT_DB_CONFIG;
  }

  saveDbConfig(config: DatabaseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DB_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Error saving DB config to localStorage:', e);
    }
  }

  // --- EXPORT / IMPORT / RESET ---
  exportFullDatabase(): string {
    const data = {
      meta: {
        system: 'CoreMed Tech Biomedical OS',
        version: '2.6 Enterprise',
        exportDate: new Date().toISOString(),
        tanzania_region: 'East Africa / Tanzania Mainland & Zanzibar',
      },
      dbConfig: this.getDbConfig(),
      facilities: this.getFacilities(),
      equipment: this.getEquipment(),
      tickets: this.getTickets(),
      smsLogs: this.getSmsLogs(),
      calibrationCertificates: CALIBRATION_CERTIFICATES,
      tenderDocuments: TENDER_DOCUMENTS,
    };
    return JSON.stringify(data, null, 2);
  }

  importDatabase(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.facilities && Array.isArray(parsed.facilities)) {
        this.saveFacilities(parsed.facilities);
      }
      if (parsed.equipment && Array.isArray(parsed.equipment)) {
        this.saveEquipment(parsed.equipment);
      }
      if (parsed.tickets && Array.isArray(parsed.tickets)) {
        this.saveTickets(parsed.tickets);
      }
      if (parsed.smsLogs && Array.isArray(parsed.smsLogs)) {
        this.saveSmsLogs(parsed.smsLogs);
      }
      if (parsed.dbConfig) {
        this.saveDbConfig(parsed.dbConfig);
      }
      return true;
    } catch (e) {
      console.error('Failed to import database:', e);
      return false;
    }
  }

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.FACILITIES);
    localStorage.removeItem(STORAGE_KEYS.EQUIPMENT);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.SMS_LOGS);
    localStorage.removeItem(STORAGE_KEYS.DB_CONFIG);
  }
}

export const databaseService = new DatabaseService();
