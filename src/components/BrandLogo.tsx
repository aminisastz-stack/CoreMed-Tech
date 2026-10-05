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
      ? 'h-10 max-h-10 sm:h-12 sm:max-h-12'
      : size === 'lg'
      ? 'h-20 max-h-20 sm:h-28 sm:max-h-28 lg:h-32 lg:max-h-32'
      : size === 'xl'
      ? 'h-24 max-h-24 sm:h-36 sm:max-h-36 lg:h-40 lg:max-h-40'
      : 'h-12 max-h-12 sm:h-18 sm:max-h-18 lg:h-[5.5rem] lg:max-h-[5.5rem]';

  const logoMaxWidth =
    size === 'sm'
      ? 'max-w-[180px] sm:max-w-[240px]'
      : size === 'lg'
      ? 'max-w-[340px] sm:max-w-[540px] lg:max-w-[650px]'
      : size === 'xl'
      ? 'max-w-[420px] sm:max-w-[680px] lg:max-w-[800px]'
      : 'max-w-[190px] sm:max-w-[340px] lg:max-w-[480px]';

  const iconBoxSize =
    size === 'sm'
      ? 'w-8 h-8 sm:w-10 sm:h-10'
      : size === 'lg' || size === 'xl'
      ? 'w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20'
      : 'w-10 h-10 sm:w-14 sm:h-14';

  const iconSize =
    size === 'sm'
      ? 'w-4.5 h-4.5 sm:w-5.5 sm:h-5.5'
      : size === 'lg' || size === 'xl'
      ? 'w-7 h-7 sm:w-9 sm:h-9'
      : 'w-5 h-5 sm:w-7 sm:h-7';

  const textSize =
    size === 'sm'
      ? 'text-sm sm:text-base'
      : size === 'lg' || size === 'xl'
      ? 'text-xl sm:text-2xl lg:text-3xl'
      : 'text-sm sm:text-lg lg:text-xl';

  const tagSize =
    size === 'sm'
      ? 'text-[8px] sm:text-[9px]'
      : size === 'lg' || size === 'xl'
      ? 'text-[10px] sm:text-xs'
      : 'text-[8px] sm:text-[10px]';

  if (customLogo) {
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`flex items-center justify-center transition-all ${
            theme === 'dark' ? 'bg-white/10 backdrop-blur-xs p-1.5 rounded-2xl' : 'bg-transparent'
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
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div
        className={`${iconBoxSize} rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0A3357] flex items-center justify-center text-white shadow-md shadow-[#0F4C81]/20 shrink-0`}
      >
        <Activity className={`${iconSize} text-emerald-400`} />
      </div>
      {!iconOnly && (
        <div className={`flex flex-col text-left min-w-0 ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
          <span
            className={`${textSize} font-bold tracking-tight font-display truncate ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {companyName}
          </span>
          <span
            className={`${tagSize} font-mono tracking-wider uppercase font-semibold text-emerald-600 truncate`}
          >
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
};
