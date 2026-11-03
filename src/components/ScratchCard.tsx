import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingAudio } from '../utils/audioSynth';

interface ScratchCardProps {
  photoUrl: string;
  heading?: string;
  title?: string;
  subtitle?: string;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  photoUrl,
  heading = 'A MOMENT, UNCOVERED',
  title = 'Scratch to reveal',
  subtitle = 'Use your finger or cursor to gently uncover it',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratchedOut, setIsScratchedOut] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);
  const lastSoundTimeRef = useRef(0);
  const isKeralaHands = photoUrl.includes('bangles_wrist');

  // Initialize canvas with luxurious golden metallic texture
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 340);
    const height = (canvas.height = canvas.offsetHeight || 380);

    // Golden gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#E6CA65');
    grad.addColorStop(0.2, '#FAF0BE');
    grad.addColorStop(0.4, '#D4AF37');
    grad.addColorStop(0.7, '#C5A028');
    grad.addColorStop(1, '#997300');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Foil noise texture
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(120,80,0,0.12)';
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // Elegant gold floral border design on canvas
    ctx.strokeStyle = '#875C00';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.strokeStyle = '#FFF8DC';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Subtle center emblem watermark on scratch foil
    ctx.font = '32px "Cinzel", serif';
    ctx.fillStyle = 'rgba(135, 92, 0, 0.45)';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ✦ ✦', width / 2, height / 2 - 16);

    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = 'rgba(92, 60, 0, 0.55)';
    ctx.fillText('TOUCH TO REVEAL', width / 2, height / 2 + 18);

    setIsScratchedOut(false);
    setScratchPercent(0);
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchedOut) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 16th pixel for high performance
      const stride = 16;
      let sampledTotal = 0;

      for (let i = 0; i < pixels.length; i += 4 * stride) {
        sampledTotal++;
        if (pixels[i + 3] < 50) {
          transparentCount++;
        }
      }

      const percent = sampledTotal > 0 ? Math.round((transparentCount / sampledTotal) * 100) : 0;
      setScratchPercent(isNaN(percent) ? 0 : Math.min(100, Math.max(0, percent)));

      if (percent > 45 && !isScratchedOut) {
        setIsScratchedOut(true);
        weddingAudio.playBlessingChime();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E11D48', '#FFD700', '#FFFFFF'],
        });
      }
    } catch {
      // Ignore security errors in strict cross-origin scenarios
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2, false);
    ctx.fill();

    // Gentle scratch sound throttled
    const now = performance.now();
    if (now - lastSoundTimeRef.current > 80) {
      weddingAudio.playScratchSound();
      lastSoundTimeRef.current = now;
    }

    checkScratchPercentage();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // pointer release fallback
    }
  };

  return (
    <div
      id="scratch-card-section"
      className="relative flex flex-col items-center justify-center p-6 text-center w-full max-w-sm mx-auto"
    >
      {/* Eyebrow and Script title matching video */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-1.5 text-xs tracking-widest uppercase text-amber-800/80 font-cinzel font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{heading}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-script text-neutral-800 tracking-wide">
          {title}
        </h2>
        <p className="text-xs text-neutral-500 font-body mt-1">
          {subtitle}
        </p>
      </div>

      {/* The Scratch Card Frame */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(212,175,55,0.35)] border-4 border-amber-300/80 bg-amber-50 group transition-all"
      >
        {/* Sparkle Glints on Frame Corners */}
        <div className="absolute top-2 left-2 z-30 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle pointer-events-none" />
        <div className="absolute top-2 right-2 z-30 w-3 h-3 rounded-full bg-white animate-sparkle delay-300 pointer-events-none" />

        {/* Revealed Content Underneath (Photo + message) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 overflow-hidden">
          <img
            src={photoUrl}
            alt="Secret Couple Moment"
            className="w-full h-full object-cover brightness-[1.05] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
          <div className="absolute bottom-4 inset-x-3 text-center">
            {isKeralaHands ? (
              <>
                <p className="text-white font-script text-2xl sm:text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  A Moment of Sacred Touch
                </p>
                <p className="text-emerald-300 text-[10px] sm:text-[11px] font-cinzel font-bold tracking-widest uppercase drop-shadow-xs mt-0.5">
                  Green Bangles • Jasmine Garland • Hastamelap ✨
                </p>
              </>
            ) : (
              <>
                <p className="text-white font-script text-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Every chapter with you is magic
                </p>
                <p className="text-amber-300 text-xs font-cinzel font-bold tracking-widest uppercase drop-shadow-xs mt-0.5">
                  Secret Chapter Uncovered ✨
                </p>
              </>
            )}
          </div>
        </div>

        {/* The Scratch Foil Canvas Overlay */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none transition-opacity duration-700 ${
            isScratchedOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {/* Shimmering shine bar across foil */}
        {!isScratchedOut && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[goldSweep_3s_infinite]" />
        )}
      </div>

      {/* Progress & Reset Controls */}
      <div className="flex items-center justify-between w-full mt-3 px-2">
        <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium font-body">
          {isScratchedOut ? (
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Unlocked
            </span>
          ) : (
            <span>Revealed: {String(isNaN(scratchPercent) ? 0 : scratchPercent)}%</span>
          )}
        </div>

        <button
          id="reset-scratch-button"
          onClick={initCanvas}
          type="button"
          className="flex items-center gap-1.5 text-xs font-medium text-amber-900/80 hover:text-amber-900 bg-amber-100/60 hover:bg-amber-200/80 px-2.5 py-1 rounded-full transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Card
        </button>
      </div>
    </div>
  );
};
