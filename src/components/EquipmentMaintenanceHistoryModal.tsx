import React from 'react';
import { EquipmentRecordWithHistory } from '../data/equipmentRecords';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  Building,
  User,
  Activity,
  QrCode,
  Printer,
  FileCheck,
  Send,
  Zap
} from 'lucide-react';

interface EquipmentMaintenanceHistoryModalProps {
  equipment: EquipmentRecordWithHistory;
  isOpen: boolean;
  onClose: () => void;
  onOpenQRTag: (equipment: EquipmentRecordWithHistory) => void;
  onRequestMaintenance: (equipmentName: string) => void;
}

export const EquipmentMaintenanceHistoryModal: React.FC<EquipmentMaintenanceHistoryModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onOpenQRTag,
  onRequestMaintenance
}) => {
  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Verified Biomedical Maintenance Dossier
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  TMDA Reg: {equipment.tmdaRegistryId}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {equipment.name}
              </h3>
              <p className="text-xs text-slate-500">
                {equipment.manufacturer} · {equipment.model} · Assigned to <strong>{equipment.hospitalAssigned}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase block">Operational Status</span>
            <span
              className={`font-bold mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] ${
                equipment.operationalStatus === 'Operational'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {equipment.operationalStatus}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase block">Calibration Status</span>
            <span
              className={`font-bold mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] ${
                equipment.calibrationStatus === 'Valid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              {equipment.calibrationStatus}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase block">Next Calibration Due</span>
            <span className="font-bold text-slate-900 mt-1 block text-xs">
              {equipment.nextCalibrationDue}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase block">Uptime Guarantee</span>
            <span className="font-bold text-emerald-700 mt-1 block text-sm">
              {equipment.uptimePercentage}%
            </span>
          </div>
        </div>

        {/* Official Calibration Certificate Card */}
        <div className="p-5 bg-gradient-to-br from-blue-50/60 to-emerald-50/40 rounded-2xl border border-blue-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F4C81]" />
              <h4 className="text-sm font-bold text-slate-900">
                Official ISO 17025 Traceable Calibration Certificate
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F4C81] bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
              Cert #{equipment.calibrationCertificate.certificateNumber}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Lead Biomedical Engineer:</span>
              <span className="font-semibold text-slate-900">{equipment.calibrationCertificate.leadEngineer}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Safety Standard Verified:</span>
              <span className="font-semibold text-slate-900">{equipment.calibrationCertificate.electricalSafetyStandard}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Calibration Analyzer Used:</span>
              <span className="font-semibold text-slate-900">{equipment.calibrationCertificate.analyzerUsed}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Certificate Valid Until:</span>
              <span className="font-bold text-emerald-800">{equipment.calibrationCertificate.validUntil}</span>
            </div>
          </div>
        </div>

        {/* Chronological Maintenance Service History Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F4C81]" />
              <span>Complete Maintenance & Service Event History</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {equipment.maintenanceEvents.length} Verified Log Entries
            </span>
          </div>

          <div className="space-y-3">
            {equipment.maintenanceEvents.map((event, idx) => (
              <div
                key={event.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{event.type}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event.date}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      {event.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed pl-8">
                  {event.description}
                </p>

                <div className="pl-8 pt-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 gap-1">
                  <span className="italic">
                    Findings: <strong>{event.findings}</strong>
                  </span>
                  <span className="font-mono text-slate-400">
                    By: {event.engineer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQRTag(equipment);
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F4C81] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>View Asset QR Tag</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestMaintenance(equipment.name);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#0F4C81] to-[#10B981] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-200" />
            <span>Dispatch SLA Maintenance Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};
