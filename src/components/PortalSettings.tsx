import React, { useState, useRef } from 'react';
import { useBrand, SiteImages } from '../context/BrandContext';
import { useSensors, SensorGatewayConfig } from '../context/SensorContext';
import { databaseService, DatabaseConfig } from '../services/databaseService';
import { BrandLogo } from './BrandLogo';
import { HospitalFacility, SmsNotification, DEMO_FACILITIES } from '../data/portalData';
import {
  Cpu,
  Wifi,
  Radio,
  SlidersHorizontal,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Upload,
  Check,
  Building,
  Building2,
  Bell,
  Search,
  Gauge,
  Thermometer,
  ShieldCheck,
  FileImage,
  MapPin,
  Phone,
  Mail,
  Send,
  ExternalLink,
  ChevronRight,
  Database,
  Server,
  Download,
  UploadCloud,
  RefreshCw,
  Plus,
  HardDrive,
  FileText,
  AlertCircle
} from 'lucide-react';

export type SettingsSubTab = 'sensors' | 'hospitals' | 'database' | 'brand' | 'media' | 'company' | 'alerts';

interface PortalSettingsProps {
  onNavigateToTelemetry: () => void;
  currentFacility: HospitalFacility;
  facilities?: HospitalFacility[];
  smsLogs: SmsNotification[];
  setSmsLogs: React.Dispatch<React.SetStateAction<SmsNotification[]>>;
  selectedFacilityId: string;
  setSelectedFacilityId: (id: string) => void;
  activeSubTab?: SettingsSubTab;
  onSubTabChange?: (tab: SettingsSubTab) => void;
  onOpenRegisterHospital?: () => void;
  onOpenRegisterDevice?: (facilityId?: string) => void;
  equipmentCount?: number;
  ticketsCount?: number;
  onRefreshData?: () => void;
}

// Preset logos for quick vector branding tests
const PRESET_LOGOS = [
  {
    id: 'pulse-blue',
    name: 'Clinical Wave (Blue)',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" fill="none"><rect width="44" height="44" rx="12" fill="%230F4C81"/><path d="M12 24h6l4-10 6 20 4-10h6" stroke="%2310B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="54" y="24" font-family="system-ui,sans-serif" font-weight="900" font-size="14" fill="%230F4C81">COREMED</text><text x="54" y="38" font-family="system-ui,sans-serif" font-weight="700" font-size="10" fill="%2310B981">TECH</text></svg>'
  },
  {
    id: 'cross-emerald',
    name: 'Medical Cross (Emerald)',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" fill="none"><rect width="44" height="44" rx="12" fill="%2310B981"/><path d="M22 14v16M14 22h16" stroke="white" stroke-width="4" stroke-linecap="round"/><text x="54" y="24" font-family="system-ui,sans-serif" font-weight="900" font-size="14" fill="%230F4C81">COREMED</text><text x="54" y="38" font-family="system-ui,sans-serif" font-weight="600" font-size="10" fill="%2364748B">BIOMEDICAL</text></svg>'
  },
  {
    id: 'caduceus-gold',
    name: 'Shield Emblem (Gold)',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" fill="none"><rect width="44" height="44" rx="12" fill="%23071B2D"/><circle cx="22" cy="22" r="10" stroke="%23F59E0B" stroke-width="2.5"/><path d="M22 16v12M17 20h10" stroke="%2310B981" stroke-width="2.5" stroke-linecap="round"/><text x="54" y="24" font-family="system-ui,sans-serif" font-weight="900" font-size="14" fill="%230F4C81">COREMED</text><text x="54" y="38" font-family="system-ui,sans-serif" font-weight="700" font-size="10" fill="%23F59E0B">TANZANIA</text></svg>'
  }
];

export const PortalSettings: React.FC<PortalSettingsProps> = ({
  onNavigateToTelemetry,
  currentFacility,
  facilities = DEMO_FACILITIES,
  smsLogs,
  setSmsLogs,
  selectedFacilityId,
  setSelectedFacilityId,
  activeSubTab = 'sensors',
  onSubTabChange,
  onOpenRegisterHospital,
  onOpenRegisterDevice,
  equipmentCount = 6,
  ticketsCount = 3,
  onRefreshData
}) => {
  const [currentMenu, setCurrentMenu] = useState<SettingsSubTab>(activeSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoSuccessMsg, setLogoSuccessMsg] = useState<string | null>(null);
  const [testSmsStatus, setTestSmsStatus] = useState<string | null>(null);
  const [dbSuccessMsg, setDbSuccessMsg] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const dbImportInputRef = useRef<HTMLInputElement>(null);

  // Database Connection Config State
  const [dbConfigForm, setDbConfigForm] = useState<DatabaseConfig>(() => databaseService.getDbConfig());
  const [isTestingDbPing, setIsTestingDbPing] = useState(false);
  const [dbPingResult, setDbPingResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  const {
    customLogo,
    logoScale,
    updateLogo,
    updateLogoScale,
    resetLogo,
    updateSiteImage,
    rechargeAllImages
  } = useBrand();

  const {
    gatewayConfig,
    updateGatewayConfig,
    resetGatewayConfig,
    testSensorHardwarePing
  } = useSensors();

  const [sensorConfigForm, setSensorConfigForm] = useState<SensorGatewayConfig>(gatewayConfig);
  const [sensorSaveSuccessMsg, setSensorSaveSuccessMsg] = useState<string | null>(null);
  const [isTestingGatewayPing, setIsTestingGatewayPing] = useState(false);
  const [gatewayPingResult, setGatewayPingResult] = useState<{
    success: boolean;
    latencyMs: number;
    rssi: number;
    message: string;
  } | null>(null);

  const handleSelectMenu = (tab: SettingsSubTab) => {
    setCurrentMenu(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateLogo(event.target.result as string);
          setLogoSuccessMsg('Custom logo uploaded & active system-wide!');
          setTimeout(() => setLogoSuccessMsg(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlotImageUpload = (slot: keyof SiteImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSiteImage(slot, event.target.result as string);
          setLogoSuccessMsg(`Updated media image slot "${String(slot)}"!`);
          setTimeout(() => setLogoSuccessMsg(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunGatewayPing = async () => {
    setIsTestingGatewayPing(true);
    setGatewayPingResult(null);
    try {
      const res = await testSensorHardwarePing();
      setGatewayPingResult(res);
    } catch {
      setGatewayPingResult({
        success: false,
        latencyMs: 0,
        rssi: 0,
        message: 'Ping failed: Timeout reaching hardware gateway.',
      });
    } finally {
      setIsTestingGatewayPing(false);
    }
  };

  const handleSaveSensorConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateGatewayConfig(sensorConfigForm);
    setSensorSaveSuccessMsg('Hardware sensor gateway parameters & calibration offsets saved! Real results are now active in the IoT Monitoring Dashboard.');
    setTimeout(() => setSensorSaveSuccessMsg(null), 4000);
  };

  const handleResetSensorConfig = () => {
    resetGatewayConfig();
    setSensorConfigForm(gatewayConfig);
    setSensorSaveSuccessMsg('Sensor gateway restored to factory TMDA calibration defaults.');
    setTimeout(() => setSensorSaveSuccessMsg(null), 3000);
  };

  const handleTestSmsDispatch = () => {
    setTestSmsStatus('testing');
    setTimeout(() => {
      const testMsg: SmsNotification = {
        id: `SMS-${Date.now()}`,
        ticketId: 'CMT-SCADA-01',
        recipientName: 'Eng. Casto Mwita',
        recipientPhone: '+255 742 296 631',
        recipientRole: 'Lead Systems Engineer',
        carrier: 'Vodacom Tanzania',
        messageBody: `[TEST SCADA ALERT] CoreMed Telemetry: Gateway CMT-GW-DAR-KJT-01 test handshake verified. All sensors nominal.`,
        timestamp: 'Just now',
        deliveryStatus: 'Delivered (Handset ACK)',
      };
      setSmsLogs((prev) => [testMsg, ...prev]);
      setTestSmsStatus('delivered');
      setTimeout(() => setTestSmsStatus(null), 4000);
    }, 1000);
  };

  // Database Connection Handlers
  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    databaseService.saveDbConfig(dbConfigForm);
    setDbSuccessMsg('Database connection string & sync configuration saved successfully!');
    setTimeout(() => setDbSuccessMsg(null), 3500);
  };

  const handleTestDbPing = async () => {
    setIsTestingDbPing(true);
    setDbPingResult(null);
    try {
      const result = await databaseService.testConnection();
      setIsTestingDbPing(false);
      setDbPingResult(result);
    } catch (err) {
      setIsTestingDbPing(false);
      setDbPingResult({
        success: false,
        latencyMs: 0,
        message: (err as Error).message || 'Connection failed.'
      });
    }
  };

  const handleExportDatabase = () => {
    const jsonStr = databaseService.exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coremed_biomedical_db_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDbSuccessMsg('Full production database exported successfully (.json)!');
    setTimeout(() => setDbSuccessMsg(null), 3000);
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const ok = databaseService.importDatabase(content);
        if (ok) {
          setDbSuccessMsg('Database snapshot imported & live state refreshed!');
          if (onRefreshData) onRefreshData();
          setTimeout(() => setDbSuccessMsg(null), 4000);
        } else {
          alert('Invalid database JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset local database to factory demonstration seed data?')) {
      databaseService.resetToDefaults();
      if (onRefreshData) onRefreshData();
      setDbSuccessMsg('Database restored to factory default seed data.');
      setTimeout(() => setDbSuccessMsg(null), 3000);
    }
  };

  const SETTINGS_CATEGORIES = [
    {
      id: 'hospitals' as const,
      label: 'Hospitals & Healthcare Directory',
      shortLabel: 'Hospitals',
      icon: Building2,
      badge: `${facilities.length} Facilities`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'database' as const,
      label: 'Production Database & Sync',
      shortLabel: 'Database DB',
      icon: Database,
      badge: `${facilities.length + equipmentCount} Records`,
      badgeColor: 'bg-blue-100 text-[#0F4C81]'
    },
    {
      id: 'sensors' as const,
      label: 'IoT Sensors & Calibration',
      shortLabel: 'IoT Sensors',
      icon: Cpu,
      badge: sensorConfigForm.connectionMode === 'hardware_gateway' ? 'Hardware Link' : 'Simulation',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'brand' as const,
      label: 'Corporate Brand & Logo',
      shortLabel: 'Brand & Logo',
      icon: Sparkles,
      badge: `${Math.round(logoScale * 100)}% Scale`,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'media' as const,
      label: 'Website Visual Assets',
      shortLabel: 'Media Slots',
      icon: FileImage,
      badge: '4 Slots',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'company' as const,
      label: 'Company & Regional Hubs',
      shortLabel: 'HQ & Hubs',
      icon: Building,
      badge: 'TMDA & NeST',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'alerts' as const,
      label: 'SMS Dispatch & Alerts',
      shortLabel: 'SMS Alerts',
      icon: Bell,
      badge: `${smsLogs.length} Dispatches`,
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Category Navigation Bar Header */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0F4C81] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 font-display">
                Staff System & Settings Workspace
              </h4>
              <p className="text-xs text-slate-500">
                Classified configuration menus for hospital SCADA telemetry, corporate branding, media slots, and SMS alerts.
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C81]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 7 Distinct Classified Menu Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2 pt-2 border-t border-slate-100">
          {SETTINGS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentMenu === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectMenu(cat.id)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2 ${
                  isActive
                    ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#0F4C81] border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span
                    className={`text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full truncate ${
                      isActive ? 'bg-white/20 text-white' : cat.badgeColor
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs font-bold block truncate leading-tight">
                    {cat.shortLabel}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] block truncate mt-0.5 ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Database & General Feedback Toast */}
      {dbSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dbSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setDbSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* MENU: HOSPITALS & HEALTHCARE DIRECTORY */}
      {currentMenu === 'hospitals' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-base font-bold text-slate-900 font-display">
                  Hospital Facilities Directory & Healthcare Network
                </h5>
                <p className="text-xs text-slate-500">
                  Manage registered healthcare facilities across Tanzania. Add multiple medical devices to each hospital.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenRegisterDevice && (
                <button
                  type="button"
                  onClick={() => onOpenRegisterDevice(selectedFacilityId)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Medical Device</span>
                </button>
              )}
              {onOpenRegisterHospital && (
                <button
                  type="button"
                  onClick={onOpenRegisterHospital}
                  className="px-3.5 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Register New Hospital</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F4C81] shrink-0" />
              <span>
                <strong>Multi-Device Architecture:</strong> You can register various medical devices (Ultrasound, Ventilator, MRI, Autoclave, Oxygen Plant, Analyzers) to any hospital.
              </span>
            </div>
            <span className="font-bold text-[#0F4C81] shrink-0">{facilities.length} Active Hospitals</span>
          </div>

          {/* Hospitals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => {
              const isSelected = fac.id === selectedFacilityId;
              return (
                <div
                  key={fac.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-blue-50/40 border-[#0F4C81] shadow-sm ring-1 ring-[#0F4C81]'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {fac.region} · {fac.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{fac.name}</h4>
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-[#0F4C81] bg-white border border-[#0F4C81]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#0F4C81]" />
                          Active Console
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Network Partner
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.location}</span>
                    </p>

                    <div className="p-3 bg-white/90 border border-slate-100 rounded-2xl text-[11px] font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">SLA Contract:</span>
                        <span className="text-[#0F4C81] font-semibold">{fac.contractNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Coverage Tier:</span>
                        <span className="text-emerald-700 font-semibold">{fac.slaTier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Supervisor:</span>
                        <span className="text-slate-800">{fac.contactPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone Hotline:</span>
                        <span className="text-slate-800 font-bold">{fac.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {fac.activeEquipmentCount || 0} Devices
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        {fac.openTicketsCount || 0} Active Tickets
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onOpenRegisterDevice && (
                        <button
                          type="button"
                          onClick={() => onOpenRegisterDevice(fac.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Add a new device to this specific hospital"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Device</span>
                        </button>
                      )}
                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => setSelectedFacilityId(fac.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Select Facility
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MENU: PRODUCTION DATABASE & SYNC */}
      {currentMenu === 'database' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0F4C81] flex items-center justify-center shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-base font-bold text-slate-900 font-display">
                  Production Database & Cloud Data Store
                </h5>
                <p className="text-xs text-slate-500">
                  Ready for external database integration (PostgreSQL / Supabase / Firebase / Cloud SQL / REST API).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Engine Ready for Remote DB
              </span>
            </div>
          </div>

          {/* Database Metrics Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Registered Facilities</span>
              <span className="text-xl font-bold font-mono text-[#0F4C81] mt-1 block">
                {facilities.length}
              </span>
              <span className="text-[10px] text-slate-500 font-sans">hospitals_registry</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Medical Devices</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
                {equipmentCount}
              </span>
              <span className="text-[10px] text-slate-500 font-sans">hospital_equipment</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Work Order Tickets</span>
              <span className="text-xl font-bold font-mono text-indigo-700 mt-1 block">
                {ticketsCount}
              </span>
              <span className="text-[10px] text-slate-500 font-sans">sla_incident_tickets</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Cellular SMS Alerts</span>
              <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
                {smsLogs.length}
              </span>
              <span className="text-[10px] text-slate-500 font-sans">sms_cellular_logs</span>
            </div>
          </div>

          {/* Ping Test Result Banner */}
          {dbPingResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                dbPingResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">{dbPingResult.message}</span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    Round-trip latency: {dbPingResult.latencyMs}ms · TCP Keep-Alive Active
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDbPingResult(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Database Configuration Form */}
          <form onSubmit={handleSaveDbConfig} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#0F4C81]" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Database Connection & Endpoint Parameters
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Provide your DB credentials below anytime</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Database Engine / Backend Driver
                </label>
                <select
                  value={dbConfigForm.provider}
                  onChange={(e) =>
                    setDbConfigForm({ ...dbConfigForm, provider: e.target.value as DatabaseConfig['provider'] })
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  <option value="local_embedded">Embedded Production Engine (Indexed DB / Local Cache)</option>
                  <option value="postgresql">PostgreSQL (Dedicated Cluster / Cloud SQL)</option>
                  <option value="supabase">Supabase PostgreSQL (Managed Cloud DB)</option>
                  <option value="firebase">Firebase Firestore (NoSQL Document Store)</option>
                  <option value="rest_api">Custom Hospital ERP / REST API Endpoint</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Database Schema Name
                </label>
                <input
                  type="text"
                  value={dbConfigForm.databaseName}
                  onChange={(e) => setDbConfigForm({ ...dbConfigForm, databaseName: e.target.value })}
                  placeholder="e.g. coremed_biomedical_tz_db"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Database Connection URI / Endpoint URL
              </label>
              <input
                type="text"
                value={dbConfigForm.connectionUri}
                onChange={(e) => setDbConfigForm({ ...dbConfigForm, connectionUri: e.target.value })}
                placeholder="postgresql://username:password@your-db-host.com:5432/coremed_hospital_os"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Accepts PostgreSQL connection strings, Supabase REST endpoints, or internal cluster URLs.
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  API Key / Access Token (Optional)
                </label>
                <input
                  type="password"
                  value={dbConfigForm.apiKey || ''}
                  onChange={(e) => setDbConfigForm({ ...dbConfigForm, apiKey: e.target.value })}
                  placeholder="cmt_sec_live_••••••••"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div className="flex items-center justify-between pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={dbConfigForm.autoSync}
                    onChange={(e) => setDbConfigForm({ ...dbConfigForm, autoSync: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Continuous 2-Way Synchronization</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleTestDbPing}
                disabled={isTestingDbPing}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isTestingDbPing ? 'animate-spin' : ''}`} />
                <span>{isTestingDbPing ? 'Testing Connection...' : 'Test Connection Handshake'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save Database Credentials</span>
              </button>
            </div>
          </form>

          {/* Database Backup & Snapshot Manager */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-3 text-xs">
            <span className="font-bold text-slate-900 block">
              Database Export & Snapshot Recovery:
            </span>
            <p className="text-slate-500 text-xs leading-relaxed">
              Export the complete relational database snapshot (hospitals, medical devices, SLA tickets, and calibrations) as a formatted JSON document, or restore from a backup file.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportDatabase}
                className="px-4 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Database JSON Backup</span>
              </button>

              <input
                ref={dbImportInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportDatabase}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => dbImportInputRef.current?.click()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>Import Database JSON</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl transition-colors cursor-pointer ml-auto"
              >
                Reset to Factory Demo Seed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENU 1: IOT SENSORS & REAL-RESULT CALIBRATION */}
      {currentMenu === 'sensors' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-base font-bold text-slate-900 font-display">
                    IoT Sensor Gateway & Real-Result Calibration
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active SCADA Link
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure hardware IoT gateways, Modbus/MQTT transducers, and zero-point calibration offsets to project accurate physical pressure & temperature into clinical dashboards.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToTelemetry}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F4C81] text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>View Live Telemetry →</span>
            </button>
          </div>

          {sensorSaveSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{sensorSaveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveSensorConfig} className="space-y-6">
            {/* Mode selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                1. Ingestion Telemetry Mode:
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSensorConfigForm((prev) => ({ ...prev, connectionMode: 'hardware_gateway' }))}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    sensorConfigForm.connectionMode === 'hardware_gateway'
                      ? 'bg-blue-50/70 border-[#0F4C81] shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      sensorConfigForm.connectionMode === 'hardware_gateway'
                        ? 'bg-[#0F4C81] text-white'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Real Hospital Hardware Gateway</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                      Direct 4-20mA transducer and RTD PT-100 packets from plant-room gateways.
                    </span>
                    {sensorConfigForm.connectionMode === 'hardware_gateway' && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-[#0F4C81] bg-blue-100 px-2 py-0.5 rounded">
                        ✓ ACTIVE HARDWARE INGESTION
                      </span>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setSensorConfigForm((prev) => ({ ...prev, connectionMode: 'simulation' }))}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    sensorConfigForm.connectionMode === 'simulation'
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      sensorConfigForm.connectionMode === 'simulation'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Biomedical Simulation Engine</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                      Micro-variations, cylinder depletion, and test trigger injection for drills.
                    </span>
                    {sensorConfigForm.connectionMode === 'simulation' && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ ACTIVE SIMULATION MODE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transducer Devices */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Hardware Identifiers & Fieldbus Protocol:
              </span>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    MQTT Broker / Webhook Endpoint:
                  </label>
                  <input
                    type="text"
                    value={sensorConfigForm.mqttBrokerUrl}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, mqttBrokerUrl: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[11px] text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Gateway Device Serial ID:
                  </label>
                  <input
                    type="text"
                    value={sensorConfigForm.gatewayDeviceId}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, gatewayDeviceId: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Oxygen Line Transducer Model:
                  </label>
                  <input
                    type="text"
                    value={sensorConfigForm.oxygenTransducerId}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, oxygenTransducerId: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Temperature Sensor Channel:
                  </label>
                  <input
                    type="text"
                    value={sensorConfigForm.tempSensorDeviceId}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, tempSensorDeviceId: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Industrial Fieldbus Protocol:
                  </label>
                  <select
                    value={sensorConfigForm.protocol}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, protocol: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  >
                    <option value="Modbus RS-485">Modbus RS-485 (Industrial Plant Standard)</option>
                    <option value="MQTT / TLS">MQTT / TLS (Encrypted Cloud Broker)</option>
                    <option value="LoRaWAN IoT">LoRaWAN IoT (Long Range 868MHz)</option>
                    <option value="REST Webhook">REST Webhook (HTTPS JSON Push)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Telemetry Polling Rate:
                  </label>
                  <select
                    value={sensorConfigForm.pollIntervalSeconds}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, pollIntervalSeconds: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  >
                    <option value={1}>1 second (Critical ICU Rapid)</option>
                    <option value={3}>3 seconds (Standard SCADA)</option>
                    <option value={5}>5 seconds (Balanced)</option>
                    <option value={10}>10 seconds (Low Power)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* REAL-RESULT CALIBRATION OFFSETS */}
            <div className="p-5 bg-blue-50/60 rounded-3xl border-2 border-blue-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3. Real-Result Calibration & Zero-Point Offsets
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Transducers experience zero-drift over time. Adjusting offsets calibrates raw readings against an accredited master analog manometer to project physical truth.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 pt-2">
                {/* Pressure Offset */}
                <div className="p-4 bg-white rounded-2xl border border-blue-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-emerald-600" />
                      <span>Oxygen Pressure Offset:</span>
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {sensorConfigForm.pressureCalibrationOffset > 0 ? `+${sensorConfigForm.pressureCalibrationOffset.toFixed(2)}` : sensorConfigForm.pressureCalibrationOffset.toFixed(2)} bar
                    </span>
                  </div>

                  <input
                    type="range"
                    min="-0.50"
                    max="0.50"
                    step="0.01"
                    value={sensorConfigForm.pressureCalibrationOffset}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, pressureCalibrationOffset: Number(e.target.value) }))}
                    className="w-full accent-[#0F4C81] cursor-pointer"
                  />

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Raw Sensor Reading:</span>
                      <span className="font-mono font-semibold">4.18 bar</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span className="text-emerald-700">Projected Real Physical Result:</span>
                      <span className="font-mono text-sm text-[#0F4C81]">
                        {(4.18 + sensorConfigForm.pressureCalibrationOffset).toFixed(2)} bar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Temperature Offset */}
                <div className="p-4 bg-white rounded-2xl border border-blue-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-blue-600" />
                      <span>Temperature Sensor Offset:</span>
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {sensorConfigForm.temperatureCalibrationOffset > 0 ? `+${sensorConfigForm.temperatureCalibrationOffset.toFixed(1)}` : sensorConfigForm.temperatureCalibrationOffset.toFixed(1)} °C
                    </span>
                  </div>

                  <input
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.1"
                    value={sensorConfigForm.temperatureCalibrationOffset}
                    onChange={(e) => setSensorConfigForm((prev) => ({ ...prev, temperatureCalibrationOffset: Number(e.target.value) }))}
                    className="w-full accent-[#0F4C81] cursor-pointer"
                  />

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Raw RTD PT-100 Reading:</span>
                      <span className="font-mono font-semibold">4.2 °C</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span className="text-emerald-700">Projected Real Physical Result:</span>
                      <span className="font-mono text-sm text-[#0F4C81]">
                        {(4.2 + sensorConfigForm.temperatureCalibrationOffset).toFixed(1)} °C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Ping */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Diagnostic Transducer Ping & Link Verification</span>
                <span className="text-[11px] text-slate-500">Tests loop impedance, signal RSSI, and gateway handshake status.</span>
                {gatewayPingResult && (
                  <div className="mt-2 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{gatewayPingResult.message} ({gatewayPingResult.latencyMs}ms, RSSI {gatewayPingResult.rssi} dBm)</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRunGatewayPing}
                disabled={isTestingGatewayPing}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                {isTestingGatewayPing ? 'Testing Link...' : 'Test Gateway Ping'}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
              <button
                type="button"
                onClick={handleResetSensorConfig}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Factory TMDA Calibration</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save & Project Real Results</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MENU 2: CORPORATE BRAND & LOGO */}
      {currentMenu === 'brand' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h5 className="text-base font-bold text-slate-900 font-display">
                Corporate Brand Logo & Visual Identity
              </h5>
              <p className="text-xs text-slate-500">
                Upload custom logo, test vector presets, and adjust live display scaling across all surfaces.
              </p>
            </div>
            {customLogo && (
              <button
                type="button"
                onClick={() => {
                  resetLogo();
                  setLogoSuccessMsg('Restored default logo!');
                  setTimeout(() => setLogoSuccessMsg(null), 3000);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            )}
          </div>

          {logoSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{logoSuccessMsg}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#0F4C81] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-6 h-6 text-[#0F4C81]" />
                <span className="text-xs font-bold text-slate-800">
                  Click to upload custom logo file
                </span>
                <span className="text-[11px] text-slate-500">
                  SVG, PNG, or JPG (transparent recommended, max 3MB)
                </span>
              </div>

              {/* Presets */}
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Quick Vector Presets:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {PRESET_LOGOS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        updateLogo(p.dataUrl);
                        setLogoSuccessMsg(`Applied preset "${p.name}"!`);
                        setTimeout(() => setLogoSuccessMsg(null), 3000);
                      }}
                      className="p-2 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 rounded-xl text-left transition-all cursor-pointer flex flex-col items-center text-center gap-1"
                    >
                      <img src={p.dataUrl} alt={p.name} className="h-6 w-auto object-contain" />
                      <span className="text-[10px] font-semibold text-slate-700 truncate w-full">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scaler */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Logo Display Scaling:
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    {Math.round(logoScale * 100)}%
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { label: 'Normal', value: 1.0 },
                    { label: 'Enlarged', value: 1.15 },
                    { label: 'Large', value: 1.35 },
                    { label: 'Maximum', value: 1.55 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        updateLogoScale(opt.value);
                        setLogoSuccessMsg(`Set scale to ${opt.label} (${Math.round(opt.value * 100)}%)!`);
                        setTimeout(() => setLogoSuccessMsg(null), 2500);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold cursor-pointer text-center ${
                        Math.abs(logoScale - opt.value) < 0.05
                          ? 'bg-[#0F4C81] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Previews */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Live Surface Previews:
              </span>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Light Surface (Navbar / Modals)
                </span>
                <div className="py-3 px-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <BrandLogo size="md" theme="light" />
                  <span className="text-[11px] text-slate-400 font-medium">Top Navigation...</span>
                </div>
              </div>

              <div className="p-4 bg-[#071B2D] rounded-2xl border border-slate-800 text-white shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Dark Surface (Corporate Footer)
                </span>
                <div className="py-3 px-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <BrandLogo size="md" theme="dark" />
                  <span className="text-[10px] text-slate-400 font-medium">Tanzania HQ...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MENU 3: WEBSITE MEDIA SLOTS */}
      {currentMenu === 'media' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h5 className="text-base font-bold text-slate-900 font-display">
                Website Media Slots & Visual Manager
              </h5>
              <p className="text-xs text-slate-500">
                Recharge all visual photography slots with modern architectural and clinical engineering imagery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                rechargeAllImages();
                setLogoSuccessMsg('Recharged all media slots with architectural imagery!');
                setTimeout(() => setLogoSuccessMsg(null), 3000);
              }}
              className="px-4 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>⚡ Recharge All Media</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Landing Page Hero Banner</span>
                <span className="text-[11px] text-slate-500">Architectural Tanzania HQ</span>
              </div>
              <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer">
                Upload Custom
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSlotImageUpload('heroImage', e)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">About Section Team Visual</span>
                <span className="text-[11px] text-slate-500">Collaborative Engineering Office</span>
              </div>
              <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer">
                Upload Custom
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSlotImageUpload('aboutImage', e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* MENU 4: COMPANY & REGIONAL HUBS */}
      {currentMenu === 'company' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h5 className="text-base font-bold text-slate-900 font-display">
              Company Profile, Regional Hubs & Regulatory Accreditations
            </h5>
            <p className="text-xs text-slate-500">
              Official Tanzania corporate registry, TMDA licenses, and engineering dispatch offices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-[#0F4C81]" />
                <span>Headquarters (Arusha)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                AICC Kilimanjaro Hall, Room 341, Arusha, Tanzania<br />
                Direct Biomedical Field Operations & SLA Administration
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Regional Spare Parts Warehouse (Dar es Salaam)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ali Hassan Mwinyi Rd, Kijitonyama, Dar es Salaam<br />
                Central Depot stocking 12,000+ genuine OEM replacement parts
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3 text-xs">
            <span className="font-bold text-[#0F4C81] uppercase tracking-wider block">
              Official Regulatory Accreditations & Licenses:
            </span>
            <div className="grid sm:grid-cols-2 gap-3 text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>TMDA Medical Device License: <strong>#MD-2024-0891</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>BRELA Incorporation Reg: <strong>#482910</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>TBS ISO 13485:2016 Certified Quality Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NeST Government Vendor ID: <strong>#TZ-GOV-NEST-7720</strong></span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Default Clinical Facility Context:</span>
              <span className="text-slate-500">Active hospital viewed on this console</span>
            </div>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 cursor-pointer"
            >
              {DEMO_FACILITIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.region})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* MENU 5: AUTOMATED SMS DISPATCH & EMERGENCY ALERTS */}
      {currentMenu === 'alerts' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h5 className="text-base font-bold text-slate-900 font-display">
                Automated SMS Dispatch & Emergency Rules
              </h5>
              <p className="text-xs text-slate-500">
                Instant SMS routing to on-duty biomedical engineers upon ICU breakdowns and SCADA gas alarm triggers.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Cellular SMS Gateway Active
            </span>
          </div>

          {testSmsStatus === 'delivered' && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Test SMS successfully dispatched and acknowledged via cellular gateway!</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Rule 1: ICU & Theatre Emergency Breakdown</span>
              <p className="text-slate-600 leading-relaxed">
                When a hospital technician logs an emergency ticket, an automated SMS alert is dispatched within 90 seconds with machine serial number and ward room.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                ENABLED · 24/7 AUTO DISPATCH
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Rule 2: SCADA IoT Oxygen & Temp Thresholds</span>
              <p className="text-slate-600 leading-relaxed">
                Automatically alerts the lead biomedical engineer if oxygen pipeline pressure drops below 3.80 bar or vaccine storage rises above 6.0°C.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                ENABLED · ZERO-DELAY DISPATCH
              </span>
            </div>
          </div>

          {/* Recipient Engineers */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              On-Duty Biomedical Engineers Recipient List:
            </span>
            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Eng. Casto Mwita (Lead Systems Engineer)</span>
                  <span className="text-slate-500 font-mono text-[11px]">+255 742 296 631 · Arusha & Northern Zone</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">PRIMARY ON CALL</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Eng. Baraka J. Mwangi (Field Service Lead)</span>
                  <span className="text-slate-500 font-mono text-[11px]">+255 754 112 300 · Dar es Salaam & Coastal Zone</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">STANDBY ROTATION</span>
              </div>
            </div>
          </div>

          {/* Test SMS trigger */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Test Emergency SMS Gateway Handshake</span>
              <span className="text-slate-500">Send simulated dispatch payload to verify carrier API connectivity.</span>
            </div>
            <button
              type="button"
              onClick={handleTestSmsDispatch}
              disabled={testSmsStatus === 'testing'}
              className="px-4 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testSmsStatus === 'testing' ? 'Transmitting...' : 'Send Test Dispatch SMS'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
