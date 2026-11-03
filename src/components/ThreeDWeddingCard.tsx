import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Volume2,
  Check,
  Send,
  Heart,
  Share2,
  Sliders,
  Maximize2,
  Lock,
  Unlock,
  BellRing,
} from 'lucide-react';
import { WeddingPreset } from '../data/weddingPresets';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface ThreeDWeddingCardProps {
  preset: WeddingPreset;
  onApplyPresetToWebsite?: (preset: WeddingPreset) => void;
  customNames?: { groom: string; bride: string; date?: string; venue?: string };
  isInteractive?: boolean;
  defaultCardStyle?: 'foil-flip' | 'royal-gatefold';
}

export const ThreeDWeddingCard: React.FC<ThreeDWeddingCardProps> = ({
  preset,
  onApplyPresetToWebsite,
  customNames,
  isInteractive = true,
  defaultCardStyle = 'royal-gatefold',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGatefoldOpen, setIsGatefoldOpen] = useState(false);
  const [cardStyle, setCardStyle] = useState<'foil-flip' | 'royal-gatefold'>(defaultCardStyle);
  const [activeDeckCard, setActiveDeckCard] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // 3D Tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const groom = customNames?.groom || preset.groomName;
  const bride = customNames?.bride || preset.brideName;
  const dateFormatted = customNames?.date || preset.weddingDateFormatted;
  const venue = customNames?.venue || preset.venueName;
  const isChristian =
    preset.id === 'christian-matrimony' ||
    preset.id === 'christian-wedding-2' ||
    preset.culturalTheme.toLowerCase().includes('christian');
  const isMuslim =
    preset.id === 'muslim-nikah' ||
    preset.culturalTheme.toLowerCase().includes('muslim') ||
    preset.culturalTheme.toLowerCase().includes('islam') ||
    preset.culturalTheme.toLowerCase().includes('nikah');
  const isRajasthan =
    preset.id === 'royal-rajasthan-3d' ||
    preset.culturalTheme.toLowerCase().includes('rajasthan') ||
    preset.culturalTheme.toLowerCase().includes('rajput');

  // Handle Mouse Tilt
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt angle
      const rotY = ((x - centerX) / centerX) * 14;
      const rotX = -((y - centerY) / centerY) * 14;

      setRotateX(rotX);
      setRotateY(rotY);

      // Specular glare position in percentage
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.65,
      });
    },
    [isInteractive]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  // Flip the card
  const handleFlip = () => {
    weddingAudio.playCardFlipSound();
    setIsFlipped(!isFlipped);
  };

  // Toggle Gatefold Doors
  const handleToggleGatefold = () => {
    if (!isGatefoldOpen) {
      weddingAudio.playWaxSealSound();
      if (isChristian) {
        weddingAudio.playChurchChimesSound();
      } else if (isMuslim) {
        weddingAudio.playBlessingChime();
      } else {
        weddingAudio.playTempleBellSound();
      }
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: isChristian
          ? ['#FFFFFF', '#FCE7F3', '#FBCFE8', '#FDE047', '#E0E7FF']
          : isMuslim
          ? ['#10B981', '#34D399', '#FFD700', '#F59E0B', '#FFFFFF']
          : ['#FFD700', '#F59E0B', '#E11D48'],
      });
    } else {
      weddingAudio.playCardFlipSound();
    }
    setIsGatefoldOpen(!isGatefoldOpen);
  };

  // Ring temple bell
  const handleRingBell = (e: React.MouseEvent) => {
    e.stopPropagation();
    weddingAudio.playTempleBellSound();
  };

  // Apply this preset to the live website
  const handleApplyPreset = () => {
    if (onApplyPresetToWebsite) {
      weddingAudio.playBlessingChime();
      onApplyPresetToWebsite(preset);
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 2500);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#F59E0B', '#E11D48', '#FFFFFF'],
      });
    }
  };

  // Copy share link
  const handleShareCard = () => {
    const text = `✨ You are cordially invited to celebrate the 3D Wedding of ${groom} & ${bride} on ${dateFormatted} at ${venue}. View the 3D Card: ${window.location.href}`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Auto-gentle tilt idle animation when not hovered
  useEffect(() => {
    if (isHovered) return;
    let frameId: number;
    let angle = 0;
    const animateIdle = () => {
      angle += 0.02;
      setRotateY(Math.sin(angle) * 3);
      setRotateX(Math.cos(angle * 0.7) * 2);
      frameId = requestAnimationFrame(animateIdle);
    };
    frameId = requestAnimationFrame(animateIdle);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* 3D Viewport Wrapper with Realistic Camera Perspective */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[10/16] perspective-[1400px] select-none py-2"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* The Tilting Card Container */}
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${isFlipped ? rotateY + 180 : rotateY}deg) scale3d(${
              isHovered ? 1.02 : 1
            }, ${isHovered ? 1.02 : 1}, 1)`,
            transition: isHovered
              ? 'transform 0.08s ease-out'
              : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full cursor-pointer rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.35)]"
          onClick={() => {
            if (cardStyle === 'foil-flip') {
              handleFlip();
            }
          }}
        >
          {/* ======================================================== */}
          {/* FRONT SIDE (3D Art, Monogram, Auspicious Shloka) */}
          {/* ======================================================== */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-[3px] border-amber-300/80 bg-neutral-950 flex flex-col justify-between"
          >
            {/* The Rich Cultural Theme Cover Artwork */}
            <div className="absolute inset-0 z-0">
              <img
                src={preset.coverImage}
                alt={preset.name}
                className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.08] saturate-[1.15]"
              />
              {/* Opulent Gold & Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-black/85" />

              {/* Ornate Gold Border Filigree Inset */}
              <div className="absolute inset-2 border border-amber-300/40 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 border border-amber-400/20 rounded-lg pointer-events-none" />

              {/* Corner Ornamental Mandalas */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-300 pointer-events-none" />
            </div>

            {/* Dynamic Specular Holographic / Gold Glare Foil Layer */}
            <div
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 240, 180, 0.45) 0%, rgba(255, 215, 0, 0.18) 28%, transparent 65%)`,
                opacity: glarePos.opacity,
                transition: 'opacity 0.25s ease',
              }}
              className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
            />

            {/* Top Bar on Card: Auspicious Inscription & Monogram */}
            <div className="relative z-20 pt-4 px-4 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-amber-300/50 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-300 animate-sparkle" />
                <span className="text-[10px] font-cinzel font-bold text-amber-200 tracking-widest uppercase truncate max-w-[220px]">
                  {preset.culturalInvocation || '॥ SHREE GANESHAYA NAMAHA • SACRED UNION ॥'}
                </span>
                <Sparkles className="w-3 h-3 text-amber-300 animate-sparkle" />
              </div>

              {/* Glowing Monogram Seal with Royal Aura */}
              <div className="mt-2.5 relative flex items-center justify-center w-12 h-12 rounded-full border border-amber-300/90 bg-gradient-to-tr from-amber-500/40 via-neutral-900/80 to-amber-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                <span className="font-title text-xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-yellow-200 via-amber-100 to-yellow-400">
                  {preset.monogramText}
                </span>
              </div>
            </div>

            {/* Bottom Invitation Details: Couple Names, Shloka & Date */}
            <div className="relative z-20 pb-4 px-4 flex flex-col items-center text-center">
              {/* Couple Names */}
              <h3 className="font-script text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] tracking-wide">
                {groom} &amp; {bride}
              </h3>

              {/* Sanskrit Sacred Shloka */}
              <div className="mt-1.5 max-w-xs px-2.5 py-1.5 rounded-lg bg-neutral-950/70 backdrop-blur-sm border border-amber-300/30">
                <p className="text-[9px] font-sanskrit text-amber-200 leading-snug tracking-wide">
                  {preset.shloka}
                </p>
                <p className="text-[8px] font-editorial italic text-amber-100/80 mt-0.5 line-clamp-1">
                  &ldquo;{preset.shlokaMeaning}&rdquo;
                </p>
              </div>

              {/* Date & Venue Pill */}
              <div className="mt-2 flex items-center justify-center gap-3 text-[10px] font-cinzel font-bold text-amber-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {dateFormatted}
                </span>
                <span className="text-amber-400/60">•</span>
                <span className="flex items-center gap-1 max-w-[120px] truncate">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  {venue}
                </span>
              </div>

              {/* Tap to Flip Prompt */}
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/40 text-[9px] font-cinzel text-amber-200 font-semibold tracking-wider uppercase">
                <RotateCcw className="w-2.5 h-2.5 text-amber-300 animate-spin-slow" />
                Tap to Flip Card 360°
              </div>
            </div>

            {/* ======================================================== */}
            {/* GATEFOLD DOORS OVERLAY (If Royal Gatefold mode is active) */}
            {/* ======================================================== */}
            {cardStyle === 'royal-gatefold' && (
              <div
                className="absolute inset-0 z-30 pointer-events-auto flex overflow-hidden rounded-2xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleGatefold();
                }}
              >
                {/* Left Door */}
                <div
                  style={{
                    transformOrigin: 'left center',
                    transform: isGatefoldOpen ? 'rotateY(-115deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.8s cubic-bezier(0.3, 0.0, 0.2, 1)',
                  }}
                  className={`w-1/2 h-full ${
                    isRajasthan
                      ? 'bg-gradient-to-r from-[#1A050B] via-[#4C0519] to-[#1A050B] border-r-2 border-amber-400/90 text-amber-100'
                      : isChristian
                      ? 'bg-gradient-to-r from-[#FAF6F0] via-[#F4EDE2] to-[#E8DCCB] text-neutral-900 border-r-2 border-amber-500/90'
                      : isMuslim
                      ? 'bg-gradient-to-r from-[#02241A] via-[#064230] to-[#02241A] border-r-2 border-amber-400/90 text-emerald-100'
                      : 'bg-gradient-to-r from-[#1F070E] via-[#360918] to-[#1F070E] border-r border-amber-300/80 text-white'
                  } shadow-2xl relative p-3 flex flex-col justify-between overflow-hidden`}
                >
                  {isRajasthan && (
                    <>
                      <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-red-950/60 pointer-events-none" />
                      <div className="absolute top-2 left-2 text-[10px] select-none opacity-85">🦚 👑</div>
                      <div className="absolute bottom-2 left-2 text-[10px] select-none opacity-85">⚔️ 🐎</div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gradient-to-r from-amber-600/80 via-yellow-300 to-amber-700/90 border-y border-amber-400" />
                    </>
                  )}
                  {isChristian && (
                    <>
                      <div className="absolute inset-0 bg-radial from-amber-200/40 via-transparent to-amber-300/20 pointer-events-none" />
                      {/* Botanical sprigs */}
                      <div className="absolute top-2 left-2 text-[10px] select-none opacity-80">🌿 🌸</div>
                      <div className="absolute bottom-2 left-2 text-[10px] select-none opacity-80">🕊️ 🌿</div>
                      {/* Gold horizontal ribbon */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gradient-to-r from-amber-600/70 via-yellow-400 to-amber-700/80 border-y border-amber-400/80" />
                    </>
                  )}
                  {isMuslim && (
                    <>
                      <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-emerald-950/40 pointer-events-none" />
                      <div className="absolute top-2 left-2 text-[10px] select-none opacity-80">🌙 ✨</div>
                      <div className="absolute bottom-2 left-2 text-[10px] select-none opacity-80">🕌 ⭐️</div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gradient-to-r from-amber-600/70 via-yellow-400 to-amber-700/80 border-y border-amber-400/80" />
                    </>
                  )}
                  <div className={`border ${isRajasthan ? 'border-amber-400/60 rounded-l-xl' : isChristian ? 'border-amber-700/40 rounded-l-xl' : isMuslim ? 'border-amber-400/40 rounded-l-xl' : 'border-amber-300/30 rounded-l-lg'} h-full p-2 flex flex-col justify-between relative z-10`}>
                    <div className={`w-3 h-3 border-t border-l ${isRajasthan ? 'border-amber-400' : isChristian ? 'border-amber-700' : 'border-amber-300'}`} />
                    <p className={`text-[10px] font-cinzel font-bold tracking-widest uppercase rotate-90 origin-left pl-6 ${isRajasthan ? 'text-amber-300' : isChristian ? 'text-amber-950' : isMuslim ? 'text-amber-200' : 'text-amber-200/80'}`}>
                      {isRajasthan ? 'RAJPUTANA VIVAAH' : isChristian ? 'HOLY MATRIMONY' : isMuslim ? 'NIKAH MUBARAK' : 'ROYAL INVITATION'}
                    </p>
                    <div className={`w-3 h-3 border-b border-l ${isRajasthan ? 'border-amber-400' : isChristian ? 'border-amber-700' : 'border-amber-300'}`} />
                  </div>
                </div>

                {/* Right Door */}
                <div
                  style={{
                    transformOrigin: 'right center',
                    transform: isGatefoldOpen ? 'rotateY(115deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.8s cubic-bezier(0.3, 0.0, 0.2, 1)',
                  }}
                  className={`w-1/2 h-full ${
                    isRajasthan
                      ? 'bg-gradient-to-l from-[#1A050B] via-[#4C0519] to-[#1A050B] border-l-2 border-amber-400/90 text-amber-100'
                      : isChristian
                      ? 'bg-gradient-to-l from-[#FAF6F0] via-[#F4EDE2] to-[#E8DCCB] text-neutral-900 border-l-2 border-amber-500/90'
                      : isMuslim
                      ? 'bg-gradient-to-l from-[#02241A] via-[#064230] to-[#02241A] border-l-2 border-amber-400/90 text-emerald-100'
                      : 'bg-gradient-to-l from-[#1F070E] via-[#360918] to-[#1F070E] border-l border-amber-300/80 text-white'
                  } shadow-2xl relative p-3 flex flex-col justify-between overflow-hidden`}
                >
                  {isRajasthan && (
                    <>
                      <div className="absolute inset-0 bg-radial from-amber-500/20 via-transparent to-red-950/60 pointer-events-none" />
                      <div className="absolute top-2 right-2 text-[10px] select-none opacity-85">👑 🦚</div>
                      <div className="absolute bottom-2 right-2 text-[10px] select-none opacity-85">🐎 ⚔️</div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gradient-to-l from-amber-600/80 via-yellow-300 to-amber-700/90 border-y border-amber-400" />
                    </>
                  )}
                  {isChristian && (
                    <>
                      <div className="absolute inset-0 bg-radial from-amber-200/40 via-transparent to-amber-300/20 pointer-events-none" />
                      {/* Botanical sprigs */}
                      <div className="absolute top-2 right-2 text-[10px] select-none opacity-80">🌸 🌿</div>
                      <div className="absolute bottom-2 right-2 text-[10px] select-none opacity-80">🌿 🕊️</div>
                      {/* Gold horizontal ribbon */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gradient-to-l from-amber-600/70 via-yellow-400 to-amber-700/80 border-y border-amber-400/80" />
                    </>
                  )}
                  {isMuslim && (
                    <>
                      <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-emerald-950/40 pointer-events-none" />
                      <div className="absolute top-2 right-2 text-[10px] select-none opacity-80">✨ 🌙</div>
                      <div className="absolute bottom-2 right-2 text-[10px] select-none opacity-80">⭐️ 🕌</div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gradient-to-l from-amber-600/70 via-yellow-400 to-amber-700/80 border-y border-amber-400/80" />
                    </>
                  )}
                  <div className={`border ${isRajasthan ? 'border-amber-400/60 rounded-r-xl' : isChristian ? 'border-amber-700/40 rounded-r-xl' : isMuslim ? 'border-amber-400/40 rounded-r-xl' : 'border-amber-300/30 rounded-r-lg'} h-full p-2 flex flex-col justify-between items-end relative z-10`}>
                    <div className={`w-3 h-3 border-t border-r ${isRajasthan ? 'border-amber-400' : isChristian ? 'border-amber-700' : 'border-amber-300'}`} />
                    <p className={`text-[10px] font-cinzel font-bold tracking-widest uppercase -rotate-90 origin-right pr-6 ${isRajasthan ? 'text-amber-300' : isChristian ? 'text-amber-950' : isMuslim ? 'text-amber-200' : 'text-amber-200/80'}`}>
                      {isRajasthan ? 'RATHORE HERITAGE' : isChristian ? 'LOVE NEVER FAILS' : isMuslim ? 'BARAKALLAH' : 'AUSPICIOUS UNION'}
                    </p>
                    <div className={`w-3 h-3 border-b border-r ${isRajasthan ? 'border-amber-400' : isChristian ? 'border-amber-700' : 'border-amber-300'}`} />
                  </div>
                </div>

                {/* Center Royal Wax Seal */}
                <div
                  style={{
                    opacity: isGatefoldOpen ? 0 : 1,
                    transform: isGatefoldOpen ? 'scale(0.5)' : 'scale(1)',
                    transition: 'opacity 0.4s, transform 0.4s',
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center cursor-pointer pointer-events-auto"
                >
                  <div className={`w-16 h-16 rounded-full ${
                    isRajasthan
                      ? 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border-2 border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.9)]'
                      : isChristian
                      ? 'bg-gradient-to-tr from-amber-700 via-yellow-400 to-amber-600 border-2 border-amber-200 shadow-[0_0_30px_rgba(217,119,6,0.85)]'
                      : isMuslim
                      ? 'bg-gradient-to-tr from-emerald-800 via-yellow-400 to-emerald-700 border-2 border-amber-300 shadow-[0_0_30px_rgba(16,185,129,0.85)]'
                      : 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border-2 border-amber-200 shadow-[0_0_25px_rgba(255,215,0,0.8)]'
                  } p-0.5 flex items-center justify-center animate-pulse-glow`}>
                    <div className={`w-full h-full rounded-full ${
                      isRajasthan
                        ? 'bg-gradient-to-b from-[#4C0519] via-[#2A040D] to-[#1A050B] border border-amber-300'
                        : isChristian
                        ? 'bg-gradient-to-b from-[#3E2310] via-[#2D180B] to-[#1F0E05] border border-amber-300'
                        : isMuslim
                        ? 'bg-gradient-to-b from-[#02241A] via-[#064230] to-[#02241A] border border-amber-300'
                        : 'bg-[#520C1F] border border-amber-300'
                    } flex items-center justify-center`}>
                      <span className="font-title text-2xl font-bold text-amber-200">
                        {preset.monogramText}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 px-2.5 py-0.5 rounded-full bg-black/75 text-[9px] font-cinzel text-amber-200 uppercase tracking-widest border border-amber-400/40">
                    {isRajasthan ? '🦚 Open Royal Gatefold 🦚' : isChristian ? '✝ Open Gatefold ✝' : isMuslim ? '🌙 Open Gatefold 🌙' : 'Click Seal to Open'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* BACK SIDE (Formal Itinerary, Auspicious Shloka, Venue) */}
          {/* ======================================================== */}
          <div
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-[3px] border-amber-300/80 bg-gradient-to-b from-[#1E060E] via-[#2F0814] to-[#19040A] p-4 flex flex-col justify-between text-white"
          >
            {/* Ornate Gold Border Inner */}
            <div className="absolute inset-2 border border-amber-300/40 rounded-xl pointer-events-none" />
            <div className="absolute inset-3 border border-amber-400/20 rounded-lg pointer-events-none" />

            {/* Back Header */}
            <div className="relative z-10 text-center pt-2">
              <p className="text-[10px] font-cinzel font-bold text-amber-300 tracking-widest uppercase flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Celebration Itinerary &amp; Venue
                <Sparkles className="w-3 h-3 text-amber-400" />
              </p>
              <h4 className="font-script text-2xl sm:text-3xl text-amber-200 mt-1">
                {groom} &amp; {bride}
              </h4>
              <p className="text-[9px] font-body text-amber-100/80 italic mt-0.5">
                {preset.poeticNote}
              </p>
            </div>

            {/* Events Timeline in Card */}
            <div className="relative z-10 space-y-2 my-auto px-1">
              {preset.events.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="bg-black/50 backdrop-blur-md rounded-xl p-2.5 border border-amber-400/30 text-left flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-[11px] font-classic font-bold text-amber-200">
                      <span className="w-4 h-4 rounded-full bg-amber-500/30 text-[9px] flex items-center justify-center text-amber-300 font-mono">
                        {idx + 1}
                      </span>
                      {evt.title}
                    </div>
                    <p className="text-[9px] text-neutral-300 line-clamp-1 mt-0.5">
                      {evt.venue}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[10px] font-cinzel font-bold text-amber-300">
                      {evt.date}
                    </span>
                    <span className="block text-[9px] text-amber-200/80 font-mono">
                      {evt.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Venue Details & Actions */}
            <div className="relative z-10 text-center pb-2">
              <div className="bg-black/60 rounded-xl p-2.5 border border-amber-400/30 mb-2">
                <div className="flex items-center justify-center gap-1 text-[10px] font-cinzel font-bold text-amber-300 uppercase">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{venue}</span>
                </div>
                <p className="text-[8px] text-neutral-300 truncate mt-0.5">
                  {preset.venueAddress}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={preset.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-[10px] font-cinzel font-bold text-amber-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open Map
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      weddingAudio.playBlessingChime();
                      confetti({
                        particleCount: 40,
                        spread: 60,
                        origin: { y: 0.7 },
                      });
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 border border-rose-400/50 text-[10px] font-cinzel font-bold text-rose-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-rose-400" />
                    Blessings
                  </button>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/20 text-[9px] font-cinzel text-amber-300 uppercase">
                <RotateCcw className="w-2.5 h-2.5" />
                Tap to Flip to Front
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Toolbar Under the 3D Card */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2.5 mt-3 px-2">
        {/* Card Interaction Mode Buttons */}
        <div className="flex items-center gap-2 w-full justify-center">
          <button
            type="button"
            onClick={handleFlip}
            className="flex-1 py-2 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-amber-200 border border-amber-400/40 text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            {isFlipped ? 'Show Front' : 'Flip to Back'}
          </button>

          <button
            type="button"
            onClick={() => {
              setCardStyle(cardStyle === 'foil-flip' ? 'royal-gatefold' : 'foil-flip');
              setIsGatefoldOpen(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
              cardStyle === 'royal-gatefold'
                ? 'bg-amber-500 text-neutral-950 font-bold border border-amber-300'
                : 'bg-neutral-900/90 text-neutral-300 hover:text-white border border-white/15'
            }`}
          >
            {cardStyle === 'royal-gatefold' ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                Gatefold Mode
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Try Gatefold Box
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRingBell}
            className="p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border border-amber-400/40 shadow-md active:scale-95 transition-all"
            title="Ring Temple Bell Chime"
          >
            <BellRing className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action: 1-Click Apply Preset to Website */}
        {onApplyPresetToWebsite && (
          <button
            type="button"
            onClick={handleApplyPreset}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-cinzel font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,215,0,0.35)] border border-amber-300 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {isApplied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Applied to Live Website!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Apply &ldquo;{preset.name}&rdquo; to Website</span>
              </>
            )}
          </button>
        )}

        {/* Share & Copy Link */}
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleShareCard}
            className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-body flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Invitation Text Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Copy 3D Card Invite</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
