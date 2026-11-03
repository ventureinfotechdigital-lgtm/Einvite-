import React, { useEffect, useRef } from 'react';
import { Sparkles, Calendar, Clock, MapPin } from 'lucide-react';
import { InvitationConfig } from '../types';
import sparklingFireworksBg from '../assets/images/sparkling_night_fireworks_1788517170207.jpg';
import royalVarmalaImg from '../assets/images/royal_varmala_art_1788532216549.jpg';
import { isNorthIndianTheme, isChristianTheme, christianCarKissImg } from '../data/weddingPresets';
import { FairyLightsOverlay } from './FairyLightsOverlay';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface SceneFireworksCelebrationProps {
  config: InvitationConfig;
}

export const SceneFireworksCelebration: React.FC<SceneFireworksCelebrationProps> = ({
  config,
}) => {
  const isNorthIndian = isNorthIndianTheme(config);
  const isChristian = isChristianTheme(config);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const launchFireworks = () => {
    weddingAudio.playFireworkSound();

    // Trigger multiple bursting confetti fireworks
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 75,
      origin: { x: 0.1, y: 0.5 },
      colors: ['#FFE87C', '#FF4500', '#FFD700', '#FF69B4', '#00FFFF', '#FFFFFF'],
    });

    confetti({
      particleCount: 70,
      angle: 120,
      spread: 75,
      origin: { x: 0.9, y: 0.5 },
      colors: ['#FFE87C', '#FF4500', '#FFD700', '#FF69B4', '#00FFFF', '#FFFFFF'],
    });
  };

  // Canvas ambient sparkling stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 360);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6),
      radius: Math.random() * 1.6 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.03 + 0.01,
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.alpha += s.speed;
        const currentAlpha = Math.abs(Math.sin(s.alpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 150, ${currentAlpha * 0.8})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#FFD700';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      className="relative w-full min-h-[720px] h-full flex flex-col items-center justify-between overflow-hidden select-none text-white p-4"
      style={{ backgroundColor: config.theme?.primaryBg || '#0A0D1F' }}
    >
      {/* Background: Shining Palace Terrace at Twilight with Spectacular Fireworks */}
      <div className="absolute inset-0 z-0">
        <img
          src={isNorthIndian ? royalVarmalaImg : isChristian ? christianCarKissImg : sparklingFireworksBg}
          alt={isChristian ? "Christian Couple Limousine Kiss & Evening Celebration" : "Palace Terrace Fireworks"}
          className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.12] saturate-[1.25]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isNorthIndian
              ? `linear-gradient(to bottom, rgba(133,11,27,0.72), rgba(20,5,10,0.60), rgba(133,11,27,0.92))`
              : `linear-gradient(to bottom, rgba(0,0,0,0.4), ${config.theme?.primaryBg || '#0A0D1F'}40, rgba(0,0,0,0.85))`,
          }}
        />

        {/* Shimmering fairy lights for North Indian theme */}
        {isNorthIndian && <FairyLightsOverlay opacity={0.85} />}

        {/* Twinkling sparks */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle" />
        <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-cyan-200 animate-sparkle delay-500" />
      </div>

      {/* Sparkling Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Top Heading Banner - Matching video "our forever" */}
      <div className="relative z-20 w-full flex flex-col items-center pt-6 text-center">
        <div
          className="px-6 py-2.5 rounded-full backdrop-blur-md border shadow-[0_0_25px_rgba(255,215,0,0.4)] mb-2 animate-aura-glow"
          style={{
            backgroundColor: `${config.theme?.cardBg || '#18040A'}cc`,
            borderColor: `${config.theme?.borderGold || '#FBBF24'}80`,
          }}
        >
          <p className="font-script text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-300 tracking-wide">
            Our Forever
          </p>
        </div>
        <p className="text-xs font-cinzel text-amber-300 font-bold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
          Wedding Ceremonies &amp; Itinerary
        </p>

        <button
          id="launch-fireworks-btn"
          onClick={launchFireworks}
          type="button"
          className="mt-2.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-amber-500/30 hover:bg-amber-500/50 border border-amber-400/70 text-xs font-cinzel font-bold text-amber-200 backdrop-blur-md transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
          Ignite Sky Fireworks ✨
        </button>
      </div>

      {/* Center Event Itinerary Cards */}
      <div className="relative z-20 w-full max-w-sm flex flex-col gap-2.5 my-auto py-2">
        {config.events.map((evt) => (
          <div
            key={evt.id}
            onClick={() => {
              const el = document.getElementById(`ceremony-section-${evt.id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="backdrop-blur-md p-3 rounded-xl border shadow-xl transition-all group cursor-pointer hover:border-amber-400 hover:scale-[1.01]"
            style={{
              backgroundColor: `${config.theme?.cardBg || '#18040A'}cc`,
              borderColor: `${config.theme?.borderGold || '#F59E0B'}40`,
            }}
          >
            <div className="flex items-start gap-3">
              {(evt.photoUrl || evt.bgImageUrl) && (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-amber-400/50 shadow-md">
                  <img
                    src={evt.photoUrl || evt.bgImageUrl}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-classic text-amber-200 font-bold text-sm group-hover:text-amber-100 transition-colors truncate">
                    {evt.title}
                  </h4>
                  <span className="flex items-center justify-end gap-1 text-[10px] font-cinzel font-bold text-amber-300 shrink-0">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {evt.date}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-200 mt-0.5 line-clamp-2">
                  {evt.description}
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1.5 mt-1.5 border-t border-amber-400/20 text-neutral-300">
                  <span className="flex items-center gap-1 truncate font-medium">
                    <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    {evt.venue}
                  </span>
                  <span className="flex items-center gap-1 text-amber-200 font-cinzel font-bold shrink-0 hover:text-amber-100">
                    <span>View 3D &amp; Bless</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Love Hashtag */}
      <div className="relative z-20 w-full text-center pb-6">
        <p className="font-title text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wider text-base font-black drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          {config.hashtag}
        </p>
        <p className="text-[10px] font-cinzel text-neutral-300 uppercase tracking-widest mt-0.5 font-medium">
          Tag your memories with us
        </p>
      </div>
    </section>
  );
};
