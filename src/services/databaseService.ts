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
  provider: 'postgresql' | 'local_embedded' | 'supabase' | 'firebase' | 'rest_api';
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
  provider: 'postgresql',
  databaseName: 'postgres',
  connectionUri: 'postgres://postgres:uNmmwjzaeJ5Np9P@169.58.108.190:5434/postgres?sslmode=require',
  apiKey: 'uNmmwjzaeJ5Np9P',
  status: 'connected',
  lastSync: 'Live PostgreSQL (169.58.108.190:5434)',
  autoSync: true,
};

class DatabaseService {
  // --- TEST POSTGRESQL LIVE CONNECTION ---
  async testConnection(): Promise<{ success: boolean; latencyMs: number; message: string; data?: any }> {
    try {
      const response = await fetch('/api/db/status');
      const data = await response.json();
      if (response.ok && data.success) {
        return {
          success: true,
          latencyMs: data.latencyMs || 42,
          message: `Connected to PostgreSQL cluster at ${data.host} (${data.database}). Live table records loaded.`,
          data
        };
      } else {
        return {
          success: false,
          latencyMs: data.latencyMs || 0,
          message: data.error || 'Failed to connect to PostgreSQL database.',
          data
        };
      }
    } catch (err) {
      return {
        success: false,
        latencyMs: 0,
        message: (err as Error).message || 'Network error connecting to backend database proxy.'
      };
    }
  }

  // --- RE-SEED / FORCE UPLOAD POSTGRESQL ---
  async reseedPostgresDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/db/seed', { method: 'POST' });
      const data = await response.json();
      return data;
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }

  // --- FACILITIES / HOSPITALS ---
  async fetchLiveFacilities(): Promise<HospitalFacility[]> {
    try {
      const response = await fetch('/api/facilities');
      if (response.ok) {
        const live = await response.json();
        if (Array.isArray(live) && live.length > 0) {
          this.saveFacilities(live);
          return live;
        }
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local cache:', e);
    }
    return this.getFacilities();
  }

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

    // Sync to PostgreSQL backend
    fetch('/api/facilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullFacility)
    }).catch(err => console.warn('Could not sync facility to Postgres:', err));

    return fullFacility;
  }

  // --- REGISTERED EQUIPMENT / DEVICES ---
  async fetchLiveEquipment(): Promise<RegisteredEquipment[]> {
    try {
      const response = await fetch('/api/equipment');
      if (response.ok) {
        const live = await response.json();
        if (Array.isArray(live) && live.length > 0) {
          this.saveEquipment(live);
          return live;
        }
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local cache:', e);
    }
    return this.getEquipment();
  }

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

  addEquipment(newEq: Omit<RegisteredEquipment, 'id'> & { id?: string }): RegisteredEquipment {
    const equipment = this.getEquipment();
    const id = newEq.id || `eq-${Date.now().toString(36)}`;
    const fullEq: RegisteredEquipment = {
      ...newEq,
      id,
      calibrationStatus: newEq.calibrationStatus || 'Valid',
      operationalStatus: newEq.operationalStatus || 'Operational',
      uptimePercentage: newEq.uptimePercentage || 99.4,
    };
    const updated = [fullEq, ...equipment];
    this.saveEquipment(updated);

    // Sync to PostgreSQL backend
    fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullEq)
    }).catch(err => console.warn('Could not sync equipment to Postgres:', err));

    return fullEq;
  }

  updateEquipment(id: string, updates: Partial<RegisteredEquipment>): RegisteredEquipment | null {
    const equipment = this.getEquipment();
    const idx = equipment.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const updatedEq = { ...equipment[idx], ...updates };
    equipment[idx] = updatedEq;
    this.saveEquipment(equipment);

    fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEq)
    }).catch(err => console.warn('Could not sync update to Postgres:', err));

    return updatedEq;
  }

  deleteEquipment(id: string): boolean {
    const equipment = this.getEquipment();
    const filtered = equipment.filter((e) => e.id !== id);
    if (filtered.length !== equipment.length) {
      this.saveEquipment(filtered);
      fetch(`/api/equipment/${id}`, { method: 'DELETE' }).catch(err =>
        console.warn('Could not delete from Postgres:', err)
      );
      return true;
    }
    return false;
  }

  // --- TICKETS / SLA DISPATCH ---
  async fetchLiveTickets(): Promise<HospitalTicket[]> {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const live = await response.json();
        if (Array.isArray(live) && live.length > 0) {
          this.saveTickets(live);
          return live;
        }
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local cache:', e);
    }
    return this.getTickets();
  }

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

  addTicket(newTicket: Omit<HospitalTicket, 'ticketId'> & { ticketId?: string }): HospitalTicket {
    const tickets = this.getTickets();
    const ticketId = newTicket.ticketId || `CMT-SLA-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullTicket: HospitalTicket = {
      ...newTicket,
      ticketId,
      status: newTicket.status || 'Dispatched',
      dateReported: newTicket.dateReported || new Date().toISOString().split('T')[0],
      assignedEngineer: newTicket.assignedEngineer || 'Eng. Kelvin Lyimo, B.Sc. Biomedical',
      estimatedArrival: newTicket.estimatedArrival || 'Under 4 Hours',
    };
    const updated = [fullTicket, ...tickets];
    this.saveTickets(updated);

    // Sync to PostgreSQL backend
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullTicket)
    }).catch(err => console.warn('Could not sync ticket to Postgres:', err));

    return fullTicket;
  }

  updateTicketStatus(ticketId: string, status: HospitalTicket['status']): HospitalTicket | null {
    const tickets = this.getTickets();
    const idx = tickets.findIndex((t) => t.ticketId === ticketId);
    if (idx === -1) return null;

    tickets[idx].status = status;
    this.saveTickets(tickets);

    fetch(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.warn('Could not sync status to Postgres:', err));

    return tickets[idx];
  }

  // --- SMS & AUDIT LOGS ---
  async fetchLiveSmsLogs(): Promise<SmsNotification[]> {
    try {
      const response = await fetch('/api/sms-logs');
      if (response.ok) {
        const live = await response.json();
        if (Array.isArray(live) && live.length > 0) {
          this.saveSmsLogs(live);
          return live;
        }
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local cache:', e);
    }
    return this.getSmsLogs();
  }

  getSmsLogs(): SmsNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SMS_LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading SMS logs from localStorage:', e);
    }
    this.saveSmsLogs(INITIAL_SMS_LOGS);
    return INITIAL_SMS_LOGS;
  }

  saveSmsLogs(logs: SmsNotification[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Error saving SMS logs to localStorage:', e);
    }
  }

  addSmsLog(sms: Omit<SmsNotification, 'id'> & { id?: string }): SmsNotification {
    const logs = this.getSmsLogs();
    const id = sms.id || `SMS-${Date.now()}`;
    const fullSms: SmsNotification = {
      ...sms,
      id,
    };
    const updated = [fullSms, ...logs];
    this.saveSmsLogs(updated);

    fetch('/api/sms-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullSms)
    }).catch(err => console.warn('Could not sync SMS log to Postgres:', err));

    return fullSms;
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
        database_host: '169.58.108.190:5434',
        database_engine: 'PostgreSQL 15+ (Production)'
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
