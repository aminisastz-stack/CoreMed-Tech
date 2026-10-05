import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Quote, ChevronLeft, ChevronRight, Star, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1">
              <span>04. Clinical Trust & Validation</span>
              <span aria-hidden="true">·</span>
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              What Hospital Directors & Biomedical Leaders Say
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-6 right-6 text-slate-100 pointer-events-none">
            <Quote className="w-24 h-24 text-slate-100" />
          </div>

          <div className="relative z-10 max-w-3xl">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-6 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="ml-2 text-xs font-semibold text-slate-500">
                Verified Hospital SLA Partner
              </span>
            </div>

            <blockquote className="text-lg sm:text-xl text-slate-800 font-medium leading-relaxed mb-8">
              "{current.quote}"
            </blockquote>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#0F4C81] text-emerald-300 font-bold flex items-center justify-center text-lg">
                {current.author.charAt(3) || 'D'}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {current.author}
                </h4>
                <p className="text-xs text-slate-500">
                  {current.role} · <strong className="text-[#0F4C81] font-semibold">{current.facility}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === i ? 'w-6 bg-[#0F4C81]' : 'w-2 bg-slate-200'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
