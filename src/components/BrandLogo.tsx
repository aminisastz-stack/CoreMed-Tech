import React from 'react';
import { useBrand } from '../context/BrandContext';
import { Activity } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  hideTextOnMobile?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  theme = 'light',
  hideTextOnMobile = false,
}) => {
  const { customLogo, logoScale = 1.15, companyName, tagline } = useBrand();

  const logoHeight =
    size === 'sm'
      ? 'h-12 max-h-12 sm:h-14 sm:max-h-14'
      : size === 'lg'
      ? 'h-24 max-h-24 sm:h-28 sm:max-h-28 lg:h-32 lg:max-h-32'
      : size === 'xl'
      ? 'h-28 max-h-28 sm:h-36 sm:max-h-36 lg:h-40 lg:max-h-40'
      : 'h-20 max-h-20 sm:h-24 sm:max-h-24 lg:h-[6.5rem] lg:max-h-[6.5rem]';

  const logoMaxWidth =
    size === 'sm'
      ? 'max-w-[240px] sm:max-w-[280px]'
      : size === 'lg'
      ? 'max-w-[460px] sm:max-w-[560px] lg:max-w-[650px]'
      : size === 'xl'
      ? 'max-w-[560px] sm:max-w-[700px] lg:max-w-[800px]'
      : 'max-w-[360px] sm:max-w-[480px] lg:max-w-[560px]';

  const iconBoxSize =
    size === 'sm'
      ? 'w-10 h-10'
      : size === 'lg' || size === 'xl'
      ? 'w-18 h-18 sm:w-20 sm:h-20'
      : 'w-14 h-14 sm:w-16 sm:h-16';
  const iconSize =
    size === 'sm'
      ? 'w-5.5 h-5.5'
      : size === 'lg' || size === 'xl'
      ? 'w-9 h-9 sm:w-10 sm:h-10'
      : 'w-7 h-7 sm:w-8 sm:h-8';
  const textSize =
    size === 'sm'
      ? 'text-base'
      : size === 'lg' || size === 'xl'
      ? 'text-2xl sm:text-3xl'
      : 'text-xl sm:text-2xl';
  const tagSize =
    size === 'sm'
      ? 'text-[9px]'
      : size === 'lg' || size === 'xl'
      ? 'text-xs'
      : 'text-[10px] sm:text-[11px]';

  if (customLogo) {
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`flex items-center justify-center transition-all ${
            theme === 'dark' ? 'bg-white/10 backdrop-blur-xs p-2 rounded-2xl' : 'bg-transparent'
          }`}
        >
          <img
            src={customLogo}
            alt={companyName}
            style={{
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: 'left center',
            }}
            className={`${logoHeight} ${logoMaxWidth} w-auto object-contain transition-all duration-200 drop-shadow-xs`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div
        className={`${iconBoxSize} rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0A3357] flex items-center justify-center text-white shadow-md shadow-[#0F4C81]/20 shrink-0`}
      >
        <Activity className={`${iconSize} text-emerald-400`} />
      </div>
      {!iconOnly && (
        <div className={`flex flex-col text-left ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <span
            className={`${textSize} font-bold tracking-tight font-display ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            COREMED <span className={theme === 'dark' ? 'text-emerald-400' : 'text-[#0F4C81]'}>TECH</span>
          </span>
          <span
            className={`${tagSize} uppercase tracking-widest font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-emerald-600'
            }`}
          >
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
};

