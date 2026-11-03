import React from 'react';

interface KaleereinFloralDividerProps {
  variant?: 'kaleerein' | 'floral' | 'both' | 'marigold';
  label?: string;
  themePrimary?: string;
  themeAccent?: string;
  themeColor?: string;
  isChristian?: boolean;
  isMuslim?: boolean;
  isRajasthan?: boolean;
  isTamil?: boolean;
}

export const KaleereinFloralDivider: React.FC<KaleereinFloralDividerProps> = ({
  variant = 'both',
  label,
  themePrimary = '#850B1B',
  themeAccent = '#D4AF37',
  isChristian = false,
  isMuslim = false,
  isRajasthan = false,
  isTamil = false,
}) => {
  // If Tamil Temple Wedding Theme: Render Auspicious Maavilai Toran, Madurai Malli Poo Jasmine, Brass Temple Bells & Kuthuvilakku
  if (isTamil) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full py-4 my-2 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20"
      >
        {/* Maavilai, Malli Poo & Temple Brass Bell Festoon */}
        <div className="relative w-full max-w-lg flex items-center justify-center gap-2 px-4 mb-1">
          {/* Left gold decorative line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F59E0B] to-[#FBBF24]" />

          {/* Dravidian Temple Medallion Pill */}
          <div className="flex items-center gap-2 bg-[#1A0309]/95 px-4 py-1.5 rounded-full border border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <span className="text-xs" title="Fresh Mango Leaf">🌿</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" title="Maavilai" />
            <span className="text-xs" title="Madurai Malli Jasmine">🌸</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-300" title="Manjal Turmeric" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 flex items-center justify-center text-[11px] text-amber-950 font-bold shadow-md">
              🪔
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-300" title="Manjal Turmeric" />
            <span className="text-xs" title="Madurai Malli Jasmine">🌸</span>
            <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_#DC2626]" title="Temple Kumkum" />
            <span className="text-xs" title="Fresh Mango Leaf">🌿</span>
          </div>

          {/* Right gold decorative line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F59E0B] to-[#FBBF24]" />
        </div>

        {label && (
          <span className="text-[10px] font-cinzel font-bold uppercase tracking-[0.25em] text-amber-300 bg-[#1A0309]/90 px-3.5 py-0.5 rounded-full border border-amber-400/60 mt-1 shadow-xs">
            {label}
          </span>
        )}

        {/* Hanging Brass Temple Bells & Fresh Jasmine Strings */}
        <div className="relative w-full max-w-sm flex justify-around items-start pt-1 px-8 opacity-90">
          {[0, 0.4, 0.8, 1.2, 0.6].map((delay, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center animate-sway"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="w-[1px] h-3.5 bg-gradient-to-b from-amber-400 to-amber-600" />
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 shadow-xs flex items-center justify-center text-[9px] text-amber-950 font-bold">
                🔔
              </div>
              <span className="w-0.5 h-2 bg-red-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#FBBF24]" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  // If Royal Rajasthan Wedding Theme: Render Regal Peacock Feather, Marigold Toran, Brass Bells & Velvet Tassels
  if (isRajasthan) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full py-4 my-2 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20"
      >
        {/* Peacock, Marigold Toran & Royal Brass Bells */}
        <div className="relative w-full max-w-lg flex items-center justify-center gap-2 px-4 mb-1">
          {/* Left gold decorative line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F59E0B] to-[#FBBF24]" />

          {/* Royal Rajputana Pill */}
          <div className="flex items-center gap-2 bg-[#1A050B]/95 px-4 py-1.5 rounded-full border border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
            <span className="text-xs" title="Royal Peacock">🦚</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" title="Kesariya Marigold" />
            <span className="text-xs" title="Red Rose">🌹</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 border border-amber-300" title="Emerald Kundan" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 flex items-center justify-center text-[11px] text-amber-950 font-bold shadow-md">
              👑
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 border border-amber-300" title="Emerald Kundan" />
            <span className="text-xs" title="Red Rose">🌹</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" title="Kesariya Marigold" />
            <span className="text-xs" title="Royal Peacock">🦚</span>
          </div>

          {/* Right gold decorative line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F59E0B] to-[#FBBF24]" />
        </div>

        {label && (
          <span className="text-[10px] font-cinzel font-bold uppercase tracking-[0.25em] text-amber-300 bg-[#1A050B]/90 px-3.5 py-0.5 rounded-full border border-amber-400/60 mt-1 shadow-xs">
            {label}
          </span>
        )}

        {/* Hanging brass bells & royal crimson tassels */}
        <div className="relative w-full max-w-sm flex justify-around items-start pt-1 px-8 opacity-90">
          {[0, 0.4, 0.8, 1.2, 0.6].map((delay, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center animate-sway"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="w-[1px] h-3.5 bg-gradient-to-b from-amber-400 to-amber-600" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 shadow-xs flex items-center justify-center text-[8px] text-amber-950 font-bold">
                🔔
              </div>
              <span className="w-0.5 h-2 bg-red-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#FBBF24]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If Muslim Wedding Theme: Render Elegant Crescent Moon, Brass Lanterns & White Jasmine / Mogra Garland
  if (isMuslim) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full py-4 my-2 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20"
      >
        {/* Crescent Moon, Lanterns & Jasmine Festoon */}
        <div className="relative w-full max-w-lg flex items-center justify-center gap-2 px-4 mb-1">
          {/* Left gold decorative line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F59E0B] to-[#FBBF24]" />

          {/* Crescent Moon, Mogra, Gold Lantern & Starlight Pill */}
          <div className="flex items-center gap-2 bg-[#062D1F]/95 px-4 py-1.5 rounded-full border border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.3)]">
            <span className="text-xs" title="Crescent Moon">🌙</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#FBBF24]" />
            <span className="text-xs" title="White Jasmine / Mogra">🤍</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 border border-amber-300" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-[11px] text-amber-950 font-bold shadow-sm">
              ✨
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 border border-amber-300" />
            <span className="text-xs" title="Blush Rose">🌸</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#FBBF24]" />
            <span className="text-xs" title="Lantern">🏮</span>
          </div>

          {/* Right gold decorative line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F59E0B] to-[#FBBF24]" />
        </div>

        {label && (
          <span className="text-[10px] font-cinzel font-bold uppercase tracking-[0.25em] text-amber-300 bg-black/75 px-3 py-0.5 rounded-full border border-amber-400/50 mt-1 shadow-xs">
            {label}
          </span>
        )}

        {/* Hanging golden star motes & pearls */}
        <div className="relative w-full max-w-sm flex justify-around items-start pt-1 px-8 opacity-90">
          {[0, 0.3, 0.7, 1.1, 0.5].map((delay, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center animate-sway"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="w-[1px] h-3 bg-gradient-to-b from-amber-400 to-emerald-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-500 shadow-xs flex items-center justify-center text-[7px] text-amber-950 font-bold">
                ⭐
              </div>
              <span className="w-0.5 h-2 bg-amber-300/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#FFF]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If Christian Wedding Theme: Render Elegant Cathedral White Rose & Gold Bell Garland
  if (isChristian) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full py-4 my-2 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20"
      >
        {/* Cathedral White Rose & Satin Pearl Festoon */}
        <div className="relative w-full max-w-lg flex items-center justify-center gap-2 px-4 mb-1">
          {/* Left subtle gold line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FBBF24]" />

          {/* White Rose, Ivory Ribbons & Gold Bell Garland */}
          <div className="flex items-center gap-2 bg-[#1C102A]/90 px-4 py-1.5 rounded-full border border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <span className="text-xs" title="White Lily">🕊️</span>
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
            <span className="text-xs" title="White Garden Rose">🤍</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 border border-amber-400" />
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center text-[10px] text-amber-950 font-bold shadow-xs">
              🔔
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 border border-amber-400" />
            <span className="text-xs" title="White Garden Rose">🤍</span>
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
            <span className="text-xs" title="White Lily">🕊️</span>
          </div>

          {/* Right subtle gold line */}
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FBBF24]" />
        </div>

        {label && (
          <span className="text-[10px] font-cinzel font-bold uppercase tracking-[0.25em] text-amber-300 bg-black/60 px-3 py-0.5 rounded-full border border-amber-400/40 mt-1 shadow-xs">
            {label}
          </span>
        )}

        {/* Subtle hanging white ribbons & satin pearls */}
        <div className="relative w-full max-w-sm flex justify-around items-start pt-1 px-8 opacity-85">
          {[0, 0.4, 0.8, 1.2, 0.6].map((delay, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center animate-sway"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="w-[1px] h-3 bg-gradient-to-b from-amber-300 to-white/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white via-amber-100 to-amber-300 shadow-xs flex items-center justify-center text-[7px] text-amber-900 font-bold">
                ✨
              </div>
              <span className="w-0.5 h-2 bg-amber-200/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-2xs" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Traditional Indian / North Indian Theme: Marigold & Hanging Kaleerein
  return (
    <div
      aria-hidden="true"
      className="relative w-full py-4 my-2 overflow-hidden flex flex-col items-center select-none pointer-events-none z-20"
    >
      {/* Top Rose & Marigold Floral Festoon String */}
      <div className="relative w-full max-w-lg flex items-center justify-center gap-1.5 px-4 mb-2">
        {/* Left gold decorative line */}
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F59E0B]" />

        {/* Marigold & Rose floral chain garland */}
        <div className="flex items-center gap-1.5 bg-[#FFFDF7]/90 px-3 py-1 rounded-full border border-amber-300/80 shadow-xs">
          {/* Rose 1 */}
          <span className="text-sm" title="Rose">🌹</span>
          {/* Genda (Marigold) 1 */}
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" title="Marigold" />
          {/* Pearl */}
          <span className="w-1.5 h-1.5 rounded-full bg-amber-100 border border-amber-300 shadow-2xs" />
          {/* Blush Rose */}
          <span className="text-xs" title="Blush Rose">🌸</span>
          {/* Central Gold Bell / Leaf */}
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center text-[9px] text-amber-950 font-bold shadow-xs">
            ✨
          </div>
          {/* Blush Rose */}
          <span className="text-xs" title="Blush Rose">🌸</span>
          {/* Pearl */}
          <span className="w-1.5 h-1.5 rounded-full bg-amber-100 border border-amber-300 shadow-2xs" />
          {/* Genda (Marigold) 2 */}
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" title="Marigold" />
          {/* Rose 2 */}
          <span className="text-sm" title="Rose">🌹</span>
        </div>

        {/* Right gold decorative line */}
        <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#F59E0B]" />
      </div>

      {/* Label if provided */}
      {label && (
        <span className="text-[10px] font-cinzel font-bold uppercase tracking-[0.25em] text-amber-900 bg-amber-100/70 px-3 py-0.5 rounded-full border border-amber-300/60 mb-2 shadow-2xs">
          {label}
        </span>
      )}

      {/* Hanging Golden Kaleerein Strings with Swaying Animation */}
      <div className="relative w-full max-w-md flex justify-around items-start pt-1 px-8">
        {/* Kaleera 1 (Left Outer) */}
        <div className="flex flex-col items-center animate-sway" style={{ animationDelay: '0s' }}>
          <div className="w-[1px] h-3 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="w-4 h-2.5 rounded-t-full bg-gradient-to-b from-amber-200 to-amber-500 border-t border-amber-200 shadow-xs" />
          <div className="flex gap-1 -mt-0.5">
            <span className="w-1 h-3 rounded-full bg-amber-300 shadow-2xs" />
            <span className="w-1 h-4 rounded-full bg-amber-400 shadow-2xs" />
            <span className="w-1 h-3 rounded-full bg-amber-300 shadow-2xs" />
          </div>
        </div>

        {/* Kaleera 2 (Left Inner - Detailed Dome & Pearls) */}
        <div className="flex flex-col items-center animate-sway" style={{ animationDelay: '0.6s' }}>
          <div className="w-[1.5px] h-4 bg-gradient-to-b from-amber-300 to-amber-600" />
          {/* Umbrella dome */}
          <div className="w-6 h-3.5 rounded-t-full bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 border border-amber-200 shadow-sm flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white opacity-80" />
          </div>
          {/* Dangling leaves and pearl strings */}
          <div className="flex gap-1 pt-0.5">
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-2 bg-amber-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
            </div>
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-3 bg-amber-400" />
              <span className="w-1.5 h-2 rounded-full bg-amber-500 shadow-2xs" />
            </div>
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-2 bg-amber-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
            </div>
          </div>
        </div>

        {/* Center Grand Royal Kaleera */}
        <div className="flex flex-col items-center animate-sway" style={{ animationDelay: '1.2s' }}>
          <div className="w-[1.5px] h-3 bg-amber-400" />
          {/* Gold Om / Lotus Medallion */}
          <div className="w-7 h-4 rounded-t-full bg-gradient-to-b from-amber-100 via-yellow-400 to-amber-600 border-t border-amber-100 shadow-md flex items-center justify-center">
            <span className="text-[9px] text-amber-950 font-bold">✨</span>
          </div>
          {/* Hanging drops */}
          <div className="flex gap-1.5 pt-0.5">
            <div className="flex flex-col items-center">
              <span className="w-[1px] h-2.5 bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            </div>
            <div className="flex flex-col items-center">
              <span className="w-[1px] h-4 bg-amber-500" />
              <span className="w-2 h-2.5 rounded-full bg-gradient-to-b from-yellow-300 to-amber-600 shadow-xs" />
            </div>
            <div className="flex flex-col items-center">
              <span className="w-[1px] h-2.5 bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            </div>
          </div>
        </div>

        {/* Kaleera 4 (Right Inner) */}
        <div className="flex flex-col items-center animate-sway" style={{ animationDelay: '0.4s' }}>
          <div className="w-[1.5px] h-4 bg-gradient-to-b from-amber-300 to-amber-600" />
          <div className="w-6 h-3.5 rounded-t-full bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 border border-amber-200 shadow-sm flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white opacity-80" />
          </div>
          <div className="flex gap-1 pt-0.5">
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-2 bg-amber-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
            </div>
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-3 bg-amber-400" />
              <span className="w-1.5 h-2 rounded-full bg-amber-500 shadow-2xs" />
            </div>
            <div className="flex flex-col items-center">
              <span className="w-0.5 h-2 bg-amber-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
            </div>
          </div>
        </div>

        {/* Kaleera 5 (Right Outer) */}
        <div className="flex flex-col items-center animate-sway" style={{ animationDelay: '0.9s' }}>
          <div className="w-[1px] h-3 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="w-4 h-2.5 rounded-t-full bg-gradient-to-b from-amber-200 to-amber-500 border-t border-amber-200 shadow-xs" />
          <div className="flex gap-1 -mt-0.5">
            <span className="w-1 h-3 rounded-full bg-amber-300 shadow-2xs" />
            <span className="w-1 h-4 rounded-full bg-amber-400 shadow-2xs" />
            <span className="w-1 h-3 rounded-full bg-amber-300 shadow-2xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
