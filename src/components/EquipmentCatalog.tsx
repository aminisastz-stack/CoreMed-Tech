import React, { useState } from 'react';
import { FEATURED_EQUIPMENT } from '../data/mockData';
import { EquipmentItem } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Filter,
  Eye,
  X,
  Send,
  Building,
  Check
} from 'lucide-react';

interface EquipmentCatalogProps {
  onOpenMaintenanceModal: () => void;
}

export const EquipmentCatalog: React.FC<EquipmentCatalogProps> = ({ onOpenMaintenanceModal }) => {
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

  const categories = [
    { id: 'All', label: 'All Equipment' },
    { id: 'Diagnostic', label: 'Diagnostic Ultrasound & Radiology' },
    { id: 'Theatre', label: 'Operating Theatre & Sterilization' },
    { id: 'Laboratory', label: 'Clinical Laboratory' },
    { id: 'LifeSupport', label: 'ICU & Life Support' },
    { id: 'MedicalGas', label: 'Medical Gas Systems' },
  ];

  const filteredEquipment = activeFilter === 'All'
    ? FEATURED_EQUIPMENT
    : FEATURED_EQUIPMENT.filter(eq => eq.category === activeFilter);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedItem(null);
    }, 2500);
  };

  return (
    <section id="equipment" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
              <span>03. Equipment Inventory & Supply</span>
              <span aria-hidden="true">·</span>
              <span>TMDA Approved Systems</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Clinical Grade Medical Systems
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Directly imported, calibrated, and warrantied by CoreMed Tech with complete spare part availability in Tanzania.
          </p>
        </div>

        {/* Filter Segmented Buttons (Functional interactive button tags as allowed by constitution) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#0F4C81] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Equipment Grid: 3 Column Showcase (Inspired by Nexora / TechNova cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-[#0F4C81]/50 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-800 shadow-xs">
                    {item.manufacturer}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#0F4C81]/90 text-white px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-xs">
                    {item.availability}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Model: {item.model}</span>
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
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0F4C81] hover:text-[#0A3357] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Specs & Quote</span>
                </button>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#0F4C81] group-hover:text-white flex items-center justify-center transition-colors text-slate-600"
                  aria-label="View specifications"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Detail & Quote Request Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" theme="light" />
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">
                    Equipment Specification & Quotation
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Manufacturer: {selectedItem.manufacturer} · Model: {selectedItem.model}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 py-6">
              {/* Left: Specs & Details */}
              <div className="space-y-4">
                <div className="h-44 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </p>

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
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
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
    </section>
  );
};
