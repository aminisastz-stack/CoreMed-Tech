import React, { useState } from 'react';
import { FEATURED_EQUIPMENT } from '../data/mockData';
import { EquipmentItem } from '../types';
import {
  findEquipmentRecord,
  EquipmentRecordWithHistory,
  EQUIPMENT_RECORDS_CATALOG
} from '../data/equipmentRecords';
import { BrandLogo } from './BrandLogo';
import { EquipmentQRModal } from './EquipmentQRModal';
import { EquipmentMaintenanceHistoryModal } from './EquipmentMaintenanceHistoryModal';
import { EquipmentTagScannerModal } from './EquipmentTagScannerModal';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Filter,
  Eye,
  X,
  Send,
  Building,
  Check,
  QrCode,
  Camera,
  Wrench,
  Clock,
  Sparkles,
  ShieldCheck,
  FileCheck,
  FileSpreadsheet
} from 'lucide-react';

interface EquipmentCatalogProps {
  onOpenMaintenanceModal: () => void;
}

export const EquipmentCatalog: React.FC<EquipmentCatalogProps> = ({ onOpenMaintenanceModal }) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    hospitalName: '',
    email: '',
    phone: '',
    quantity: '1',
    tenderType: 'Direct Procurement',
    notes: ''
  });

  // Modals for QR Code Generator, Maintenance History, and Camera Scanner
  const [selectedQRRecord, setSelectedQRRecord] = useState<EquipmentRecordWithHistory | null>(null);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<EquipmentRecordWithHistory | null>(null);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const categories = [
    { id: 'All', label: t.catalog.categoryAll },
    { id: 'Diagnostic', label: t.catalog.categoryDiagnostic },
    { id: 'Theatre', label: t.catalog.categorySurgical },
    { id: 'Laboratory', label: t.catalog.categoryLab },
    { id: 'LifeSupport', label: t.catalog.categoryIcu },
    { id: 'MedicalGas', label: t.catalog.categoryGas },
  ];

  const filteredEquipment = activeFilter === 'All'
    ? FEATURED_EQUIPMENT
    : FEATURED_EQUIPMENT.filter(eq => eq.category === activeFilter);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);

    if (selectedItem) {
      const msg = `📋 *NEW EQUIPMENT PRO-FORMA & SPECIFICATION REQUEST*
━━━━━━━━━━━━━━━━━━━━━━
🏥 *Hospital / Facility:* ${quoteForm.hospitalName || 'Health Center'}
⚙️ *Requested Machine:* ${selectedItem.name}
🏷️ *Brand / Model:* ${selectedItem.manufacturer} · ${selectedItem.model}
🔢 *Quantity Required:* ${quoteForm.quantity} unit(s)
💼 *Procurement Method:* ${quoteForm.tenderType}
📧 *Official Email:* ${quoteForm.email}
📞 *Contact Phone:* ${quoteForm.phone}
📍 *Delivery Location / Notes:* ${quoteForm.notes || 'Main Hospital Depot'}
━━━━━━━━━━━━━━━━━━━━━━
🌐 *Source:* COREMED TECH Equipment Catalog (Tanzania)`;

      const whatsappUrl = `https://wa.me/255742296631?text=${encodeURIComponent(msg)}`;
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Fallback handled in UI
      }
    }

    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedItem(null);
    }, 2800);
  };

  // Helper to get or build an EquipmentRecordWithHistory for a given EquipmentItem
  const getRecordForItem = (item: EquipmentItem): EquipmentRecordWithHistory => {
    const existing = findEquipmentRecord(item.id) || findEquipmentRecord(item.name);
    if (existing) return existing;

    return {
      id: `rec-${item.id}`,
      catalogId: item.id,
      name: item.name,
      category: item.category,
      manufacturer: item.manufacturer,
      model: item.model,
      serialNumber: `SN-${item.model.replace(/\s+/g, '-').toUpperCase()}-001`,
      qrCodeTag: `CMT-QR-${item.id.toUpperCase()}-TZ`,
      hospitalAssigned: 'Muhimbili National Hospital (MNH)',
      facilityId: 'fac-mnh',
      department: 'Clinical Engineering & Radiology',
      installationDate: '2024-01-15',
      lastCalibrationDate: '2026-08-15',
      nextCalibrationDue: '2027-02-15',
      calibrationStatus: 'Valid',
      uptimePercentage: 99.4,
      slaCoverage: 'Comprehensive Tier 1 SLA',
      operationalStatus: 'Operational',
      powerRequirements: '230V AC · 50Hz',
      tmdaRegistryId: 'TMDA/MED/DEV/2026/0491',
      calibrationCertificate: {
        certificateNumber: `CMT-CAL-${item.id.toUpperCase()}-089`,
        leadEngineer: 'Eng. Kelvin Lyimo, B.Sc. Biomedical (ERB #9482)',
        analyzerUsed: 'Fluke Biomedical ProSim 8 / ESA620 Safety Analyzer',
        standard: 'ISO/IEC 17025 & IEC 62353 Electrical Safety',
        result: 'PASSED',
        electricalSafetyStandard: 'IEC 62353 Class I Type BF (Chassis Leakage: 40 µA)',
        validUntil: '2027-02-15'
      },
      maintenanceEvents: [
        {
          id: `me-${item.id}-01`,
          date: '2026-08-15',
          type: 'Calibration & Safety Audit',
          engineer: 'Eng. Kelvin Lyimo',
          facility: 'Muhimbili National Hospital (MNH)',
          description: `Annual ISO 17025 traceable calibration and electrical safety audit for ${item.name}.`,
          status: 'Certified',
          findings: 'Parameters verified within ±1.5% manufacturer tolerance limit.',
          standardsComplied: ['ISO 17025', 'IEC 62353']
        }
      ],
      image: item.image
    };
  };

  return (
    <section id="equipment" className="py-16 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-20 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
              <span>{t.catalog.badge}</span>
              <span aria-hidden="true">·</span>
              <span>TMDA / ISO 17025</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.catalog.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            {t.catalog.subtitle}
          </p>
        </div>

        {/* Filter Segmented Buttons (Hick's Law: Clean & Smooth) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#0F4C81] text-white shadow-md shadow-[#0F4C81]/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Equipment Grid: 3 Column Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEquipment.map((item) => {
            const record = getRecordForItem(item);
            return (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-[#0F4C81]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with measured overlay */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-800 shadow-xs">
                      {item.manufacturer}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#0F4C81]/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-medium backdrop-blur-xs flex items-center gap-1.5">
                      <span>{item.availability}</span>
                    </div>

                    {/* Quick QR Asset Tag Floating Pill */}
                    <button
                      type="button"
                      onClick={() => setSelectedQRRecord(record)}
                      className="absolute top-3 left-3 bg-slate-950/85 hover:bg-slate-900 text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-mono backdrop-blur-xs border border-white/20 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      title="View Digital QR Tag"
                    >
                      <QrCode className="w-3 h-3 text-emerald-400" />
                      <span>{record.qrCodeTag}</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                      <span>{item.category}</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        Uptime: {record.uptimePercentage}%
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors mb-2 leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Top specifications */}
                    <div className="space-y-1.5 mb-4 border-t border-slate-100 pt-3">
                      {item.specifications.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* TMDA & ISO 17025 Compliance Strip */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] flex items-center justify-between font-mono text-slate-600">
                      <span>Cal Due: {record.nextCalibrationDue}</span>
                      <span className="text-[#0F4C81] font-bold">IEC 62353 Valid</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar (Hick's Law: High-visibility Primary CTA with sleek secondary access) */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F4C81] hover:bg-[#093358] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Request Quote & Specs</span>
                  </button>

                  {/* Secondary Quick History & QR action */}
                  <button
                    type="button"
                    onClick={() => setSelectedHistoryRecord(record)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0F4C81] text-slate-700 hover:text-[#0F4C81] hover:bg-slate-50 transition-all cursor-pointer"
                    title="View ISO 17025 Maintenance Dossier"
                    aria-label="View Maintenance History"
                  >
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Detail & Quote Request Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                <div className="shrink-0">
                  <BrandLogo size="sm" theme="light" />
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs uppercase font-bold text-emerald-600 tracking-wider">
                    Equipment Specification & Quotation
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 leading-snug">
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Manufacturer: {selectedItem.manufacturer} · Model: {selectedItem.model}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 py-6">
              {/* Left: Specs, Details & QR Quick Action */}
              <div className="space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </p>

                {/* Digital Passport Quick Link Bar */}
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#0F4C81]" />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Digital Asset QR Tag</span>
                      <span className="text-[10px] text-slate-500">TMDA Verified Record</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const rec = getRecordForItem(selectedItem);
                      setSelectedItem(null);
                      setSelectedQRRecord(rec);
                    }}
                    className="px-2.5 py-1 bg-[#0F4C81] text-white font-bold rounded-lg text-[11px] hover:bg-[#0B3961] cursor-pointer"
                  >
                    Generate Tag
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                    Technical Specifications:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedItem.specifications.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                    Certifications & Availability:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedItem.certifications.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {c}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-semibold">
                      {selectedItem.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Request Official Quotation / NeST Bid */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Request Official Pro-Forma & Spec Sheet
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Delivered with TMDA compliance documentation and NeST quotation ready within 2 hours.
                </p>

                {quoteSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h5 className="text-sm font-bold text-emerald-900">Quotation Request Submitted</h5>
                    <p className="text-xs text-emerald-700">
                      Our commercial biomedical team will contact your hospital with the official Pro-Forma invoice and tender dossier.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Hospital or Laboratory Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteForm.hospitalName}
                        onChange={(e) => setQuoteForm({ ...quoteForm, hospitalName: e.target.value })}
                        placeholder="e.g. Amana Hospital or Dr. Diagnostic"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Official Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          placeholder="procurement@hospital.co.tz"
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Phone Number (+255) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          placeholder="+255 7XX XXX XXX"
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Procurement Method
                        </label>
                        <select
                          value={quoteForm.tenderType}
                          onChange={(e) => setQuoteForm({ ...quoteForm, tenderType: e.target.value })}
                          className="w-full text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                        >
                          <option>Direct Hospital Purchase</option>
                          <option>NeST Government Tender</option>
                          <option>Lease / SLA Financing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Units Required
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={quoteForm.quantity}
                          onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Installation or Delivery Location
                      </label>
                      <input
                        type="text"
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        placeholder="e.g. Main Theatre, Arusha or Ilala, Dar"
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#0F4C81] hover:bg-[#0A3357] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Send Instant Pro-Forma Request</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Dedicated TMDA Equipment QR Code Generator Modal */}
      {selectedQRRecord && (
        <EquipmentQRModal
          equipment={selectedQRRecord}
          isOpen={!!selectedQRRecord}
          onClose={() => setSelectedQRRecord(null)}
          onViewHistory={(record) => {
            setSelectedQRRecord(null);
            setSelectedHistoryRecord(record);
          }}
        />
      )}

      {/* 2. Equipment Maintenance & Service History Dossier Modal */}
      {selectedHistoryRecord && (
        <EquipmentMaintenanceHistoryModal
          equipment={selectedHistoryRecord}
          isOpen={!!selectedHistoryRecord}
          onClose={() => setSelectedHistoryRecord(null)}
          onOpenQRTag={(record) => {
            setSelectedHistoryRecord(null);
            setSelectedQRRecord(record);
          }}
          onRequestMaintenance={(eqName) => {
            setSelectedHistoryRecord(null);
            onOpenMaintenanceModal();
          }}
        />
      )}

      {/* 3. Live Hardware Camera & QR Tag Scanner Modal */}
      <EquipmentTagScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onRecordMatched={(matchedRecord) => {
          setIsScannerModalOpen(false);
          setSelectedHistoryRecord(matchedRecord);
        }}
      />
    </section>
  );
};
