import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface TestimonialAndBookingSplitProps {
  onOpenMaintenanceModal: () => void;
}

export const TestimonialAndBookingSplit: React.FC<TestimonialAndBookingSplitProps> = ({
  onOpenMaintenanceModal,
}) => {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: 1,
      quote:
        'The biomedical SLA support and rapid calibration from CoreMed Tech has been exceptional. Their engineers are prompt, professional, and genuinely dedicated to our hospital uptime.',
      author: 'Dr. Frank Mrema',
      role: 'Medical Superintendent',
      facility: 'Muhimbili National Hospital (MNH)',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      quote:
        'Having our CT and MRI scanners calibrated under traceable ISO 17025 protocols gave our radiology department complete confidence and zero clinical downtime.',
      author: 'Priya Sharma',
      role: 'Head of Clinical Services',
      facility: 'Aga Khan Hospital Dar es Salaam',
      avatar: 'https://images.unsplash.com/photo-1594824813653-431871a2a901?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 3,
      quote:
        'The NeST procurement process was seamless. Delivery, turnkey installation in our operating theatre, and engineer training were executed ahead of schedule.',
      author: 'Eng. Dennis Maro',
      role: 'Director of Biomedical Engineering',
      facility: 'Bugando Medical Centre',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  const hospitalReceptionImage =
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop';

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Testimonials Carousel matching reference */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
                  {t.testimonials.kicker}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {t.testimonials.title}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={prev}
                  className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between relative">
              <Quote className="w-8 h-8 text-blue-200/60 absolute top-5 right-5" />

              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed mb-6 font-normal">
                  "{current.quote}"
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
                <img
                  src={current.avatar}
                  alt={current.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{current.author}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {current.role} · <span className="text-[#0F4C81]">{current.facility}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 pt-1">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-[#0F4C81]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: "Book an Appointment Today" Dark Blue Card matching reference */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#0B1E36] p-6 sm:p-10 text-white flex flex-col justify-between h-full relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="relative z-10 space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.testimonials.verifiedDirector}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {t.testimonials.bookTitle}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {t.testimonials.bookDesc}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenMaintenanceModal}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-bold text-[#0B1E36] bg-white hover:bg-slate-100 rounded-full shadow-lg transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.testimonials.bookCta}</span>
                    <ArrowRight className="w-4 h-4 text-[#0F4C81]" />
                  </button>

                  <a
                    href="tel:+255742296631"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>+255 742 296 631</span>
                  </a>
                </div>
              </div>

              {/* Background Glow & Image */}
              <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none w-96 h-96">
                <img
                  src={hospitalReceptionImage}
                  alt="Hospital Reception"
                  className="w-full h-full object-cover rounded-full mix-blend-overlay"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
