import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  coupleNames?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  coupleNames = 'pulkit-weds-shreya.wedding',
}) => {
  return (
    <div className="relative flex items-center justify-center p-2 sm:p-4">
      {/* Smartphone Body Outer Chassis */}
      <div className="relative w-[375px] sm:w-[390px] h-[780px] sm:h-[820px] bg-[#1c1c1e] rounded-[52px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_0_12px_#2c2c2e,0_0_0_14px_#1c1c1e] border border-neutral-700/60 flex flex-col justify-between overflow-hidden">
        
        {/* Dynamic Island / Speaker Pill at Top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 w-28 h-6 bg-black rounded-full border border-neutral-800 shadow-sm pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/60" />
          </div>
          <div className="w-2 h-2 rounded-full bg-neutral-900" />
        </div>

        {/* Top Status Bar (Time, Battery, Wifi icons) */}
        <div className="relative z-40 w-full h-9 flex items-center justify-between px-7 text-[12px] font-semibold text-white/90 select-none pointer-events-none">
          <span>14:02</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-tighter">5G</span>
            {/* Battery icon */}
            <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-0.5 flex items-center">
              <div className="h-full w-3.5 bg-white rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* The Screen Display Area where the Wedding Website runs */}
        <div className="relative flex-1 w-full h-[calc(100%-80px)] rounded-[38px] overflow-hidden bg-black shadow-inner">
          {children}
        </div>

        {/* Bottom Safari / Chrome Navigation Bar matching video (0001.github.io / custom link) */}
        <div className="relative z-40 w-full h-11 flex items-center justify-between px-4 text-white/70 select-none pt-1">
          <div className="flex items-center gap-2 flex-1 max-w-[240px] mx-auto bg-neutral-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-700 text-[11px] text-neutral-300 shadow-inner">
            <span className="text-neutral-400">🔒</span>
            <span className="truncate font-mono">{coupleNames}</span>
          </div>
          {/* iOS Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
