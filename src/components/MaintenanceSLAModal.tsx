import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Wrench,
  CheckCircle2,
  Send,
  Clock,
  Phone,
  AlertTriangle,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

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
    equipmentType: initialServiceCategory || 'Medical Diagnostic Equipment (Ultrasound, X-Ray, CT)',
    equipmentModel: '',
    requestType: 'Emergency Breakdown (Rapid 4-Hr Response)',
    description: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    eta: string;
    whatsappUrl: string;
    summary: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `CMT-SLA-${Math.floor(10000 + Math.random() * 90000)}`;
    const eta =
      formData.requestType.includes('Emergency')
        ? 'Under 4 Hours (Dar & Arusha) · Rapid Dispatch'
        : 'Scheduled within 24–48 Hours';

    // Construct professional, structured WhatsApp message payload
    const whatsappMessage = `🏥 *NEW HOSPITAL SLA DISPATCH REQUEST*
━━━━━━━━━━━━━━━━━━━━━━
🎫 *Ticket ID:* ${ticketId}
🏥 *Facility:* ${formData.hospitalName || 'Not Specified'}
📍 *Region:* ${formData.region}
👤 *Contact Person:* ${formData.contactPerson || 'Hospital Admin'}
📞 *Phone Number:* ${formData.phone || 'Not Specified'}
⚙️ *Service Category:* ${formData.equipmentType}
🚨 *Priority / SLA:* ${formData.requestType}
⏱️ *Expected SLA ETA:* ${eta}

📝 *Equipment Model & Symptoms:*
${formData.description ? formData.description : 'Routine inspection and diagnostic calibration required.'}
━━━━━━━━━━━━━━━━━━━━━━
🌐 *Source:* COREMED TECH Biomedical Platform (Tanzania)`;

    const whatsappUrl = `https://wa.me/255742296631?text=${encodeURIComponent(whatsappMessage)}`;

    // Set submitted state
    setSubmittedTicket({
      id: ticketId,
      eta,
      whatsappUrl,
      summary: whatsappMessage
    });

    // Automatically trigger WhatsApp window/app redirect
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback handled in the confirmation UI
    }
  };

  const handleCopySummary = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Modal Header (Responsive layout with zero text/logo collision) */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
            <div className="shrink-0">
              <BrandLogo size="sm" theme="light" />
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-200 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Request Hospital Maintenance / SLA Dispatch
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                Direct dispatch from Arusha Technical HQ & Dar es Salaam Spare Parts Hub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close maintenance modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Confirmation Screen */}
        {submittedTicket ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200/60">
                ✓ Service Request Logged & Dispatching to WhatsApp
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                Ticket Reference: {submittedTicket.id}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your service dispatch request has been structured and forwarded to the <strong>CoreMed 24/7 Biomedical On-Call Engineering Hotline (+255 742 296 631)</strong>.
              </p>

              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between text-slate-600">
                  <span className="font-semibold">Hospital Facility:</span>
                  <span className="text-slate-900 font-bold">{formData.hospitalName} ({formData.region})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-semibold">Service Category:</span>
                  <span className="text-slate-900 font-medium truncate max-w-[200px]">{formData.equipmentType}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-semibold">Target Response SLA:</span>
                  <span className="text-emerald-700 font-bold">{submittedTicket.eta}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={submittedTicket.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Send / Open in WhatsApp Now</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Ticket Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital / Health Facility Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  placeholder="e.g. Regency Medical Centre"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Region in Tanzania *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition-all"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Person & Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Dr. Kimaro / Matron / Eng."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (+255) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+255 7XX XXX XXX"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Category
                </label>
                <select
                  value={formData.equipmentType}
                  onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition-all"
                >
                  <option>Medical Diagnostic Equipment (Ultrasound, X-Ray, CT)</option>
                  <option>Specialist Equipment Maintenance & Calibration</option>
                  <option>Laboratory Supplies & Analyzers</option>
                  <option>Operating Theatre Products & Autoclaves</option>
                  <option>Medical Gas Pipeline & Oxygen Plant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Request Priority / SLA Level *
                </label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none font-bold text-slate-900 transition-all"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Equipment Model & Symptom Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Specify the machine brand, error codes, affected hospital department, or specific calibration requirements..."
                className="w-full text-xs p-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition-all resize-none"
              />
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Rapid Triage Desk Active (+255 742 296 631)</span>
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 bg-[#0F4C81] hover:bg-[#0A3357] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-[#0F4C81]/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Submit & Send via WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
