import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  Layers,
  Heart,
  Wand2,
  Maximize2,
  Calendar,
  MapPin,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitationConfig } from '../types';
import {
  getThemePreset,
  isChristianTheme,
  isMuslimTheme,
  isKeralaTheme,
  isNorthIndianTheme,
  isRajasthanTheme,
  christianGatefoldArchImg,
  muslimNikahSanctuaryImg,
  royalVarmalaImg,
  southTempleGopuramImg,
  rajasthanRajputDarbarImg,
} from '../data/weddingPresets';
import { ThreeDWeddingCard } from './ThreeDWeddingCard';
import { FairyLightsOverlay } from './FairyLightsOverlay';
import { weddingAudio } from '../utils/audioSynth';

interface SceneScratchGatefoldProps {
  config: InvitationConfig;
}

export const SceneScratchGatefold: React.FC<SceneScratchGatefoldProps> = ({ config }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [activeTab, setActiveTab] = useState<'scratch' | 'gatefold'>('scratch');
  const [isScratching, setIsScratching] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  const isChristian = isChristianTheme(config);
  const isMuslim = isMuslimTheme(config);
  const isKerala = isKeralaTheme(config);
  const isNorthIndian = isNorthIndianTheme(config);
  const isRajasthan = isRajasthanTheme(config);

  const preset = getThemePreset(config.theme?.presetId);

  // Background visual based on cultural template
  const bgImage = isRajasthan
    ? rajasthanRajputDarbarImg
    : isChristian
    ? christianGatefoldArchImg
    : isMuslim
    ? muslimNikahSanctuaryImg
    : isKerala
    ? southTempleGopuramImg
    : royalVarmalaImg;

  // Initialize and draw the ceremonial gold foil canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.offsetWidth || 340;
    const height = canvas.offsetHeight || 440;
    canvas.width = width;
    canvas.height = height;

    // Metallic gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isRajasthan) {
      grad.addColorStop(0, '#7F1D1D');
      grad.addColorStop(0.2, '#D97706');
      grad.addColorStop(0.4, '#FBBF24');
      grad.addColorStop(0.6, '#F59E0B');
      grad.addColorStop(0.8, '#B45309');
      grad.addColorStop(1, '#450A0A');
    } else if (isChristian) {
      grad.addColorStop(0, '#F5E6CC');
      grad.addColorStop(0.25, '#D4AF37');
      grad.addColorStop(0.5, '#FFF8DC');
      grad.addColorStop(0.75, '#C59B27');
      grad.addColorStop(1, '#E6CA65');
    } else if (isMuslim) {
      grad.addColorStop(0, '#0F382C');
      grad.addColorStop(0.25, '#D4AF37');
      grad.addColorStop(0.5, '#1B5E4B');
      grad.addColorStop(0.75, '#C59B27');
      grad.addColorStop(1, '#0A261E');
    } else {
      grad.addColorStop(0, '#D4AF37');
      grad.addColorStop(0.2, '#FFE58F');
      grad.addColorStop(0.4, '#C59B27');
      grad.addColorStop(0.6, '#FFF0A6');
      grad.addColorStop(0.8, '#AA7C11');
      grad.addColorStop(1, '#FFD700');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Gold Speckles & Flecks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 280; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border Filigree / Inner Inset
    ctx.strokeStyle = 'rgba(255, 240, 180, 0.75)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.9)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Center Emblem Badge
    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(20, 10, 5, 0.65)';
    ctx.beginPath();
    ctx.arc(cx, cy, 54, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Central cultural icon & text
    ctx.fillStyle = '#FFE58F';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerIcon = isRajasthan ? '🦚' : isChristian ? '✝' : isMuslim ? '🌙' : '✨';
    ctx.fillText(centerIcon, cx, cy - 14);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SCRATCH TO REVEAL', cx, cy + 14);

    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText(isRajasthan ? 'ROYAL RAJASTHAN GATEFOLD' : 'GATEFOLD INVITATION', cx, cy + 28);
    ctx.restore();
  }, [isChristian, isMuslim, isRajasthan]);

  useEffect(() => {
    // Only re-init if not already revealed
    if (!isRevealed && activeTab === 'scratch') {
      const timer = setTimeout(() => {
        initCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initCanvas, isRevealed, activeTab]);

  // Calculate percentage scratched
  const calculatePercentScratched = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      const stride = 32; // Optimized sampling stride
      const totalSampled = Math.floor(data.length / (4 * stride));

      if (totalSampled <= 0) return;

      for (let i = 3; i < data.length; i += 4 * stride) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const percent = Math.min(100, Math.max(0, Math.round((transparentPixels / totalSampled) * 100)));
      setScratchPercent(percent);

      if (percent >= 38 && !isRevealed) {
        handleTriggerReveal();
      }
    } catch {
      // Ignore image data security restrictions if any
    }
  };

  // Trigger celebration and unlock gatefold
  const handleTriggerReveal = () => {
    setIsRevealed(true);
    setScratchPercent(100);

    // Audio chime
    if (isRajasthan) {
      weddingAudio.playRajputanaChime();
    } else if (isChristian) {
      weddingAudio.playChurchChimesSound();
    } else if (isMuslim) {
      weddingAudio.playBlessingChime();
    } else {
      weddingAudio.playTempleBellSound();
    }

    // Confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: isRajasthan
        ? ['#FFD700', '#F59E0B', '#E11D48', '#B91C1C', '#10B981']
        : isChristian
        ? ['#FDE047', '#FAF5FF', '#F43F5E', '#E0E7FF']
        : isMuslim
        ? ['#10B981', '#34D399', '#FCD34D', '#FFFFFF']
        : ['#FFD700', '#F59E0B', '#E11D48', '#FFE4E6'],
    });
  };

  // Perform scratching stroke
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    // Play scratch sound throttled
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 180) {
      weddingAudio.playScratchSound();
      lastSoundTimeRef.current = now;
    }
  };

  // Mouse & Touch Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
    calculatePercentScratched();
  };

  const handlePointerUp = () => {
    setIsScratching(false);
    calculatePercentScratched();
  };

  // Quick Reveal Action
  const handleQuickReveal = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    handleTriggerReveal();
  };

  // Reset Foil Action
  const handleResetFoil = () => {
    setIsRevealed(false);
    setScratchPercent(0);
    setTimeout(() => {
      initCanvas();
    }, 50);
  };

  // Switch to 3D Gatefold with sound
  const handleOpenGatefold = () => {
    weddingAudio.playCardFlipSound();
    setActiveTab('gatefold');
  };

  return (
    <section
      id="scene-scratch-gatefold"
      ref={containerRef}
      className="relative min-h-screen py-20 px-4 flex flex-col items-center justify-center overflow-hidden bg-neutral-950 text-white select-none"
    >
      {/* Background Architectural Canvas Artwork */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={bgImage}
          alt="Royal Wedding Gatefold Atmosphere"
          className="w-full h-full object-cover object-center filter brightness-[0.22] contrast-[1.1] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Soft cultural radiant gradient tint */}
        <div
          className={`absolute inset-0 ${
            isChristian
              ? 'bg-gradient-to-b from-amber-950/70 via-neutral-950/85 to-neutral-950'
              : isMuslim
              ? 'bg-gradient-to-b from-emerald-950/70 via-neutral-950/85 to-neutral-950'
              : 'bg-gradient-to-b from-amber-950/70 via-neutral-950/85 to-neutral-950'
          }`}
        />
        {/* Radial spotlight on card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Floating Fairy Lights & Petals */}
      <FairyLightsOverlay />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 px-4">
        {/* Cultural Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 shadow-lg text-xs font-cinzel tracking-widest text-amber-300 uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span>
            {isChristian
              ? '✝ Sacred Gatefold & Scratch Reveal ✝'
              : isMuslim
              ? '🌙 Royal Nikah Gatefold & Secret Keepsake 🌙'
              : isKerala
              ? '🌴 Kasavu Mangalyam & Scratch Reveal 🌴'
              : '✨ Royal 3D Gatefold & Scratch Reveal ✨'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
        </div>

        {/* Main Heading */}
        <h2 className="font-title text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-400 font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {isChristian
            ? 'Scratch to Unveil the Sacred Gatefold'
            : isMuslim
            ? 'Scratch to Reveal the Mubarak Gatefold'
            : 'Scratch to Reveal 3D Gatefold Card'}
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-sm sm:text-base font-serif italic text-amber-100/80 max-w-xl mx-auto leading-relaxed">
          Gently scratch the ceremonial gold foil with your touch or cursor to unlock the interactive 3D Royal Gatefold Invitation.
        </p>

        {/* Tab / Mode Switcher Buttons */}
        <div className="mt-6 inline-flex items-center p-1 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/15 shadow-xl">
          <button
            type="button"
            id="tab-scratch-mode"
            onClick={() => {
              weddingAudio.playCardFlipSound();
              setActiveTab('scratch');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'scratch'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-neutral-950 shadow-md scale-105'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1. Scratch Keepsake
          </button>

          <button
            type="button"
            id="tab-gatefold-mode"
            onClick={() => {
              weddingAudio.playCardFlipSound();
              setActiveTab('gatefold');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'gatefold'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-neutral-950 shadow-md scale-105'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            {isRevealed ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400/80" />
            )}
            2. 3D Gatefold Card
            {isRevealed && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-bold">
                Ready
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* ==================================================================== */}
        {/* VIEW A: SCRATCH TO REVEAL CEREMONY                                   */}
        {/* ==================================================================== */}
        {activeTab === 'scratch' && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            {/* Scratch Card Cardboard Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-[3/4] rounded-2xl p-2.5 bg-gradient-to-b from-amber-200/30 via-neutral-900/90 to-amber-900/40 border border-amber-300/60 shadow-[0_15px_45px_rgba(0,0,0,0.85)] overflow-hidden">
              {/* Inner Reveal Content (Underneath the Foil) */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-900 flex flex-col">
                <img
                  src={config.scratchRevealPhoto}
                  alt={config.scratchRevealHeading || 'Sacred Keepsake'}
                  className="w-full h-full object-cover object-center filter contrast-[1.05]"
                />

                {/* Romantic Overlay Inscription on revealed photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-4 text-center">
                  <span className="text-[10px] font-cinzel font-bold text-amber-300 uppercase tracking-widest">
                    {config.scratchRevealHeading || 'CEREMONIAL UNION'}
                  </span>
                  <p className="mt-1 text-xs font-serif italic text-white/90 line-clamp-2">
                    {config.scratchRevealNote || 'Gently scratch to unveil the sacred keepsake and open the royal gatefold.'}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-amber-300 font-cinzel">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>{config.groomName} &amp; {config.brideName}</span>
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
                  </div>
                </div>

                {/* The Golden Scratch Foil Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className={`absolute inset-0 z-20 w-full h-full touch-none cursor-pointer ${
                    isRevealed ? 'pointer-events-none opacity-0 transition-opacity duration-700' : ''
                  }`}
                  style={{ touchAction: 'none' }}
                />
              </div>
            </div>

            {/* Scratch Controls & Progress Indicator */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
              {/* Live Percent Tracker */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-amber-300/30 text-xs font-cinzel text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isRevealed ? '100% Unveiled' : `Foil Scratched: ${scratchPercent}%`}
                </span>
              </div>

              {/* Quick Reveal / Unlock Button */}
              {!isRevealed ? (
                <button
                  type="button"
                  id="btn-quick-reveal"
                  onClick={handleQuickReveal}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-cinzel font-bold text-xs tracking-wider uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Quick Reveal &amp; Unlock
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-reset-foil"
                  onClick={handleResetFoil}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-cinzel text-xs tracking-wider uppercase border border-white/20 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Foil
                </button>
              )}
            </div>

            {/* Unlocked Gatefold Notification Banner */}
            {isRevealed && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-neutral-900/90 to-amber-950/80 border border-amber-400/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg w-full animate-bounce-subtle">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider">
                      Gatefold Invitation Unlocked!
                    </h4>
                    <p className="text-[11px] font-serif text-neutral-300">
                      The wax-sealed 3D Gatefold Card is ready to open.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-proceed-to-gatefold"
                  onClick={handleOpenGatefold}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-cinzel font-bold text-xs tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  Open 3D Gatefold ➔
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW B: INTERACTIVE 3D ROYAL GATEFOLD CARD                           */}
        {/* ==================================================================== */}
        {activeTab === 'gatefold' && (
          <div className="flex flex-col items-center w-full animate-fade-in">
            {/* Gatefold Card Display */}
            <div className="w-full flex justify-center py-2">
              <ThreeDWeddingCard
                preset={preset}
                customNames={{
                  groom: config.groomName,
                  bride: config.brideName,
                  date: config.weddingDateFormatted,
                  venue: config.venueName,
                }}
                defaultCardStyle="royal-gatefold"
                isInteractive={true}
              />
            </div>

            {/* Quick Helper Actions under 3D Card */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                id="btn-back-to-scratch"
                onClick={() => {
                  weddingAudio.playCardFlipSound();
                  setActiveTab('scratch');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/15 text-xs font-cinzel text-neutral-200 hover:text-white transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                View Scratch Keepsake
              </button>

              <button
                type="button"
                id="btn-ring-bell-chime"
                onClick={() => {
                  if (isChristian) {
                    weddingAudio.playChurchChimesSound();
                  } else if (isMuslim) {
                    weddingAudio.playBlessingChime();
                  } else {
                    weddingAudio.playTempleBellSound();
                  }
                  confetti({
                    particleCount: 25,
                    spread: 50,
                    origin: { y: 0.7 },
                    colors: ['#FFD700', '#F59E0B', '#FFF'],
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-amber-300/30 text-xs font-cinzel text-amber-300 hover:text-amber-200 transition-all shadow-md"
              >
                <Music className="w-3.5 h-3.5 text-amber-400" />
                {isChristian ? 'Ring Cathedral Chimes' : isMuslim ? 'Sacred Blessing Chime' : 'Ring Temple Bell'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
