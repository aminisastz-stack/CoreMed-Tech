import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  Brain,
  Activity,
  Smile,
  Stethoscope,
  Sparkles,
  Award,
  Shield,
  ArrowRight,
  X,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface DepartmentItem {
  id: string;
  name: string;
  category: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
  description: string;
  equipment: string[];
}

interface DepartmentsSectionProps {
  onOpenMaintenanceModal: () => void;
  onOpenCatalog: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  onOpenMaintenanceModal,
  onOpenCatalog,
}) => {
  const { t } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<DepartmentItem | null>(null);

  const departments: DepartmentItem[] = [
    {
      id: 'cardiology',
      name: t.departments.dept1Title,
      category: 'Diagnostic & ECG',
      bgColor: 'bg-rose-50 hover:bg-rose-100 border-rose-100',
      iconColor: 'text-rose-500',
      icon: <Heart className="w-6 h-6" />,
      description: t.departments.dept1Desc,
      equipment: ['Mindray Resona 9 Cardiac Ultrasound', 'Biphasic Defibrillators', '12-Lead Holter ECG Monitors']
    },
    {
      id: 'neurology',
      name: t.departments.dept2Title,
      category: 'Diagnostic Imaging & EEG',
      bgColor: 'bg-sky-50 hover:bg-sky-100 border-sky-100',
      iconColor: 'text-sky-600',
      icon: <Brain className="w-6 h-6" />,
      description: t.departments.dept2Desc,
      equipment: ['32-Channel Digital EEG', 'Transcranial Doppler', 'MRI Telemetry Standards']
    },
    {
      id: 'icu',
      name: t.departments.dept3Title,
      category: 'Critical Care & Life Support',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100',
      iconColor: 'text-indigo-600',
      icon: <Stethoscope className="w-6 h-6" />,
      description: t.departments.dept3Desc,
      equipment: ['Mechanical ICU Ventilators', 'Syringe & Infusion Pumps', 'Multi-parameter Patient Monitors']
    },
    {
      id: 'pediatrics',
      name: t.departments.dept4Title,
      category: 'Neonatal Care & NICU',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-100',
      iconColor: 'text-blue-600',
      icon: <Smile className="w-6 h-6" />,
      description: t.departments.dept4Desc,
      equipment: ['Servo-Controlled Infant Incubators', 'LED Phototherapy Systems', 'Pediatric CPAP Ventilators']
    },
    {
      id: 'surgical',
      name: t.departments.dept5Title,
      category: 'Surgical OT & Anesthesia',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100',
      iconColor: 'text-emerald-600',
      icon: <Activity className="w-6 h-6" />,
      description: t.departments.dept5Desc,
      equipment: ['Electrosurgical Units (ESU)', 'Anesthesia Workstations', 'Shadowless Surgical LED Lamps']
    },
    {
      id: 'imaging',
      name: t.departments.dept6Title,
      category: 'Radiology & Ultrasound',
      bgColor: 'bg-pink-50 hover:bg-pink-100 border-pink-100',
      iconColor: 'text-pink-500',
      icon: <Shield className="w-6 h-6" />,
      description: t.departments.dept6Desc,
      equipment: ['Voluson 4D OB/GYN Ultrasound', 'Digital Flat-Panel X-Ray', 'Acoustic Probe Analyzers']
    },
    {
      id: 'laboratory',
      name: t.departments.dept7Title,
      category: 'Clinical Diagnostic',
      bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-100',
      iconColor: 'text-teal-600',
      icon: <Sparkles className="w-6 h-6" />,
      description: t.departments.dept7Desc,
      equipment: ['Automated Biochemistry Analyzers', 'Hematology Counters', 'High-Speed Centrifuges']
    },
    {
      id: 'medical-gas',
      name: t.departments.dept8Title,
      category: 'Medical Gas & Cryogenics',
      bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-100',
      iconColor: 'text-amber-600',
      icon: <Award className="w-6 h-6" />,
      description: t.departments.dept8Desc,
      equipment: ['Central Oxygen Manifolds', 'IoT Pipeline Pressure Sensors', 'Medical Vacuum Systems']
    }
  ];

  return (
    <section id="departments" className="py-14 sm:py-20 bg-slate-50/70 border-y border-slate-100 font-sans w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
              {t.departments.kicker}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t.departments.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl font-normal">
              {t.departments.subtitle}
            </p>
          </div>

          <button
            onClick={onOpenCatalog}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F4C81] hover:text-[#0A3357] transition-colors cursor-pointer shrink-0"
          >
            <span>{t.departments.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Pastel Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className={`${dept.bgColor} border rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col justify-between h-44 sm:h-52 cursor-pointer`}
            >
              {/* Top Icon Badge */}
              <div className={`w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center ${dept.iconColor} group-hover:scale-110 transition-transform`}>
                {dept.icon}
              </div>

              {/* Bottom Details */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors line-clamp-2">
                  {dept.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
                  {dept.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Detail Modal for Department Specs */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-left">
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${selectedDept.iconColor}`}>
                {selectedDept.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedDept.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedDept.category}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
              {selectedDept.description}
            </p>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.departments.modalTitle}
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedDept.equipment.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedDept(null);
                  onOpenMaintenanceModal();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0F4C81] hover:bg-[#0A3357] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.departments.requestSla}</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>

              <button
                onClick={() => setSelectedDept(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                {t.departments.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
