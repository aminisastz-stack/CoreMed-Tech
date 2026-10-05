import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { X, Wrench, CheckCircle2, Send, Clock, Phone, AlertTriangle } from 'lucide-react';

interface MaintenanceSLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceCategory?: string;
}

export const MaintenanceSLAModal: React.FC<MaintenanceSLAModalProps> = ({
  isOpen,
  onClose,
  initialServiceCategory = ''
}) => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactPerson: '',
    phone: '',
    email: '',
    region: 'Dar es Salaam',
    equipmentType: initialServiceCategory || 'Medical Diagnostic Equipment',
    equipmentModel: '',
    requestType: 'Emergency Breakdown',
    description: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; eta: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `CMT-SLA-${Math.floor(10000 + Math.random() * 90000)}`;
    const eta =
      formData.requestType === 'Emergency Breakdown'
        ? 'Under 4 Hours (Dar & Arusha) · Rapid Dispatch'
        : 'Scheduled within 24–48 Hours';
    setSubmittedTicket({ id: ticketId, eta });
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" theme="light" />
            <div className="border-l border-slate-200 pl-3">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Request Hospital Maintenance / SLA Dispatch
              </h3>
              <p className="text-xs text-slate-500">
                Direct dispatch from Arusha Technical HQ & Dar es Salaam Spare Parts Hub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close maintenance modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submittedTicket ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">
                Service Request Dispatched
              </span>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">
                Ticket Reference: {submittedTicket.id}
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your request has been logged into the CoreMed Field Biomedical Engineering dispatch console. An on-call engineer has been notified for:
              </p>
              <div className="mt-3 inline-block px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800">
                {formData.hospitalName} ({formData.region}) · {submittedTicket.eta}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/255742296631?text=Habari%20CoreMed,%20nimetuma%20ticket%20ya%20matengenezo%20${submittedTicket.id}%20kutoka%20${formData.hospitalName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs"
              >
                <span>Track via WhatsApp Hotline</span>
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Health Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  placeholder="e.g. Regency Medical Centre"
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Region in Tanzania *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                >
                  <option>Dar es Salaam</option>
                  <option>Arusha</option>
                  <option>Kilimanjaro / Moshi</option>
                  <option>Mwanza</option>
                  <option>Dodoma</option>
                  <option>Mbeya</option>
                  <option>Tanga</option>
                  <option>Morogoro</option>
                  <option>Zanzibar</option>
                  <option>Other Region (Nationwide)</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Person & Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Dr. Kimaro / Matron / Eng."
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (+255) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+255 7XX XXX XXX"
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Category
                </label>
                <select
                  value={formData.equipmentType}
                  onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
                >
                  <option>Medical Diagnostic Equipment (Ultrasound, X-Ray, CT)</option>
                  <option>Specialist Equipment Maintenance & Calibration</option>
                  <option>Laboratory Supplies & Analyzers</option>
                  <option>Operating Theatre Products & Autoclaves</option>
                  <option>Medical Gas Pipeline & Oxygen Plant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Request Priority / SLA Level *
                </label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none font-semibold text-slate-900"
                >
                  <option>Emergency Breakdown (Rapid 4-Hr Response)</option>
                  <option>Annual SLA Contract Proposal (Comprehensive)</option>
                  <option>Annual SLA Contract Proposal (Non-Comprehensive)</option>
                  <option>ISO 17025 Safety Calibration Visit</option>
                  <option>Urgent Spare Part Request from Dar Depot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Equipment Model & Symptom Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Specify the machine brand, error codes, affected hospital department, or specific calibration requirements..."
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F4C81] focus:border-[#0F4C81] outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>24/7 Rapid Triage Desk Active</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#0F4C81] hover:bg-[#0A3357] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Submit Service Dispatch Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
