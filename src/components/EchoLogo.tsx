import React from 'react';

interface EchoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const EchoLogo: React.FC<EchoLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  if (size === 'xs') {
    return (
      <div className={`inline-flex flex-col items-start bg-black text-white px-2 py-1 rounded-md border border-neutral-800 tracking-tight font-sans select-none ${className}`}>
        <span className="font-black text-[11px] leading-tight tracking-wider text-white">ECHO 5F.</span>
        {showSubtitle && (
          <span className="text-[6px] tracking-[0.18em] text-neutral-400 font-medium uppercase mt-0.5 whitespace-nowrap">
            FROM SIGNAL TO SYSTEM.
          </span>
        )}
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className={`inline-flex flex-col items-start bg-black text-white px-3 py-1.5 rounded-lg border border-neutral-800 shadow-md tracking-tight font-sans select-none ${className}`}>
        <span className="font-black text-xs leading-none tracking-wider text-white">ECHO 5F.</span>
        {showSubtitle && (
          <span className="text-[7.5px] tracking-[0.2em] text-neutral-400 font-medium uppercase mt-1 whitespace-nowrap">
            FROM SIGNAL TO SYSTEM.
          </span>
        )}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex flex-col items-center justify-center bg-black text-white px-6 py-5 rounded-2xl border border-neutral-800 shadow-2xl tracking-tight font-sans select-none ${className}`}>
        <span className="font-black text-2xl sm:text-3xl leading-none tracking-widest text-white">
          ECHO 5F.
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-xs tracking-[0.28em] text-neutral-300 font-semibold uppercase mt-2.5 whitespace-nowrap">
            FROM SIGNAL TO SYSTEM.
          </span>
        )}
      </div>
    );
  }

  // Default 'md'
  return (
    <div className={`inline-flex flex-col items-start justify-center bg-black text-white px-3.5 py-2 rounded-xl border border-neutral-800 shadow-lg tracking-tight font-sans select-none shrink-0 ${className}`}>
      <span className="font-black text-sm sm:text-base leading-none tracking-wider text-white">
        ECHO 5F.
      </span>
      {showSubtitle && (
        <span className="text-[8px] sm:text-[9px] tracking-[0.22em] text-neutral-400 font-semibold uppercase mt-1 whitespace-nowrap">
          FROM SIGNAL TO SYSTEM.
        </span>
      )}
    </div>
  );
};
