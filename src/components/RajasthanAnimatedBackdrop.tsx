import React from 'react';
import { Sparkles } from 'lucide-react';

interface RajasthanAnimatedBackdropProps {
  currentScene: 'dance' | 'darbar' | 'baraat' | 'courtyard' | 'musicians';
  onSelectScene?: (scene: 'dance' | 'darbar' | 'baraat' | 'courtyard' | 'musicians') => void;
  showSceneSelector?: boolean;
}

export const RajasthanAnimatedBackdrop: React.FC<RajasthanAnimatedBackdropProps> = ({
  currentScene,
  onSelectScene,
  showSceneSelector = true,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Overhead Festive Fairy Light Strings (Warm Amber/Gold) */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          className="w-full h-12 stroke-amber-500/60 fill-none"
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,8 Q125,48 250,8 Q375,50 500,8 Q625,48 750,8 Q875,50 1000,8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Pulsing Fairy Light Bulbs */}
        {[
          { left: '5%', top: '6px', delay: '0s', color: '#FDE68A' },
          { left: '12%', top: '14px', delay: '0.4s', color: '#F59E0B' },
          { left: '20%', top: '22px', delay: '0.8s', color: '#FBBF24' },
          { left: '28%', top: '16px', delay: '1.2s', color: '#FEF08A' },
          { left: '36%', top: '8px', delay: '0.3s', color: '#F59E0B' },
          { left: '44%', top: '18px', delay: '0.7s', color: '#FBBF24' },
          { left: '52%', top: '24px', delay: '1.1s', color: '#FDE68A' },
          { left: '60%', top: '18px', delay: '0.5s', color: '#F59E0B' },
          { left: '68%', top: '8px', delay: '0.9s', color: '#FEF08A' },
          { left: '76%', top: '17px', delay: '0.2s', color: '#FBBF24' },
          { left: '84%', top: '23px', delay: '0.6s', color: '#F59E0B' },
          { left: '92%', top: '12px', delay: '1.0s', color: '#FDE68A' },
        ].map((bulb, idx) => (
          <div
            key={idx}
            className="absolute w-2.5 h-2.5 rounded-full animate-pulse"
            style={{
              left: bulb.left,
              top: bulb.top,
              backgroundColor: bulb.color,
              boxShadow: `0 0 10px 3px ${bulb.color}, 0 0 20px 6px rgba(245, 158, 11, 0.45)`,
              animationDelay: bulb.delay,
              animationDuration: '2.4s',
            }}
          >
            <div className="absolute inset-0.5 rounded-full bg-white opacity-90" />
          </div>
        ))}
      </div>

      {/* 2. Swaying Ornate Royal Palace Brass Lanterns */}
      <div className="absolute top-2 left-4 flex flex-col items-center origin-top animate-sway pointer-events-none">
        <div className="w-[1px] h-10 bg-gradient-to-b from-amber-400/80 to-amber-600" />
        {/* Brass Lantern Crown */}
        <div className="w-5 h-2 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-t-sm shadow-md border-t border-amber-300" />
        {/* Hexagonal Glass Chamber with Glowing Candle */}
        <div className="relative w-6 h-8 bg-amber-950/70 backdrop-blur-xs border border-amber-400/80 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)]">
          {/* Inner Flickering Flame */}
          <div className="w-2.5 h-3.5 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 animate-flicker shadow-[0_0_12px_#F59E0B]" />
          {/* Corner Jaali Bars */}
          <div className="absolute inset-x-1 inset-y-0 flex justify-between pointer-events-none">
            <div className="w-[0.5px] h-full bg-amber-400/60" />
            <div className="w-[0.5px] h-full bg-amber-400/60" />
          </div>
        </div>
        {/* Base Bell Finial */}
        <div className="w-4 h-1.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-b-sm" />
        <div className="w-1 h-2 bg-amber-400 rounded-full mt-0.5" />
      </div>

      {/* Right Swaying Lantern */}
      <div
        className="absolute top-2 right-4 flex flex-col items-center origin-top animate-sway pointer-events-none"
        style={{ animationDelay: '1.2s' }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-amber-400/80 to-amber-600" />
        <div className="w-5 h-2 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-t-sm shadow-md border-t border-amber-300" />
        <div className="relative w-6 h-8 bg-amber-950/70 backdrop-blur-xs border border-amber-400/80 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)]">
          <div className="w-2.5 h-3.5 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 animate-flicker shadow-[0_0_12px_#F59E0B]" />
          <div className="absolute inset-x-1 inset-y-0 flex justify-between pointer-events-none">
            <div className="w-[0.5px] h-full bg-amber-400/60" />
            <div className="w-[0.5px] h-full bg-amber-400/60" />
          </div>
        </div>
        <div className="w-4 h-1.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-b-sm" />
        <div className="w-1 h-2 bg-amber-400 rounded-full mt-0.5" />
      </div>

      {/* 3. Floating Golden Sparks & Fireflies */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: '15%', bottom: '20%', delay: '0s', dur: '6s', size: 3 },
          { left: '35%', bottom: '40%', delay: '1.5s', dur: '7s', size: 2.5 },
          { left: '65%', bottom: '25%', delay: '3s', dur: '8s', size: 3.5 },
          { left: '80%', bottom: '50%', delay: '2s', dur: '6.5s', size: 2.8 },
          { left: '50%', bottom: '15%', delay: '4.5s', dur: '7.5s', size: 3 },
        ].map((mote, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-amber-300 animate-float"
            style={{
              left: mote.left,
              bottom: mote.bottom,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              boxShadow: '0 0 8px 2px #FDE68A, 0 0 16px 4px #F59E0B',
              animationDuration: mote.dur,
              animationDelay: mote.delay,
            }}
          />
        ))}
      </div>

      {/* 4. Ornate Sandstone / Gold Scalloped Rajputana Jharokha Arch Borders */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-900/60 to-transparent flex items-center justify-center">
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#F59E0B]" />
      </div>

      {/* 5. Interactive 3D Rajasthan Scene Selector (if enabled) */}
      {showSceneSelector && onSelectScene && (
        <div className="absolute top-14 inset-x-0 z-30 flex justify-center px-2 pointer-events-auto">
          <div className="bg-black/75 backdrop-blur-md px-2 py-1 rounded-full border border-amber-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center gap-1 max-w-full overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-cinzel font-bold text-amber-300 px-2 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
              3D Rajasthan:
            </span>

            {[
              { id: 'dance', label: 'Jharokha Dance', icon: '🦚' },
              { id: 'darbar', label: 'Rathore Darbar', icon: '⚔️' },
              { id: 'baraat', label: 'Royal Baraat', icon: '🐎' },
              { id: 'courtyard', label: 'Diwan Courtyard', icon: '🏰' },
              { id: 'musicians', label: 'Folk Musicians', icon: '🥁' },
            ].map((scene) => (
              <button
                key={scene.id}
                onClick={() => onSelectScene(scene.id as 'dance' | 'darbar' | 'baraat' | 'courtyard' | 'musicians')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wide transition-all duration-300 flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  currentScene === scene.id
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 shadow-[0_0_12px_rgba(245,158,11,0.7)] scale-105'
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
