import React, { useState } from 'react';
import { RegisteredEquipment, HospitalFacility } from '../data/portalData';
import {
  Cpu,
  X,
  Plus,
  QrCode,
  Building,
  CheckCircle2,
  Sparkles,
  Zap,
  Wrench
} from 'lucide-react';

interface RegisterDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: HospitalFacility[];
  currentFacilityId: string;
  onRegisterDevice: (device: RegisteredEquipment) => void;
}

const DEPARTMENTS = [
  'Radiology & Imaging',
  'Main Intensive Care Unit (ICU)',
  'Neonatal ICU (NICU)',
  'Operating Theatre (OT 1 & 2)',
  'Central Sterilization (CSSD)',
  'Clinical Laboratory & Pathology',
  'Emergency & Trauma Centre',
  'Hospital Central Plant & MGPS',
  'Renal Dialysis Unit',
  'Maternity & Labor Ward',
  'Cardiology & CathLab'
];

const DEVICE_CATEGORIES = [
  'Diagnostic',
  'LifeSupport',
  'Theatre',
  'Sterilization',
  'Laboratory',
  'MedicalGas'
];

const DEVICE_PRESETS = [
  {
    name: 'Mindray SV300 ICU Ventilator',
    manufacturer: 'Mindray Biomedical',
    model: 'SV-300 Smart Vent',
    department: 'Main Intensive Care Unit (ICU)',
    category: 'LifeSupport',
    powerRequirements: 'Internal Li-ion battery + 230V Mains · 50Hz',
    serviceNotes: 'Microprocessor pneumatic ventilator. Flow sensor and O2 cell calibrated to ISO 80601-2-12.'
  },
  {
    name: 'Mindray Wato EX-65 Anesthesia Machine',
    manufacturer: 'Mindray Biomedical',
    model: 'Wato EX-65 Pro',
    department: 'Operating Theatre (OT 1 & 2)',
    category: 'Theatre',
    powerRequirements: '230V AC · Pipeline O2/N2O/Air 4.0 bar pneumatic drive',
    serviceNotes: 'Integrated vaporizer and patient breathing circuit. Vaporizer concentration calibrated.'
  },
  {
    name: 'Mindray Resona I9 Elite Ultrasound',
    manufacturer: 'Mindray Biomedical',
    model: 'Resona I9 Pro',
    department: 'Radiology & Imaging',
    category: 'Diagnostic',
    powerRequirements: '230V AC · 50Hz · Dedicated Online UPS 3kVA',
    serviceNotes: 'Transducer crystal scan test nominal; power supply ripple <15mV; calibrated to IEC 60601-2-37.'
  },
  {
    name: 'BioSafe 360L Pulse Vacuum Autoclave',
    manufacturer: 'Tuttnauer / CoreMed Bio',
    model: 'BS-360V Pulse',
    department: 'Central Sterilization (CSSD)',
    category: 'Sterilization',
    powerRequirements: '400V 3-Phase 36kW Steam Generator',
    serviceNotes: 'Double-door pass-through steam sterilizer with Bowie-Dick and biological indicator validation.'
  },
  {
    name: 'Mindray BC-5380 5-Part Hematology Analyzer',
    manufacturer: 'Mindray Biomedical',
    model: 'BC-5380 Auto',
    department: 'Clinical Laboratory & Pathology',
    category: 'Laboratory',
    powerRequirements: '230V AC · Built-in voltage stabilizer',
    serviceNotes: 'Laser scatter flow cytometry with 27 parameters. Optical aperture sensor verified.'
  },
  {
    name: 'Oxair Containerized PSA Oxygen Plant (50 Nm³/h)',
    manufacturer: 'Oxair Gas Systems',
    model: 'PSA-50 High Purity',
    department: 'Hospital Central Plant & MGPS',
    category: 'MedicalGas',
    powerRequirements: 'Duplex 45kW Atlas Copco Air Compressors',
    serviceNotes: 'Desiccant drying tower molecular sieve efficiency 95.2%; automated manifold switchover verified.'
  },
  {
    name: 'Mindray BeneHeart D6 Biphasic Defibrillator',
    manufacturer: 'Mindray',
    model: 'BeneHeart D6 Monitor/Defib',
    department: 'Emergency & Trauma Centre',
    category: 'LifeSupport',
    powerRequirements: 'Rechargeable Smart Li-ion + 230V AC dock',
    serviceNotes: '360J BTE technology with AED, manual defib, pacing, and 12-lead ECG monitoring.'
  }
];

export const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({
  isOpen,
  onClose,
  facilities,
  currentFacilityId,
  onRegisterDevice
}) => {
  const [selectedFacility, setSelectedFacility] = useState(currentFacilityId || facilities[0]?.id || 'fac-mnh');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Radiology & Imaging');
  const [manufacturer, setManufacturer] = useState('Mindray Biomedical');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [qrCodeTag, setQrCodeTag] = useState('');
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastCalibrationDate, setLastCalibrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextCalibrationDue, setNextCalibrationDue] = useState(
    new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [slaCoverage, setSlaCoverage] = useState<'Comprehensive Tier 1' | 'Calibration Only' | 'Warranty'>(
    'Comprehensive Tier 1'
  );
  const [operationalStatus, setOperationalStatus] = useState<'Operational' | 'Requires Attention' | 'Under Maintenance'>(
    'Operational'
  );
  const [powerRequirements, setPowerRequirements] = useState('230V AC · 50Hz · Dedicated Online UPS 3kVA');
  const [serviceNotes, setServiceNotes] = useState('Installed & commissioned by CoreMed Tech biomedical engineering team.');

  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredDevice, setRegisteredDevice] = useState<RegisteredEquipment | null>(null);

  if (!isOpen) return null;

  // Auto-generate serial and QR code tag
  const handleAutoGenerateSerial = (devName?: string) => {
    const targetName = devName || name || 'MED';
    const initials = targetName
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 3) || 'MED';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const newSerial = `SN-${initials}-${randNum}`;
    setSerialNumber(newSerial);

    const fac = facilities.find((f) => f.id === selectedFacility);
    const facCode = fac ? fac.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 4) : 'HSP';
    setQrCodeTag(`CMT-QR-${randNum}-${facCode}`);
  };

  const handleApplyPreset = (preset: typeof DEVICE_PRESETS[0]) => {
    setName(preset.name);
    setManufacturer(preset.manufacturer);
    setModel(preset.model);
    setDepartment(preset.department);
    setPowerRequirements(preset.powerRequirements);
    setServiceNotes(preset.serviceNotes);
    handleAutoGenerateSerial(preset.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSerial = serialNumber.trim() || `SN-MED-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalQr = qrCodeTag.trim() || `CMT-QR-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `EQ-${Date.now().toString(36).toUpperCase()}`;

    const newDevice: RegisteredEquipment = {
      id,
      facilityId: selectedFacility,
      name: name.trim(),
      department,
      manufacturer: manufacturer.trim() || 'CoreMed Partner OEM',
      model: model.trim() || name.trim(),
      serialNumber: finalSerial,
      qrCodeTag: finalQr,
      installationDate,
      lastCalibrationDate,
      nextCalibrationDue,
      calibrationStatus: 'Valid',
      uptimePercentage: 99.8,
      slaCoverage,
      operationalStatus,
      powerRequirements: powerRequirements.trim() || '230V AC · 50Hz',
      lastServiceNotes: serviceNotes.trim() || 'Commissioned with TMDA standards adherence.'
    };

    onRegisterDevice(newDevice);
    setRegisteredDevice(newDevice);
    setIsSuccess(true);
  };

  const handleAddAnotherSameHospital = () => {
    setIsSuccess(false);
    setRegisteredDevice(null);
    setName('');
    setModel('');
    setSerialNumber('');
    setQrCodeTag('');
    setServiceNotes('Commissioned with TMDA calibration verification.');
    // Keep the selected hospital so user can add multiple devices to the SAME hospital easily!
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setRegisteredDevice(null);
    setName('');
    setModel('');
    setSerialNumber('');
    setQrCodeTag('');
    onClose();
  };

  const currentHospitalObj = facilities.find((f) => f.id === selectedFacility) || facilities[0];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#10B981] flex items-center justify-center text-white shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Asset Commissioning & QR Tagging
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Register Device / Medical Equipment to Hospital
              </h3>
              <p className="text-xs text-slate-500">
                Add medical devices to <strong>{currentHospitalObj?.name}</strong> or any partner hospital.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess && registeredDevice ? (
          <div className="p-6 bg-emerald-50/80 border border-emerald-300 rounded-3xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Device Successfully Registered & QR Tagged!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-lg mx-auto">
                <strong>{registeredDevice.name}</strong> has been assigned to{' '}
                <strong>{currentHospitalObj?.name}</strong> ({registeredDevice.department}). Digital Asset Passport and QR tag are immediately active.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-left text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Serial Number:</span>
                <span className="font-bold text-slate-900">{registeredDevice.serialNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">QR Asset Tag:</span>
                <span className="font-bold text-[#0F4C81]">{registeredDevice.qrCodeTag}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Next Cal Due:</span>
                <span className="font-bold text-emerald-700">{registeredDevice.nextCalibrationDue}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">SLA Level:</span>
                <span className="font-bold text-slate-800">{registeredDevice.slaCoverage}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={handleAddAnotherSameHospital}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Another Device to Same Hospital</span>
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
              >
                View Equipment in Hospital Asset Inventory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Hospital Selector Banner */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0F4C81] text-white flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Target Hospital / Healthcare Facility:</span>
                  <span className="text-slate-500 text-[11px]">
                    You can add various devices to this hospital or select any other.
                  </span>
                </div>
              </div>

              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({fac.region}) · {fac.activeEquipmentCount} active devices
                  </option>
                ))}
              </select>
            </div>

            {/* Quick 1-Click Equipment Presets */}
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" />
                  <span>Popular Biomedical Equipment Presets:</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to autofill specs</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {DEVICE_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-xl text-left transition-all cursor-pointer text-xs"
                  >
                    <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{p.department}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Name & Department */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Equipment / Device Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mindray SV300 ICU Ventilator"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!serialNumber) handleAutoGenerateSerial(e.target.value);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital Department / Clinical Ward *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manufacturer & Model */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Manufacturer / OEM
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mindray Biomedical, Siemens, Tuttnauer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Model Number / Edition
                </label>
                <input
                  type="text"
                  placeholder="e.g. SV-300 Smart Vent"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>
            </div>

            {/* Serial Number & QR Asset Tag */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Serial Number *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoGenerateSerial()}
                    className="text-[10px] text-[#0F4C81] hover:underline font-bold"
                  >
                    ⚡ Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="SN-MED-948102"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  TMDA QR Code Asset Tag
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="CMT-QR-948102-MNH"
                    value={qrCodeTag}
                    onChange={(e) => setQrCodeTag(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Calibration Dates & Status */}
            <div className="grid sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Last Calibration Date
                </label>
                <input
                  type="date"
                  value={lastCalibrationDate}
                  onChange={(e) => setLastCalibrationDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Next Calibration Due
                </label>
                <input
                  type="date"
                  value={nextCalibrationDue}
                  onChange={(e) => setNextCalibrationDue(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Operational State
                </label>
                <select
                  value={operationalStatus}
                  onChange={(e) =>
                    setOperationalStatus(e.target.value as 'Operational' | 'Requires Attention' | 'Under Maintenance')
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  <option value="Operational">Operational (Nominal)</option>
                  <option value="Requires Attention">Requires Attention</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            {/* SLA Coverage & Power Requirements */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SLA Maintenance Coverage
                </label>
                <select
                  value={slaCoverage}
                  onChange={(e) =>
                    setSlaCoverage(e.target.value as 'Comprehensive Tier 1' | 'Calibration Only' | 'Warranty')
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  <option value="Comprehensive Tier 1">Comprehensive Tier 1 (Full Spares & 24/7)</option>
                  <option value="Calibration Only">Calibration Only (ISO 17025 Audits)</option>
                  <option value="Warranty">OEM Manufacturer Warranty</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Electrical & Power Specifications
                </label>
                <div className="relative">
                  <Zap className="w-4 h-4 text-amber-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="230V AC · 50Hz · Dedicated Online UPS 3kVA"
                    value={powerRequirements}
                    onChange={(e) => setPowerRequirements(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                </div>
              </div>
            </div>

            {/* Service & Commissioning Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Biomedical Commissioning & Installation Notes
              </label>
              <textarea
                rows={2}
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                placeholder="Initial safety tests, electrical leakage readings, or transducer verification details..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#0F4C81] to-[#10B981] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register Device & Generate Digital Passport</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
