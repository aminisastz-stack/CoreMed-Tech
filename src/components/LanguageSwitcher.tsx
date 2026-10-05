import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'mobile' | 'footer';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'navbar' }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full">
        {languages.map((l) => {
          const isActive = l.code === language;
          return (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-[#0F4C81] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span className="text-sm">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-slate-400" />
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                l.code === language
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.flag} {l.shortLabel}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all shadow-xs cursor-pointer active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / Badilisha Lugha / Changer de langue"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="font-extrabold text-[#0F4C81]">{currentLang.shortLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-2xl shadow-xl bg-white ring-1 ring-black/5 divide-y divide-slate-100 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-150 p-1 border border-slate-100">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select Language
          </div>
          <div className="py-1">
            {languages.map((l) => {
              const isSelected = l.code === language;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition ${
                    isSelected
                      ? 'bg-blue-50/80 text-[#0F4C81] font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
