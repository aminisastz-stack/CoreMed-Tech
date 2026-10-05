import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { EquipmentRecordWithHistory } from '../data/equipmentRecords';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Calendar,
  Building,
  Wrench,
  FileText
} from 'lucide-react';

interface EquipmentQRModalProps {
  equipment: EquipmentRecordWithHistory;
  isOpen: boolean;
  onClose: () => void;
  onViewHistory: (equipment: EquipmentRecordWithHistory) => void;
}

export const EquipmentQRModal: React.FC<EquipmentQRModalProps> = ({
  equipment,
  isOpen,
  onClose,
  onViewHistory
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const stickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !equipment) return;

    // Generate high-resolution QR Code
    // The payload includes the QR Tag and direct web asset URL
    const payload = equipment.qrCodeTag;

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0F4C81',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });
  }, [isOpen, equipment]);

  if (!isOpen || !equipment) return null;

  // Handle Download PNG
  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `CoreMed-AssetTag-${equipment.qrCodeTag}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Print Sticker
  const handlePrint = () => {
    window.print();
  };

  // Handle Copy Tag Code
  const handleCopyTag = () => {
    navigator.clipboard.writeText(equipment.qrCodeTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0F4C81] flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                TMDA Compliance Asset Tag Generator
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Digital Equipment Passport & QR Tag
              </h3>
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

        {/* Official Printable Asset Sticker Frame */}
        <div
          ref={stickerRef}
          className="p-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-dashed border-[#0F4C81]/40 shadow-inner space-y-4"
        >
          {/* Sticker Top Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <BrandLogo size="sm" theme="light" />
              <div className="border-l border-slate-200 pl-2">
                <span className="text-[9px] font-mono uppercase text-slate-500 block leading-tight">
                  Tanzania Biomedical Solutions
                </span>
                <span className="text-[10px] font-bold text-[#0F4C81] block leading-tight">
                  Official TMDA Asset Tag
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider inline-block">
                ISO 17025 Verified
              </span>
              <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                Reg: {equipment.tmdaRegistryId}
              </span>
            </div>
          </div>

          {/* Sticker Body: QR Code and Key Equipment Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 py-1">
            {/* High-Resolution Scannable QR Code */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Tag for ${equipment.name}`}
                  className="w-40 h-40 object-contain"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
              <span className="text-[10px] font-mono font-bold text-[#0F4C81] mt-2 block tracking-wider">
                {equipment.qrCodeTag}
              </span>
            </div>

            {/* Asset Details */}
            <div className="flex-1 space-y-2.5 text-xs text-slate-700 min-w-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Assigned Healthcare Facility:
                </span>
                <span className="font-bold text-slate-900 block truncate">
                  {equipment.hospitalAssigned}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Dept: {equipment.department}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Equipment Record & Model:
                </span>
                <span className="font-bold text-[#0F4C81] block">
                  {equipment.name}
                </span>
                <span className="text-[11px] text-slate-600 block">
                  {equipment.manufacturer} · {equipment.model}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block">Serial No:</span>
                  <span className="font-bold text-slate-900 truncate block">{equipment.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-400 block">Calibration Due:</span>
                  <span className="font-bold text-emerald-700 block">{equipment.nextCalibrationDue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode Strip & Footer */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SLA: {equipment.slaCoverage}</span>
            </div>
            <span>Scan sticker with camera to verify</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="py-2.5 px-4 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Asset Tag (PNG)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewHistory(equipment);
            }}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View Maintenance History</span>
          </button>

          <button
            type="button"
            onClick={handleCopyTag}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tag Code Copied!' : 'Copy Tag ID'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Asset Sticker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
