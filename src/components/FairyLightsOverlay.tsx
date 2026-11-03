import React from 'react';

export const FairyLightsOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.9 }) => {
  // Generate festive fairy light bulbs along draped festoon cords
  const lights = [
    { left: '4%', top: '6px', color: '#FDE68A', delay: '0s', size: 10 },
    { left: '11%', top: '14px', color: '#F59E0B', delay: '0.4s', size: 11 },
    { left: '18%', top: '22px', color: '#FBBF24', delay: '0.8s', size: 10 },
    { left: '26%', top: '16px', color: '#FEF08A', delay: '1.2s', size: 12 },
    { left: '33%', top: '8px', color: '#F59E0B', delay: '0.3s', size: 9 },
    { left: '40%', top: '18px', color: '#FBBF24', delay: '0.7s', size: 11 },
    { left: '48%', top: '24px', color: '#FDE68A', delay: '1.1s', size: 12 },
    { left: '56%', top: '18px', color: '#F59E0B', delay: '0.5s', size: 10 },
    { left: '64%', top: '8px', color: '#FEF08A', delay: '0.9s', size: 11 },
    { left: '71%', top: '17px', color: '#FBBF24', delay: '0.2s', size: 10 },
    { left: '78%', top: '23px', color: '#F59E0B', delay: '0.6s', size: 12 },
    { left: '85%', top: '15px', color: '#FDE68A', delay: '1.0s', size: 10 },
    { left: '92%', top: '7px', color: '#FBBF24', delay: '1.4s', size: 9 },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-30 overflow-hidden"
      style={{ opacity }}
    >
      {/* Curved glowing festoon wire line */}
      <svg
        className="w-full h-12 stroke-amber-600/50 fill-none"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,8 Q125,50 250,8 Q375,52 500,8 Q625,50 750,8 Q875,52 1000,8"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        <path
          d="M0,12 Q125,54 250,12 Q375,56 500,12 Q625,54 750,12 Q875,56 1000,12"
          strokeWidth="0.75"
          className="stroke-amber-300/40"
        />
      </svg>

      {/* Hanging glowing bulbs with warm amber/gold halos */}
      {lights.map((l, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-fairy-lights"
          style={{
            left: l.left,
            top: l.top,
            width: `${l.size}px`,
            height: `${l.size}px`,
            backgroundColor: l.color,
            boxShadow: `0 0 10px 3px ${l.color}, 0 0 20px 6px rgba(245, 158, 11, 0.45)`,
            animationDelay: l.delay,
          }}
        >
          {/* Bulb filament core */}
          <div className="absolute inset-0.5 rounded-full bg-white opacity-80" />
        </div>
      ))}
    </div>
  );
};
