import React, { useState } from 'react';
import { HospitalFacility } from '../data/portalData';
import {
  Building2,
  X,
  Plus,
  MapPin,
  Phone,
  Shield,
  FileText,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface RegisterHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterHospital: (facility: HospitalFacility) => void;
}

const TANZANIA_REGIONS = [
  'Dar es Salaam',
  'Arusha',
  'Kilimanjaro',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Tabora',
  'Kagera',
  'Iringa',
  'Ruvuma',
  'Zanzibar (Unguja/Pemba)',
  'Other'
];

const FACILITY_TYPES = [
  'National Referral Hospital',
  'Zonal Referral Hospital',
  'Regional Referral Hospital',
  'District Hospital / Council Hospital',
  'Specialized Medical Institute',
  'Private Hospital / Polyclinic'
];

const SLA_TIERS = [
  'Comprehensive Tier 1 (24/7 Rapid Coverage)',
  'Comprehensive Tier 1 (Immediate Arusha Dispatch)',
  'Comprehensive Tier 1 (4-Hour Response)',
  'Preventive Calibration SLA',
  'Standard Maintenance SLA',
  'Custom Institutional SLA'
];

const PRESET_HOSPITALS = [
  {
    name: 'Aga Khan Hospital Dar es Salaam',
    region: 'Dar es Salaam',
    location: 'Ocean Road, Upanga East',
    type: 'Private Hospital / Polyclinic',
    slaTier: 'Comprehensive Tier 1 (24/7 Rapid Coverage)',
    contactPerson: 'Dr. Sarah K. Kimaro (Director of Medical Services)',
    phone: '+255 22 211 5151'
  },
  {
    name: 'Benjamin Mkapa Hospital (BMH)',
    region: 'Dodoma',
    location: 'UDOM Campus Road, Dodoma',
    type: 'Zonal Referral Hospital',
    slaTier: 'Comprehensive Tier 1 (4-Hour Response)',
    contactPerson: 'Eng. Emmanuel M. Mushi (Biomedical Lead)',
    phone: '+255 26 296 3710'
  },
  {
    name: 'Mbeya Zonal Referral Hospital (MZRH)',
    region: 'Mbeya',
    location: 'Hospital Hill, Mbeya City',
    type: 'Zonal Referral Hospital',
    slaTier: 'Preventive Calibration SLA',
    contactPerson: 'Dr. Josephat A. Mwakalukwa',
    phone: '+255 25 250 3456'
  },
  {
    name: 'Jakaya Kikwete Cardiac Institute (JKCI)',
    region: 'Dar es Salaam',
    location: 'Kalenga St, Upanga (MNH Complex)',
    type: 'Specialized Medical Institute',
    slaTier: 'Comprehensive Tier 1 (24/7 Rapid Coverage)',
    contactPerson: 'Eng. Francis T. Mrema (CathLab & Perfusion BioMed)',
    phone: '+255 22 215 1378'
  }
];

export const RegisterHospitalModal: React.FC<RegisterHospitalModalProps> = ({
  isOpen,
  onClose,
  onRegisterHospital
}) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Dar es Salaam');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Regional Referral Hospital');
  const [slaTier, setSlaTier] = useState('Comprehensive Tier 1 (24/7 Rapid Coverage)');
  const [contractNumber, setContractNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdFacility, setCreatedFacility] = useState<HospitalFacility | null>(null);

  if (!isOpen) return null;

  // Auto-generate contract number based on hospital initials
  const handleNameChange = (val: string) => {
    setName(val);
    if (!contractNumber || contractNumber.startsWith('CMT-TZ-2026-')) {
      const words = val.trim().split(/\s+/).filter(Boolean);
      const acronym = words.map(w => w[0]?.toUpperCase() || '').join('').slice(0, 4) || 'HSP';
      const randNum = Math.floor(10 + Math.random() * 90);
      setContractNumber(`CMT-TZ-2026-${acronym}-${randNum}`);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_HOSPITALS[0]) => {
    setName(preset.name);
    setRegion(preset.region);
    setLocation(preset.location);
    setType(preset.type);
    setSlaTier(preset.slaTier);
    setContactPerson(preset.contactPerson);
    setPhone(preset.phone);
    const acronym = preset.name.split(' ').map(w => w[0]).join('').slice(0, 4);
    setContractNumber(`CMT-TZ-2026-${acronym}-${Math.floor(10 + Math.random() * 90)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `fac-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15)}-${Date.now().toString(36).slice(-4)}`;
    const finalContract = contractNumber.trim() || `CMT-TZ-2026-${Date.now().toString(36).toUpperCase()}`;

    const newFacility: HospitalFacility = {
      id,
      name: name.trim(),
      region,
      location: location.trim() || `${region}, Tanzania`,
      type,
      slaTier,
      contractNumber: finalContract,
      contactPerson: contactPerson.trim() || 'Head of Clinical Engineering',
      phone: phone.trim() || '+255 742 296 631',
      activeEquipmentCount: 0,
      openTicketsCount: 0
    };

    onRegisterHospital(newFacility);
    setCreatedFacility(newFacility);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCreatedFacility(null);
    setName('');
    setLocation('');
    setContactPerson('');
    setPhone('');
    setContractNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#10B981] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Hospital Network Registry
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Register New Hospital / Clinical Facility
              </h3>
              <p className="text-xs text-slate-500">
                Add an accredited healthcare facility to the CoreMed Tanzania biomedical coverage network.
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

        {isSuccess && createdFacility ? (
          <div className="p-6 bg-emerald-50/80 border border-emerald-300 rounded-3xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Hospital Successfully Registered!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                <strong>{createdFacility.name}</strong> has been added to your production database with contract code <strong>{createdFacility.contractNumber}</strong>. You can now add various medical devices and sensors to this hospital.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-left text-xs font-mono grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Facility ID:</span>
                <span className="font-bold text-[#0F4C81]">{createdFacility.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Region:</span>
                <span className="font-bold text-slate-800">{createdFacility.region}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">SLA Level:</span>
                <span className="font-bold text-emerald-700">{createdFacility.slaTier}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Contact Phone:</span>
                <span className="font-bold text-slate-800">{createdFacility.phone}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Go to Hospital Dashboard & Add Devices
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick 1-Click Presets */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" />
                  <span>Quick Tanzanian Hospital Presets:</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PRESET_HOSPITALS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#0F4C81] rounded-xl text-left transition-all cursor-pointer text-xs"
                  >
                    <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{p.region}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital Name & Type */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hospital / Facility Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mbeya Zonal Referral Hospital"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Facility Classification *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  {FACILITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Region & Location */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanzanian Region *
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  {TANZANIA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Street / Physical Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Hospital Hill Road, Mbeya Urban"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                </div>
              </div>
            </div>

            {/* SLA Tier & Contract Number */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Biomedical SLA Coverage Tier *
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={slaTier}
                    onChange={(e) => setSlaTier(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                  >
                    {SLA_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SLA Contract / NeST Tender Code
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="CMT-TZ-2026-HSP-01"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person & Phone */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Head of Biomedical / Clinical Supervisor
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Eng. Michael K. Sitta"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Direct Hotline / Emergency Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="+255 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                </div>
              </div>
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
                <span>Register Hospital into Network</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
