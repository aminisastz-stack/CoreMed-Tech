import React, { useState, useRef, useEffect } from 'react';
import { DEMO_TICKETS } from '../data/mockData';
import {
  DEMO_FACILITIES,
  REGISTERED_HOSPITAL_EQUIPMENT,
  CALIBRATION_CERTIFICATES,
  REGIONAL_SPARE_PARTS,
  DEMO_OXYGEN_TELEMETRY,
  DEMO_MRI_TELEMETRY,
  TENDER_DOCUMENTS,
  INITIAL_SMS_LOGS,
  HospitalFacility,
  RegisteredEquipment,
  CalibrationRecord,
  SparePartItem,
  OxygenManifoldTelemetry,
  MriCryogenicTelemetry,
  TenderDocument,
  SmsNotification
} from '../data/portalData';
import { HospitalTicket } from '../types';
import { useBrand, INSPIRATION_IMAGES, CLINICAL_ALT_IMAGES, SiteImages } from '../context/BrandContext';
import { useSensors, SensorGatewayConfig } from '../context/SensorContext';
import { BrandLogo } from './BrandLogo';
import { IoTMonitoringDashboard } from './IoTMonitoringDashboard';
import { PortalSettings } from './PortalSettings';
import { RegisterHospitalModal } from './RegisterHospitalModal';
import { RegisterDeviceModal } from './RegisterDeviceModal';
import { CameraQRScanner } from './CameraQRScanner';
import { databaseService } from '../services/databaseService';
import {
  X,
  LogIn,
  Building,
  Building2,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Download,
  LogOut,
  Calendar,
  Lock,
  User,
  ShieldCheck,
  Settings,
  Upload,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  FileImage,
  Maximize2,
  Minimize2,
  Activity,
  Package,
  FileText,
  Phone,
  Search,
  ChevronRight,
  Clock,
  Plus,
  ExternalLink,
  Printer,
  QrCode,
  Gauge,
  MessageSquare,
  Bell,
  Smartphone,
  Radio,
  FileDown,
  CheckCheck,
  Zap,
  SlidersHorizontal,
  Home,
  Bookmark,
  Share2,
  Filter,
  BarChart3,
  Cpu,
  Wifi,
  WifiOff,
  Database,
  Server,
  Thermometer,
  MapPin,
  Mail,
  Trash2,
  HardDrive
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Crisp Vector SVG Preset Logos for instant one-click branding tests
const PRESET_LOGOS = [
  {
    id: 'caduceus-blue',
    name: 'Clinical Caduceus & Pulse',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" fill="none"><rect width="44" height="44" y="3" rx="10" fill="%230F4C81"/><path d="M12 25h6l4-9 6 18 4-11 3 4h7" stroke="%2310B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><text x="56" y="27" font-family="sans-serif" font-weight="800" font-size="17" fill="%230F4C81">COREMED</text><text x="56" y="41" font-family="sans-serif" font-weight="700" font-size="9.5" fill="%2310B981" letter-spacing="2">BIOMEDICAL</text></svg>`
  },
  {
    id: 'emerald-shield',
    name: 'Emerald Shield & Cross',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" fill="none"><rect width="44" height="44" y="3" rx="10" fill="%2310B981"/><path d="M22 13v24M10 25h24" stroke="white" stroke-width="4.5" stroke-linecap="round"/><text x="56" y="27" font-family="sans-serif" font-weight="800" font-size="17" fill="%230F4C81">COREMED</text><text x="56" y="41" font-family="sans-serif" font-weight="700" font-size="9.5" fill="%230F4C81" letter-spacing="2">TANZANIA</text></svg>`
  },
  {
    id: 'hex-tech',
    name: 'Hex Tech Precision',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" fill="none"><polygon points="22,5 39,15 39,35 22,45 5,35 5,15" fill="%230F4C81" stroke="%2310B981" stroke-width="2.5"/><circle cx="22" cy="25" r="7" fill="%2310B981"/><text x="56" y="27" font-family="sans-serif" font-weight="800" font-size="17" fill="%230F4C81">COREMED</text><text x="56" y="41" font-family="sans-serif" font-weight="700" font-size="9.5" fill="%2310B981" letter-spacing="2">SOLUTIONS</text></svg>`
  },
  {
    id: 'dark-wave',
    name: 'Modern Hospital Monogram',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" fill="none"><rect width="44" height="44" y="3" rx="12" fill="%23071B2D"/><path d="M30 15a11 11 0 1 0 0 20" stroke="%2310B981" stroke-width="4" stroke-linecap="round"/><path d="M19 19v12M25 19v12" stroke="white" stroke-width="2.5" stroke-linecap="round"/><text x="56" y="27" font-family="sans-serif" font-weight="800" font-size="17" fill="%23071B2D">COREMED</text><text x="56" y="41" font-family="sans-serif" font-weight="700" font-size="9.5" fill="%2310B981" letter-spacing="2">ENGINEERING</text></svg>`
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    customLogo,
    logoScale,
    siteImages,
    updateLogo,
    updateLogoScale,
    resetLogo,
    updateSiteImage,
    rechargeAllImages,
    resetAllImages,
  } = useBrand();

  const {
    gatewayConfig,
    updateGatewayConfig,
    resetGatewayConfig,
    testSensorHardwarePing,
    oxygenData,
    temperatureData,
    simulatePressureDrop,
    simulateTemperatureSpike,
    resetSimulationToNominal,
    isLiveStreaming,
    toggleLiveStreaming
  } = useSensors();

  // Sensor Settings state
  const [sensorConfigForm, setSensorConfigForm] = useState<SensorGatewayConfig>(gatewayConfig);
  const [sensorSaveSuccessMsg, setSensorSaveSuccessMsg] = useState<string | null>(null);
  const [isTestingGatewayPing, setIsTestingGatewayPing] = useState(false);
  const [gatewayPingResult, setGatewayPingResult] = useState<{
    success: boolean;
    latencyMs: number;
    rssi: number;
    message: string;
  } | null>(null);

  // Sync sensorConfigForm when gatewayConfig changes
  useEffect(() => {
    setSensorConfigForm(gatewayConfig);
  }, [gatewayConfig]);

  // Settings Classified Submenu State
  // 'sensors' | 'hospitals' | 'database' | 'brand' | 'media' | 'company' | 'alerts'
  const [settingsSubTab, setSettingsSubTab] = useState<
    'sensors' | 'hospitals' | 'database' | 'brand' | 'media' | 'company' | 'alerts'
  >('sensors');
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');
  const [testSmsStatus, setTestSmsStatus] = useState<string | null>(null);

  // Fullscreen vs Centered App Mode
  const [isPortalFullscreen, setIsPortalFullscreen] = useState(true);

  // Active App Navigation Tab
  // 'home' | 'assets' | 'telemetry' | 'scanner' | 'tickets' | 'documents' | 'settings'
  const [activeTab, setActiveTab] = useState<'home' | 'assets' | 'telemetry' | 'scanner' | 'tickets' | 'documents' | 'settings'>('home');

  // Authentication State
  const [role, setRole] = useState<'hospital' | 'engineer'>('hospital');
  const [email, setEmail] = useState('j.mlay@mnh.or.tz');
  const [password, setPassword] = useState('MuhimbiliBioMed2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{
    name: string;
    facility: string;
    facilityId: string;
    roleName: string;
    isStaff: boolean;
  } | null>(null);

  // Facilities & Multi-Hospital Management (Database backed)
  const [facilitiesList, setFacilitiesList] = useState<HospitalFacility[]>(() => databaseService.getFacilities());
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('fac-mnh');

  // Registration Modals State
  const [isRegisterHospitalOpen, setIsRegisterHospitalOpen] = useState(false);
  const [isRegisterDeviceOpen, setIsRegisterDeviceOpen] = useState(false);
  const [deviceTargetFacilityId, setDeviceTargetFacilityId] = useState<string>('fac-mnh');
  const [assetHospitalScope, setAssetHospitalScope] = useState<'current' | 'all'>('current');

  // Interactive Data Collections (Database backed)
  const [equipmentList, setEquipmentList] = useState<RegisteredEquipment[]>(() => databaseService.getEquipment());
  const [ticketsList, setTicketsList] = useState<HospitalTicket[]>(() => databaseService.getTickets());
  const [certificatesList] = useState<CalibrationRecord[]>(CALIBRATION_CERTIFICATES);
  const [sparePartsList, setSparePartsList] = useState<SparePartItem[]>(REGIONAL_SPARE_PARTS);
  const [tenderDocsList] = useState<TenderDocument[]>(TENDER_DOCUMENTS);
  const [smsLogs, setSmsLogs] = useState<SmsNotification[]>(() => databaseService.getSmsLogs());

  // Live Telemetry States with simulated dynamic refresh
  const [oxygenTelemetry, setOxygenTelemetry] = useState<OxygenManifoldTelemetry>(DEMO_OXYGEN_TELEMETRY);
  const [mriTelemetry, setMriTelemetry] = useState<MriCryogenicTelemetry>(DEMO_MRI_TELEMETRY);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState(false);

  // QR / Barcode Scanner Simulator State
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scannedAssetPassport, setScannedAssetPassport] = useState<RegisteredEquipment | null>(null);
  const [manualBarcodeScanInput, setManualBarcodeScanInput] = useState('');

  // New Ticket Form State
  const [newTicketFormOpen, setNewTicketFormOpen] = useState(false);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newDepartment, setNewDepartment] = useState('Radiology & Imaging');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'Emergency' | 'High' | 'Scheduled'>('Emergency');

  // Document Viewer Modal State
  const [selectedDoc, setSelectedDoc] = useState<TenderDocument | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CalibrationRecord | null>(null);

  // SMS Notification Toast Preview
  const [activeSmsToast, setActiveSmsToast] = useState<SmsNotification | null>(null);

  // Feedback Messages
  const [logoSuccessMsg, setLogoSuccessMsg] = useState<string | null>(null);
  const [imageSuccessMsg, setImageSuccessMsg] = useState<string | null>(null);
  const [sparesOrderSuccess, setSparesOrderSuccess] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('All');

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Periodic Telemetry Fluctuation Simulator (Realistic IoT micro-variations)
  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;

    const interval = setInterval(() => {
      setOxygenTelemetry((prev) => ({
        ...prev,
        linePressureBar: Number((4.18 + (Math.random() * 0.04 - 0.02)).toFixed(2)),
        purityPercentage: Number((94.8 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        flowRateLpm: Number((340 + (Math.random() * 10 - 5)).toFixed(1)),
        lastTelemetryPing: `Live · ${new Date().toLocaleTimeString()} (IoT Gateway)`,
      }));

      setMriTelemetry((prev) => ({
        ...prev,
        cryostatTempKelvin: Number((4.18 + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        heliumLevelPercentage: Number((98.4 + (Math.random() * 0.1 - 0.05)).toFixed(1)),
        lastTelemetryPing: `Live · ${new Date().toLocaleTimeString()} (Cryo SCADA)`,
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, isLoggedIn]);

  // Handle Sensor Gateway Ping Test
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

  // Handle Save Sensor Gateway Config
  const handleSaveSensorGatewayConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateGatewayConfig(sensorConfigForm);
    setSensorSaveSuccessMsg('Hardware sensor gateway parameters & calibration offsets saved! Real results are now active in the IoT Monitoring Dashboard.');
    setTimeout(() => setSensorSaveSuccessMsg(null), 4000);
  };

  // Handle Reset Sensor Gateway Config
  const handleResetSensorGatewayConfig = () => {
    resetGatewayConfig();
    setSensorConfigForm(gatewayConfig);
    setSensorSaveSuccessMsg('Sensor gateway restored to factory TMDA calibration defaults.');
    setTimeout(() => setSensorSaveSuccessMsg(null), 3000);
  };

  // Test SMS Dispatch Simulator Handler
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
        messageBody: `[TEST SCADA ALERT] CoreMed Telemetry: Gateway CMT-GW-DAR-KJT-01 handshake test successful. All clinical sensors nominal.`,
        timestamp: 'Just now',
        deliveryStatus: 'Delivered (Handset ACK)',
      };
      setSmsLogs((prev) => [testMsg, ...prev]);
      setTestSmsStatus('delivered');
      setTimeout(() => setTestSmsStatus(null), 4000);
    }, 1000);
  };

  if (!isOpen) return null;

  // Active facility data from persistent facilities list
  const currentFacility = facilitiesList.find((f) => f.id === selectedFacilityId) || facilitiesList[0] || DEMO_FACILITIES[0];

  // Refresh all state from local/remote database
  const handleRefreshData = () => {
    setFacilitiesList(databaseService.getFacilities());
    setEquipmentList(databaseService.getEquipment());
    setTicketsList(databaseService.getTickets());
    setSmsLogs(databaseService.getSmsLogs());
  };

  // Register New Hospital Handler
  const handleRegisterHospital = (newFacility: HospitalFacility) => {
    const created = databaseService.addFacility(newFacility);
    const updated = databaseService.getFacilities();
    setFacilitiesList(updated);
    setSelectedFacilityId(created.id);
    setImageSuccessMsg(`Hospital "${created.name}" registered & active in network!`);
    setTimeout(() => setImageSuccessMsg(null), 5000);
  };

  // Register New Device Handler (allows adding various devices to the same hospital)
  const handleRegisterDevice = (newDevice: RegisteredEquipment) => {
    const created = databaseService.addEquipment(newDevice);
    setEquipmentList(databaseService.getEquipment());
    setFacilitiesList(databaseService.getFacilities());
    setScannedAssetPassport(created);
    setImageSuccessMsg(`Device "${created.name}" assigned to hospital & QR Tag generated!`);
    setTimeout(() => setImageSuccessMsg(null), 5000);
  };

  // Delete / Decommission Device Handler
  const handleDeleteDevice = (deviceId: string, deviceName: string) => {
    if (window.confirm(`Are you sure you want to decommission / remove device "${deviceName}"?`)) {
      databaseService.deleteEquipment(deviceId);
      setEquipmentList(databaseService.getEquipment());
      setFacilitiesList(databaseService.getFacilities());
      if (scannedAssetPassport?.id === deviceId) {
        setScannedAssetPassport(null);
      }
      setImageSuccessMsg(`Device "${deviceName}" removed from hospital registry.`);
      setTimeout(() => setImageSuccessMsg(null), 3500);
    }
  };

  // Quick Demo Login Handler
  const handleQuickLogin = (demoRole: 'mnh' | 'kcmc' | 'staff') => {
    if (demoRole === 'mnh') {
      setIsLoggedIn(true);
      setSelectedFacilityId('fac-mnh');
      setLoggedInUser({
        name: 'Dr. John R. Mlay',
        facility: 'Muhimbili National Hospital (MNH)',
        facilityId: 'fac-mnh',
        roleName: 'Clinical Director & Lead Biomedical',
        isStaff: false,
      });
      setActiveTab('home');
    } else if (demoRole === 'kcmc') {
      setIsLoggedIn(true);
      setSelectedFacilityId('fac-kcmc');
      setLoggedInUser({
        name: 'Eng. Baraka J. Mwangi',
        facility: 'Kilimanjaro Christian Medical Centre (KCMC)',
        facilityId: 'fac-kcmc',
        roleName: 'Head of Biomedical Engineering',
        isStaff: false,
      });
      setActiveTab('home');
    } else {
      setIsLoggedIn(true);
      setSelectedFacilityId('fac-mnh');
      setLoggedInUser({
        name: 'Eng. Casto Mwita',
        facility: 'CoreMed Tech Tanzania HQ (Arusha / Dar)',
        facilityId: 'fac-mnh',
        roleName: 'Lead Systems Engineer & Administrator',
        isStaff: true,
      });
      setActiveTab('settings');
    }
  };

  // Form Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    if (role === 'engineer') {
      setLoggedInUser({
        name: 'Eng. Casto Mwita',
        facility: 'CoreMed Tech Tanzania HQ (Arusha / Dar)',
        facilityId: 'fac-mnh',
        roleName: 'Lead Field Engineer & Staff Administrator',
        isStaff: true,
      });
      setActiveTab('settings');
    } else {
      setLoggedInUser({
        name: 'Hospital Biomedical Representative',
        facility: currentFacility.name,
        facilityId: currentFacility.id,
        roleName: 'Clinical Engineering Lead',
        isStaff: false,
      });
      setActiveTab('home');
    }
  };

  // Handle New Ticket Creation WITH AUTOMATED SMS DISPATCH
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipmentName.trim() || !newIssueDesc.trim()) return;

    const newTicketId = `CMT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const facilityName = loggedInUser?.facility || currentFacility.name;

    const newTicket: HospitalTicket = {
      ticketId: newTicketId,
      hospitalName: facilityName,
      department: newDepartment,
      equipmentName: newEquipmentName,
      issueDescription: newIssueDesc,
      priority: newPriority,
      status: 'Dispatched',
      assignedEngineer: 'Eng. Kelvin Lyimo (Fast Dispatch Team)',
      dateReported: new Date().toISOString().split('T')[0] + ' (Just now)',
      estimatedArrival: 'Dispatched · ETA 40 Mins',
    };

    setTicketsList([newTicket, ...ticketsList]);

    // AUTOMATED SMS DISPATCH TRIGGER
    const automatedSms: SmsNotification = {
      id: `SMS-${Date.now()}`,
      ticketId: newTicketId,
      recipientName: 'Eng. Kelvin Lyimo (On-Duty Engineer)',
      recipientPhone: '+255 742 296 631',
      recipientRole: 'Zonal Emergency Response Engineer',
      carrier: 'Vodacom Tanzania',
      messageBody: `🚨 [CoreMed Emergency Dispatch]: Breakdown incident logged at ${facilityName} (${newEquipmentName}, Dept: ${newDepartment}). Priority: ${newPriority}. You have been assigned. ETA: 40 min. Work Order #${newTicketId}.`,
      timestamp: 'Just now (Automated SMS Gateway)',
      deliveryStatus: 'Delivered (Handset ACK)',
    };

    setSmsLogs([automatedSms, ...smsLogs]);
    setActiveSmsToast(automatedSms);
    setTimeout(() => setActiveSmsToast(null), 6000);

    setNewEquipmentName('');
    setNewIssueDesc('');
    setNewTicketFormOpen(false);
    setActiveTab('tickets');
    setImageSuccessMsg(`Dispatched emergency work order ${newTicketId}! Automated SMS notification delivered to field engineer.`);
    setTimeout(() => setImageSuccessMsg(null), 5000);
  };

  // QR Barcode Scanner Simulation Handler
  const handleSimulateScan = (tagOrSerial: string) => {
    setIsScanningActive(true);
    setTimeout(() => {
      setIsScanningActive(false);
      const matched = equipmentList.find(
        (eq) =>
          eq.qrCodeTag.toLowerCase() === tagOrSerial.toLowerCase() ||
          eq.serialNumber.toLowerCase() === tagOrSerial.toLowerCase() ||
          eq.id.toLowerCase() === tagOrSerial.toLowerCase()
      );
      if (matched) {
        setScannedAssetPassport(matched);
      } else {
        // Fallback to first machine for demonstration
        setScannedAssetPassport(equipmentList[0]);
      }
    }, 800);
  };

  // Upload custom logo image handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Please choose an image under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateLogo(event.target.result as string);
          setLogoSuccessMsg('Custom logo uploaded & propagated system-wide!');
          setTimeout(() => setLogoSuccessMsg(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload slot image handler
  const handleSlotImageUpload = (slot: keyof SiteImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSiteImage(slot, event.target.result as string);
          setImageSuccessMsg(`Updated ${slot} across website!`);
          setTimeout(() => setImageSuccessMsg(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Master recharge handler
  const handleRechargeAll = () => {
    rechargeAllImages();
    setImageSuccessMsg('Recharged all website images with inspiration photos!');
    setTimeout(() => setImageSuccessMsg(null), 4000);
  };

  // Filtered equipment (supports multi-device filtering by hospital or all facilities)
  const filteredEquipment = equipmentList.filter((item) => {
    const matchesHospital =
      assetHospitalScope === 'all' || item.facilityId === selectedFacilityId;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.qrCodeTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.department.includes(deptFilter);
    return matchesHospital && matchesSearch && matchesDept;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-slate-50 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isPortalFullscreen
            ? 'w-full h-full h-[100dvh] rounded-none'
            : 'max-w-6xl w-full h-[94vh] rounded-3xl border border-slate-200/80'
        }`}
      >
        {/* Modern App Top Bar */}
        <header className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#0F4C81] via-[#0D416F] to-[#0A3357] text-white flex items-center justify-between shrink-0 shadow-md border-b border-white/10 z-20">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 rounded-xl px-2.5 py-1.5 shadow-xs flex items-center justify-center shrink-0">
              <BrandLogo size="sm" theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold font-display text-white tracking-tight flex items-center gap-1.5">
                  <span>CoreMed Biomedical OS</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    v2.6 Enterprise
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-slate-200 hidden sm:block">
                Hospital Asset Uptime · IoT Telemetry · NeST & TMDA Compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Emergency Call Button */}
            <a
              href="tel:+255742296631"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Phone className="w-3 h-3 text-white" />
              <span>Hotline: +255 742 296 631</span>
            </a>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsPortalFullscreen(!isPortalFullscreen)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title={isPortalFullscreen ? 'Restore Windowed View' : 'Expand to Fullscreen App'}
            >
              {isPortalFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isPortalFullscreen ? 'Restore' : 'Fullscreen'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Live Automated SMS Notification Toast Banner */}
        {activeSmsToast && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 flex items-center justify-between text-xs shadow-md animate-in slide-in-from-top duration-300 z-30 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="truncate">
                <div className="font-bold flex items-center gap-2 text-white">
                  <span>Automated SMS Delivered via {activeSmsToast.carrier}</span>
                  <span className="text-[10px] text-emerald-200 bg-white/10 px-1.5 rounded">ACK Received</span>
                </div>
                <p className="text-[11px] text-emerald-100 truncate">{activeSmsToast.messageBody}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveSmsToast(null)}
              className="p-1 text-emerald-200 hover:text-white shrink-0 ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* IF NOT LOGGED IN: Modern App Login Screen (Inspired by Login screen in user's image) */}
        {!isLoggedIn ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-radial from-slate-100 to-slate-200">
            <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              {/* App Welcome Badge */}
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#10B981] mx-auto flex items-center justify-center shadow-lg text-white mb-2">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">Welcome Back</h3>
                <p className="text-xs text-slate-500">
                  Access Tanzania's clinical engineering dashboard, hospital telemetry & SLA dispatch.
                </p>
              </div>

              {/* Role Toggle Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setRole('hospital');
                    setEmail('j.mlay@mnh.or.tz');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    role === 'hospital'
                      ? 'bg-white text-[#0F4C81] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hospital Partner</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('engineer');
                    setEmail('c.mwita@coremedtech.co.tz');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    role === 'engineer'
                      ? 'bg-white text-[#0F4C81] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                  <span>BioMed Engineer</span>
                </button>
              </div>

              {/* 1-Click Fast Demo Logins */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                  ⚡ 1-Click Demo Profiles:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('mnh')}
                    className="p-2 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-slate-900 block truncate">🏥 Muhimbili</span>
                    <span className="text-[9px] text-emerald-700 block truncate font-medium">Tier 1 National</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('kcmc')}
                    className="p-2 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-slate-900 block truncate">🏥 KCMC Moshi</span>
                    <span className="text-[9px] text-emerald-700 block truncate font-medium">Zonal Referral</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('staff')}
                    className="p-2 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0F4C81] rounded-xl transition-all cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-[#0F4C81] block truncate">⚙️ Engineer</span>
                    <span className="text-[9px] text-slate-500 block truncate font-medium">Full Admin</span>
                  </button>
                </div>
              </div>

              {/* Standard Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hospital Portal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remember session</span>
                  </label>
                  <a href="#contact" onClick={onClose} className="text-[#0F4C81] hover:underline font-semibold">
                    Get support
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#0F4C81] to-[#0A3357] hover:opacity-95 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Enter Clinical Portal</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* IF LOGGED IN: Modern App Viewport with Bottom/Top Navigation */
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* App Greeting & Hospital Header Banner (Inspired by "Hi, James!" screen) */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#071B2D] text-white p-4 sm:px-6 sm:py-5 shadow-sm shrink-0">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                    {loggedInUser?.isStaff ? 'CM' : 'MH'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold font-display text-white">
                        Habari, {loggedInUser?.name}
                      </h2>
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <select
                        value={selectedFacilityId}
                        onChange={(e) => setSelectedFacilityId(e.target.value)}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-0.5 rounded-lg border border-white/20 text-xs focus:outline-none cursor-pointer"
                      >
                        {facilitiesList.map((fac) => (
                          <option key={fac.id} value={fac.id} className="text-slate-900 bg-white">
                            {fac.name} ({fac.region}) · {fac.activeEquipmentCount} eq
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsRegisterHospitalOpen(true)}
                        className="px-2 py-0.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold rounded-lg border border-white/20 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                        title="Register a new hospital to CoreMed network"
                      >
                        <Plus className="w-3 h-3 text-emerald-300" />
                        <span>+ Hospital</span>
                      </button>
                      <span className="hidden sm:inline">·</span>
                      <span className="text-emerald-300 font-semibold hidden sm:inline">{currentFacility.slaTier}</span>
                    </div>
                  </div>
                </div>

                {/* Quick App Actions in Header */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeviceTargetFacilityId(selectedFacilityId);
                      setIsRegisterDeviceOpen(true);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Add another medical device to this hospital"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTicketFormOpen(true);
                      setActiveTab('tickets');
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Log Breakdown SLA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateScan('SN-RES-948102')}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-emerald-300" />
                    <span>Scan QR Tag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-white text-[#0F4C81]'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white'
                    }`}
                    title="Staff & IoT Calibration Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoggedIn(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Main App Viewport */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-20 sm:pb-8">
              {/* TAB 1: MODERN APP DASHBOARD / HOME (Like "Hi, James!" Screen) */}
              {activeTab === 'home' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Emergency Incident Alert Banner */}
                  <div className="p-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">24/7 Emergency Biomedical Dispatch Active</h4>
                        <p className="text-xs text-red-100">
                          Rapid response engineers on standby in Dar es Salaam & Arusha hubs. SLA guaranteed under 4 hrs.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTicketFormOpen(true);
                        setActiveTab('tickets');
                      }}
                      className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      Report Breakdown Now
                    </button>
                  </div>

                  {/* Quick Clinical Network & Facilities Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Network</span>
                        <Building2 className="w-4 h-4 text-[#0F4C81]" />
                      </div>
                      <div className="my-1.5">
                        <span className="text-xl font-bold font-mono text-slate-900">{facilitiesList.length}</span>
                        <span className="text-[10px] text-slate-500 block truncate">Accredited Hospitals</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsRegisterHospitalOpen(true)}
                        className="text-[11px] font-bold text-[#0F4C81] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Register Hospital</span>
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hospital Devices</span>
                        <Cpu className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="my-1.5">
                        <span className="text-xl font-bold font-mono text-emerald-700">
                          {equipmentList.filter((e) => e.facilityId === selectedFacilityId).length}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          In {currentFacility.name.split(' ')[0]}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDeviceTargetFacilityId(selectedFacilityId);
                          setIsRegisterDeviceOpen(true);
                        }}
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Device</span>
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA Work Orders</span>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="my-1.5">
                        <span className="text-xl font-bold font-mono text-slate-900">{ticketsList.length}</span>
                        <span className="text-[10px] text-slate-500 block truncate">Dispatched / En Route</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('tickets')}
                        className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>SLA Orders</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database DB</span>
                        <Database className="w-4 h-4 text-[#0F4C81]" />
                      </div>
                      <div className="my-1.5">
                        <span className="text-xl font-bold font-mono text-[#0F4C81]">
                          {facilitiesList.length + equipmentList.length}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">Synced DB Entities</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsSubTab('database');
                          setActiveTab('settings');
                        }}
                        className="text-[11px] font-bold text-[#0F4C81] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HardDrive className="w-3 h-3" />
                        <span>Database Sync</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-Time Telemetry Quick Snapshot (Live Oxygen & MRI) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#0F4C81]" />
                        <span>Live Hospital Telemetry & IoT Feeds</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('telemetry')}
                        className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1"
                      >
                        <span>Full Telemetry Console</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Oxygen Plant Card */}
                      <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <Gauge className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">Hospital Medical Gas Pipeline (MGPS)</h4>
                              <p className="text-[10px] text-slate-500">{oxygenTelemetry.lastTelemetryPing}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {oxygenTelemetry.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2.5 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] text-slate-500 uppercase block font-medium">Line Pressure</span>
                            <span className="text-base font-bold font-mono text-[#0F4C81] tabular-nums mt-0.5 block">
                              {oxygenTelemetry.linePressureBar} bar
                            </span>
                            <span className="text-[9px] text-slate-400">Target: 4.20 bar</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] text-slate-500 uppercase block font-medium">O2 Purity</span>
                            <span className="text-base font-bold font-mono text-emerald-600 tabular-nums mt-0.5 block">
                              {oxygenTelemetry.purityPercentage}%
                            </span>
                            <span className="text-[9px] text-slate-400">ISO 7396-1</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] text-slate-500 uppercase block font-medium">Active Source</span>
                            <span className="text-xs font-bold text-slate-800 truncate mt-1 block">
                              {oxygenTelemetry.activeBank.split(' ')[0]}
                            </span>
                            <span className="text-[9px] text-slate-400">{oxygenTelemetry.bankAPressureBar} bar</span>
                          </div>
                        </div>
                      </div>

                      {/* MRI Cryogenics Card */}
                      <div className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0F4C81] flex items-center justify-center">
                              <Radio className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">Siemens 1.5T MRI Cryogenic System</h4>
                              <p className="text-[10px] text-slate-500">{mriTelemetry.lastTelemetryPing}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            {mriTelemetry.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2.5 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] text-slate-500 uppercase block font-medium">Liquid Helium</span>
                            <span className="text-base font-bold font-mono text-[#0F4C81] tabular-nums mt-0.5 block">
                              {mriTelemetry.heliumLevelPercentage}%
                            </span>
                            <span className="text-[9px] text-slate-400">Safe Level</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] text-slate-500 uppercase block font-medium">Cryo Temp</span>
                            <span className="text-base font-bold font-mono text-emerald-600 tabular-nums mt-0.5 block">
                              {mriTelemetry.cryostatTempKelvin} K
                            </span>
                            <span className="text-[9px] text-slate-400">-268.97 °C</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] text-slate-500 uppercase block font-medium">RF Shielding</span>
                            <span className="text-base font-bold font-mono text-slate-800 tabular-nums mt-0.5 block">
                              {mriTelemetry.rfShieldAttenuationDb} dB
                            </span>
                            <span className="text-[9px] text-slate-400">&gt; 90 dB Pass</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Equipment Grid (Like Hotel Cards in Shared Screen) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        Installed Equipment & Digital Passports
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('assets')}
                        className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1"
                      >
                        <span>See All {equipmentList.length} Units</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {equipmentList.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  {item.department}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  item.operationalStatus === 'Operational'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {item.operationalStatus}
                              </span>
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-2xl text-[11px] font-mono space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Serial No:</span>
                                <span className="text-slate-800 font-semibold">{item.serialNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">QR Asset Tag:</span>
                                <span className="text-[#0F4C81] font-semibold">{item.qrCodeTag}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Uptime:</span>
                                <span className="text-emerald-700 font-bold">{item.uptimePercentage}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setScannedAssetPassport(item);
                                setActiveTab('scanner');
                              }}
                              className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View Passport</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNewEquipmentName(item.name);
                                setNewDepartment(item.department);
                                setNewTicketFormOpen(true);
                                setActiveTab('tickets');
                              }}
                              className="px-2.5 py-1 bg-[#0F4C81] text-white hover:bg-[#0B3961] rounded-xl text-xs font-semibold shadow-2xs"
                            >
                              Report Fault
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EQUIPMENT ASSETS & DIGITAL SERVICE PASSPORTS */}
              {activeTab === 'assets' && (
                <div className="max-w-6xl mx-auto space-y-4">
                  {/* Hospital Equipment Commissioning & Action Header */}
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 font-display">
                          Hospital Medical Equipment Inventory & Digital Passports
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {equipmentList.length} Total Devices
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Active hospital: <strong>{currentFacility.name}</strong> ({currentFacility.region}) · You can add various devices to this hospital or register a new hospital.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDeviceTargetFacilityId(selectedFacilityId);
                          setIsRegisterDeviceOpen(true);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Add a new device to this specific hospital"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Register Device to Hospital</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsRegisterHospitalOpen(true)}
                        className="px-3.5 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Register a new hospital to CoreMed network"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>+ Register New Hospital</span>
                      </button>
                    </div>
                  </div>

                  {/* Hospital Scope Filter & Search */}
                  <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Scope toggle */}
                    <div className="flex items-center p-1 bg-slate-100 rounded-2xl gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setAssetHospitalScope('current')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          assetHospitalScope === 'current'
                            ? 'bg-white text-[#0F4C81] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>{currentFacility.name.split(' ')[0]} ({equipmentList.filter(e => e.facilityId === selectedFacilityId).length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssetHospitalScope('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          assetHospitalScope === 'all'
                            ? 'bg-white text-[#0F4C81] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>All Facilities ({equipmentList.length})</span>
                      </button>
                    </div>

                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by equipment model, serial number, or QR tag..."
                        className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Departments</option>
                        <option value="Radiology">Radiology & Imaging</option>
                        <option value="ICU">Intensive Care (ICU)</option>
                        <option value="Theatre">Operating Theatre</option>
                        <option value="Sterilization">CSSD Sterilization</option>
                        <option value="Plant">Central Plant / MGPS</option>
                        <option value="Laboratory">Laboratory & Pathology</option>
                      </select>
                    </div>
                  </div>

                  {/* Asset Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEquipment.map((eq) => {
                      const facilityObj = facilitiesList.find((f) => f.id === eq.facilityId);
                      return (
                        <div
                          key={eq.id}
                          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-3 flex flex-col justify-between hover:border-[#0F4C81]/30 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {eq.department}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  eq.operationalStatus === 'Operational'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {eq.operationalStatus}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 leading-snug">{eq.name}</h4>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>{eq.manufacturer} · {eq.model}</span>
                              {facilityObj && (
                                <span className="font-semibold text-[#0F4C81] bg-blue-50 px-1.5 py-0.2 rounded text-[10px]">
                                  🏥 {facilityObj.name.split(' ')[0]}
                                </span>
                              )}
                            </div>

                            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] font-mono space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Serial No:</span>
                                <span className="text-slate-800 font-semibold">{eq.serialNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">QR Asset Tag:</span>
                                <span className="text-[#0F4C81] font-semibold">{eq.qrCodeTag}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Next Cal Due:</span>
                                <span className="text-slate-800 font-semibold">{eq.nextCalibrationDue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Uptime:</span>
                                <span className="text-emerald-700 font-bold">{eq.uptimePercentage}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                setScannedAssetPassport(eq);
                                setActiveTab('scanner');
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F4C81] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Digital Passport</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setNewEquipmentName(eq.name);
                                  setNewDepartment(eq.department);
                                  setNewTicketFormOpen(true);
                                  setActiveTab('tickets');
                                }}
                                className="px-3 py-1.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                              >
                                Dispatch SLA
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteDevice(eq.id, eq.name)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Decommission device"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: REAL-TIME TELEMETRY & IOT SENSOR FEEDS (SCADA O2 & Temperature Monitor) */}
              {activeTab === 'telemetry' && (
                <div className="max-w-6xl mx-auto">
                  <IoTMonitoringDashboard
                    onNavigateToSettings={() => {
                      setSettingsSubTab('sensors');
                      setActiveTab('settings');
                    }}
                    selectedFacilityName={currentFacility.name}
                  />
                </div>
              )}

              {/* TAB 4: QR & BARCODE SCANNER (Live Hardware Camera & WebRTC Scanner) */}
              {activeTab === 'scanner' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Real Live Camera Video QR & Barcode Scanner */}
                  <CameraQRScanner
                    equipmentList={equipmentList}
                    onAssetScanned={(eq) => setScannedAssetPassport(eq)}
                    activeHospitalName={currentFacility.name}
                  />

                  {/* Scanned Machine Service Passport (Digital Boarding Pass Style from Shared Screen!) */}
                  {scannedAssetPassport && (
                    <div className="p-6 bg-white rounded-3xl border-2 border-[#0F4C81] shadow-lg space-y-5 animate-in slide-in-from-bottom duration-300">
                      {/* Ticket / Passport Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Activity className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              Verified Asset Service Passport
                            </span>
                            <h3 className="text-base font-bold text-slate-900 font-display">
                              {scannedAssetPassport.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {scannedAssetPassport.manufacturer} · {scannedAssetPassport.model}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full self-start">
                          Status: {scannedAssetPassport.operationalStatus}
                        </span>
                      </div>

                      {/* Key Technical Specs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase block">Serial Number</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{scannedAssetPassport.serialNumber}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase block">QR Asset Tag</span>
                          <span className="font-bold text-[#0F4C81] mt-0.5 block">{scannedAssetPassport.qrCodeTag}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase block">Next Calibration</span>
                          <span className="font-bold text-emerald-700 mt-0.5 block">{scannedAssetPassport.nextCalibrationDue}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase block">Uptime Score</span>
                          <span className="font-bold text-emerald-700 mt-0.5 block">{scannedAssetPassport.uptimePercentage}%</span>
                        </div>
                      </div>

                      {/* Last Service Notes */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                        <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                          Biomedical Engineering Service Log:
                        </span>
                        <p className="text-slate-600 leading-relaxed">{scannedAssetPassport.lastServiceNotes}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Power: {scannedAssetPassport.powerRequirements}</p>
                      </div>

                      {/* Barcode Strip (Inspired by Boarding Pass in user's image) */}
                      <div className="pt-3 border-t border-dashed border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          {/* Simulated CSS Barcode Pattern */}
                          <div className="h-10 w-48 bg-repeat-x flex items-center gap-1 opacity-80">
                            {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 3, 2, 5, 2, 1, 3, 4, 2].map((w, idx) => (
                              <div key={idx} className="h-full bg-slate-900" style={{ width: `${w * 2}px` }}></div>
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 tracking-widest block">
                            *{scannedAssetPassport.serialNumber}*
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Asset Tag Sticker</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewEquipmentName(scannedAssetPassport.name);
                              setNewDepartment(scannedAssetPassport.department);
                              setNewTicketFormOpen(true);
                              setActiveTab('tickets');
                            }}
                            className="px-4 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            Dispatch Incident
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SLA WORK ORDERS & AUTOMATED SMS NOTIFICATIONS */}
              {activeTab === 'tickets' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Top Header */}
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        SLA Emergency Dispatch & Incident Center
                      </h4>
                      <p className="text-xs text-slate-500">
                        Submitting an incident triggers instantaneous SMS dispatch alerts to on-duty biomedical engineers.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNewTicketFormOpen(!newTicketFormOpen)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Breakdown (Triggers SMS)</span>
                    </button>
                  </div>

                  {/* New Ticket Form with SMS Dispatch Mechanism */}
                  {newTicketFormOpen && (
                    <form onSubmit={handleCreateTicket} className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl space-y-4 shadow-sm animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-700" />
                          <span>Emergency Dispatch SLA Form (Automated SMS Push)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewTicketFormOpen(false)}
                          className="text-xs text-emerald-800 font-bold hover:underline"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Equipment / Machine
                          </label>
                          <input
                            type="text"
                            required
                            value={newEquipmentName}
                            onChange={(e) => setNewEquipmentName(e.target.value)}
                            placeholder="e.g. Siemens MRI, Mindray Ultrasound, Autoclave"
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Hospital Department
                          </label>
                          <select
                            value={newDepartment}
                            onChange={(e) => setNewDepartment(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                          >
                            <option value="Radiology & Imaging">Radiology & Imaging</option>
                            <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                            <option value="Main Operating Theatre">Main Operating Theatre</option>
                            <option value="Central Sterilization (CSSD)">Central Sterilization (CSSD)</option>
                            <option value="Laboratory Diagnostic">Laboratory Diagnostic</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Priority Level
                          </label>
                          <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as any)}
                            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer font-bold text-red-700"
                          >
                            <option value="Emergency">🚨 Emergency (Immediate Dispatch)</option>
                            <option value="High">⚠️ High (Within 4 Hours)</option>
                            <option value="Scheduled">📅 Scheduled Maintenance</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Fault Description / Error Code
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={newIssueDesc}
                          onChange={(e) => setNewIssueDesc(e.target.value)}
                          placeholder="Describe specific symptoms (e.g. pressure vacuum leak, probe recognition failure, helium pressure alert)..."
                          className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                        ></textarea>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                          <span>Will trigger immediate Vodacom / Airtel SMS gateway alert.</span>
                        </span>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          Dispatch Work Order & Trigger SMS
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Live SMS Dispatch Feed Box */}
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#0F4C81]" />
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Automated SMS Dispatch Feed (Tanzania National Gateways)
                        </h5>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Gateway: Live Online</span>
                    </div>

                    <div className="space-y-2">
                      {smsLogs.map((sms) => (
                        <div
                          key={sms.id}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F4C81]">{sms.recipientName}</span>
                              <span className="text-slate-400 font-mono">({sms.recipientPhone})</span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {sms.carrier}
                              </span>
                            </div>
                            <p className="text-slate-700 leading-snug">{sms.messageBody}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-slate-400 block">{sms.timestamp}</span>
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 sm:justify-end">
                              <CheckCheck className="w-3 h-3" />
                              <span>{sms.deliveryStatus}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Incident Tickets List */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Active Hospital Work Orders ({ticketsList.length}):
                    </h5>

                    {ticketsList.map((t) => (
                      <div
                        key={t.ticketId}
                        className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3 hover:border-slate-300 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#0F4C81] bg-slate-100 px-2 py-0.5 rounded-lg">
                              {t.ticketId}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                t.priority === 'Emergency'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : t.priority === 'High'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {t.priority}
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-600 font-medium">{t.department}</span>
                          </div>
                          <span className="text-xs font-mono tabular-nums text-slate-500">{t.dateReported}</span>
                        </div>

                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{t.equipmentName}</h5>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.issueDescription}</p>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-slate-700">{t.assignedEngineer}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-emerald-700 font-medium">{t.estimatedArrival}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href="tel:+255742296631"
                              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Call Assigned Engineer</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CONTRACT & NeST TENDER DOCUMENT REPOSITORY */}
              {activeTab === 'documents' && (
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        Official NeST Tender & Regulatory Document Repository
                      </h4>
                      <p className="text-xs text-slate-500">
                        Download verified digital certificates for hospital audits, e-procurement (NeST), and TMDA compliance.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>All 5 Documents Valid & Verified</span>
                      </span>
                    </div>
                  </div>

                  {/* Document Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tenderDocsList.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {doc.category}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {doc.securityClassification}
                            </span>
                          </div>

                          <h5 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed">{doc.description}</p>

                          <div className="p-3 bg-slate-50 rounded-2xl text-[11px] font-mono space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Doc Reference:</span>
                              <span className="text-[#0F4C81] font-semibold">{doc.documentNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Issuer:</span>
                              <span className="text-slate-800 font-semibold">{doc.issuedBy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Validity:</span>
                              <span className="text-emerald-700 font-semibold">Valid until {doc.expiryDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Preview Document</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert(`Downloading verified PDF: ${doc.title} (${doc.fileSize})`)}
                            className="px-3.5 py-1.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: CLASSIFIED SYSTEM & CLINICAL SETTINGS */}
              {activeTab === 'settings' && (
                <PortalSettings
                  onNavigateToTelemetry={() => setActiveTab('telemetry')}
                  currentFacility={currentFacility}
                  facilities={facilitiesList}
                  smsLogs={smsLogs}
                  setSmsLogs={setSmsLogs}
                  selectedFacilityId={selectedFacilityId}
                  setSelectedFacilityId={setSelectedFacilityId}
                  activeSubTab={settingsSubTab}
                  onSubTabChange={(tab) => setSettingsSubTab(tab)}
                  onOpenRegisterHospital={() => setIsRegisterHospitalOpen(true)}
                  onOpenRegisterDevice={(facId) => {
                    if (facId) setSelectedFacilityId(facId);
                    setDeviceTargetFacilityId(facId || selectedFacilityId);
                    setIsRegisterDeviceOpen(true);
                  }}
                  equipmentCount={equipmentList.length}
                  ticketsCount={ticketsList.length}
                  onRefreshData={handleRefreshData}
                />
              )}
            </div>

            {/* Mobile Fixed Bottom Navigation Bar (Matching Modern App Screen Navigation Pattern) */}
            <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-lg">
              <div className={`max-w-md mx-auto grid ${loggedInUser?.isStaff ? 'grid-cols-7' : 'grid-cols-6'} gap-1 text-center`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    activeTab === 'home' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('assets')}
                  className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    activeTab === 'assets' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Assets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('telemetry')}
                  className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    activeTab === 'telemetry' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Gauge className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">IoT Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('scanner')}
                  className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    activeTab === 'scanner' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">QR Tag</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    activeTab === 'tickets' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">SLA Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    activeTab === 'documents' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Tenders</span>
                </button>

                {loggedInUser?.isStaff && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`py-1 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${
                      activeTab === 'settings' ? 'text-[#0F4C81] font-bold' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-[9px] mt-0.5">Settings</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Register New Hospital Modal */}
      <RegisterHospitalModal
        isOpen={isRegisterHospitalOpen}
        onClose={() => setIsRegisterHospitalOpen(false)}
        onRegisterHospital={handleRegisterHospital}
      />

      {/* Register New Medical Device Modal (allows adding various devices to the same hospital) */}
      <RegisterDeviceModal
        isOpen={isRegisterDeviceOpen}
        onClose={() => setIsRegisterDeviceOpen(false)}
        facilities={facilitiesList}
        currentFacilityId={deviceTargetFacilityId || selectedFacilityId}
        onRegisterDevice={handleRegisterDevice}
      />

      {/* Official NeST / TMDA Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" theme="light" />
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Official Regulatory Document
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-display">{selectedDoc.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 font-mono grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Document Number:</span>
                  <span className="font-bold text-[#0F4C81]">{selectedDoc.documentNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Issuing Authority:</span>
                  <span className="font-bold text-slate-900">{selectedDoc.issuedBy}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                  Official Verification Scope:
                </span>
                <p className="text-emerald-900 leading-relaxed">{selectedDoc.description}</p>
                <div className="flex justify-between text-[11px] text-emerald-800 font-mono pt-2 border-t border-emerald-200/60">
                  <span>Effective Date: <strong>{selectedDoc.issueDate}</strong></span>
                  <span>Valid Until: <strong>{selectedDoc.expiryDate}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Downloaded official verified PDF: ${selectedDoc.title}`);
                  setSelectedDoc(null);
                }}
                className="px-4 py-2 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Verified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
