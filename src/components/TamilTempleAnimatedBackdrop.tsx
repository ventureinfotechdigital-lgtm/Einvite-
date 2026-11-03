import React from 'react';
import { Sparkles } from 'lucide-react';

export type TamilSceneType = 'mandapam' | 'mangalyam' | 'metti' | 'maalai' | 'jasmine' | 'paani';

interface TamilTempleAnimatedBackdropProps {
  currentScene: TamilSceneType;
  onSelectScene?: (scene: TamilSceneType) => void;
  showSceneSelector?: boolean;
}

export const TamilTempleAnimatedBackdrop: React.FC<TamilTempleAnimatedBackdropProps> = ({
  currentScene,
  onSelectScene,
  showSceneSelector = true,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Auspicious Maavilai Toran (Fresh Green Mango Leaves) & Fragrant Jasmine Garland Strings */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        {/* Decorative Golden String */}
        <svg
          className="w-full h-10 stroke-amber-400/80 fill-none"
          viewBox="0 0 1000 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0,6 Q125,32 250,6 Q375,34 500,6 Q625,32 750,6 Q875,34 1000,6"
            strokeWidth="1.5"
          />
        </svg>

        {/* Hanging Maavilai (Mango Leaves) & Fragrant Jasmine Buds */}
        {[
          { left: '4%', delay: '0s', label: '🌿' },
          { left: '10%', delay: '0.4s', label: '🌸' },
          { left: '17%', delay: '0.8s', label: '🌿' },
          { left: '25%', delay: '0.2s', label: '🔔' },
          { left: '33%', delay: '0.6s', label: '🌿' },
          { left: '41%', delay: '1.0s', label: '🌸' },
          { left: '49%', delay: '0.3s', label: '🪔' },
          { left: '57%', delay: '0.7s', label: '🌿' },
          { left: '65%', delay: '1.1s', label: '🔔' },
          { left: '73%', delay: '0.5s', label: '🌿' },
          { left: '81%', delay: '0.9s', label: '🌸' },
          { left: '89%', delay: '0.2s', label: '🌿' },
          { left: '96%', delay: '0.6s', label: '🔔' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="absolute flex flex-col items-center animate-sway"
            style={{
              left: item.left,
              top: '4px',
              animationDelay: item.delay,
              animationDuration: '3.6s',
            }}
          >
            <div className="w-[1px] h-3 bg-gradient-to-b from-amber-400 to-amber-600" />
            <span className="text-sm select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Left Glowing Brass Kuthuvilakku (Traditional Temple Oil Lamp) */}
      <div className="absolute bottom-4 left-3 flex flex-col items-center pointer-events-none opacity-90 z-20">
        {/* Top Flame of Kuthuvilakku */}
        <div className="relative flex flex-col items-center">
          <div className="w-3 h-4 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 animate-flicker shadow-[0_0_15px_#F59E0B,0_0_25px_#FBBF24]" />
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-95 -mt-2" />
        </div>
        {/* Ornate Annapakshi / Lamp Head */}
        <div className="w-5 h-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 rounded-t-full shadow-md border-t border-amber-200" />
        {/* Lamp Tier 1 Oil Basin */}
        <div className="w-8 h-2 bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-800 rounded-b-lg border-b border-amber-400 shadow-sm" />
        {/* Middle Pillar */}
        <div className="w-2.5 h-10 bg-gradient-to-b from-amber-500 via-yellow-400 to-amber-700 shadow-inner" />
        {/* Lamp Tier 2 */}
        <div className="w-7 h-2 bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-800 rounded-lg" />
        {/* Stem */}
        <div className="w-3 h-8 bg-gradient-to-b from-amber-600 via-yellow-400 to-amber-800" />
        {/* Sturdy Circular Base */}
        <div className="w-10 h-3 bg-gradient-to-r from-amber-800 via-yellow-400 to-amber-900 rounded-full border-t border-amber-300 shadow-lg" />
        {/* Floating Marigold Petals at the Base */}
        <div className="flex gap-1 -mt-1">
          <span className="text-[10px]">🌼</span>
          <span className="text-[10px]">🌸</span>
          <span className="text-[10px]">🌼</span>
        </div>
      </div>

      {/* 3. Right Glowing Brass Kuthuvilakku */}
      <div className="absolute bottom-4 right-3 flex flex-col items-center pointer-events-none opacity-90 z-20">
        <div className="relative flex flex-col items-center">
          <div
            className="w-3 h-4 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 animate-flicker shadow-[0_0_15px_#F59E0B,0_0_25px_#FBBF24]"
            style={{ animationDelay: '0.4s' }}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-95 -mt-2" />
        </div>
        <div className="w-5 h-2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 rounded-t-full shadow-md border-t border-amber-200" />
        <div className="w-8 h-2 bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-800 rounded-b-lg border-b border-amber-400 shadow-sm" />
        <div className="w-2.5 h-10 bg-gradient-to-b from-amber-500 via-yellow-400 to-amber-700 shadow-inner" />
        <div className="w-7 h-2 bg-gradient-to-r from-amber-700 via-yellow-300 to-amber-800 rounded-lg" />
        <div className="w-3 h-8 bg-gradient-to-b from-amber-600 via-yellow-400 to-amber-800" />
        <div className="w-10 h-3 bg-gradient-to-r from-amber-800 via-yellow-400 to-amber-900 rounded-full border-t border-amber-300 shadow-lg" />
        <div className="flex gap-1 -mt-1">
          <span className="text-[10px]">🌼</span>
          <span className="text-[10px]">🌸</span>
          <span className="text-[10px]">🌼</span>
        </div>
      </div>

      {/* 4. Floating Temple Rose & Jasmine Petals and Golden Embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: '12%', bottom: '25%', delay: '0s', dur: '5.5s', size: 3, color: '#FDE68A' },
          { left: '28%', bottom: '45%', delay: '1.2s', dur: '6.5s', size: 2.5, color: '#F59E0B' },
          { left: '50%', bottom: '20%', delay: '2.4s', dur: '7.0s', size: 3.2, color: '#FEF08A' },
          { left: '72%', bottom: '35%', delay: '0.8s', dur: '6.0s', size: 2.8, color: '#F59E0B' },
          { left: '86%', bottom: '55%', delay: '1.8s', dur: '7.5s', size: 3.5, color: '#FBBF24' },
        ].map((mote, idx) => (
          <div
            key={idx}
            className="absolute rounded-full animate-float"
            style={{
              left: mote.left,
              bottom: mote.bottom,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              backgroundColor: mote.color,
              boxShadow: `0 0 8px 2px ${mote.color}, 0 0 16px 4px #F59E0B`,
              animationDuration: mote.dur,
              animationDelay: mote.delay,
            }}
          />
        ))}
      </div>

      {/* 5. Dravidian Temple Pillar Gold Arch Border at Top */}
      <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-amber-900/70 to-transparent flex items-center justify-center">
        <div className="w-56 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#F59E0B]" />
      </div>

      {/* 6. Interactive 3D Tamil Scene Selector Tabs (With All 6 User-Requested Complete Images) */}
      {showSceneSelector && onSelectScene && (
        <div className="absolute top-14 inset-x-0 z-30 flex justify-center px-2 pointer-events-auto">
          <div className="bg-[#140307]/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-amber-400/70 shadow-[0_4px_25px_rgba(0,0,0,0.7)] flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-cinzel font-bold text-amber-300 px-2 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
              Tamil Temple:
            </span>

            {[
              { id: 'mandapam', label: 'Mandapam', icon: '🛕' },
              { id: 'mangalyam', label: 'Thali Dharanam', icon: '💛' },
              { id: 'metti', label: 'Metti & Ammi', icon: '💍' },
              { id: 'maalai', label: 'Maalai Maatral', icon: '🌸' },
              { id: 'jasmine', label: 'Malli Poo', icon: '🌿' },
              { id: 'paani', label: 'Paani Grahanam', icon: '🤝' },
            ].map((scene) => (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene.id as TamilSceneType)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wide transition-all duration-300 flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  currentScene === scene.id
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 shadow-[0_0_14px_rgba(245,158,11,0.85)] scale-105'
                    : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/10'
                }`}
              >
                <span>{scene.icon}</span>
                <span>{scene.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
