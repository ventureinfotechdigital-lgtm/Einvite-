import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  CalendarPlus,
  Navigation,
  RotateCw,
  Info,
  Check,
  Music,
  Flame,
  Wine,
  PartyPopper,
  Volume2,
} from 'lucide-react';
import { InvitationConfig, EventItem } from '../types';
import goldenHaldiImg from '../assets/images/golden_haldi_ceremony_1788535162943.jpg';
import twilightMehendiImg from '../assets/images/twilight_garden_mehendi_1788535181766.jpg';
import royalSangeetImg from '../assets/images/royal_sangeet_celebration_1788588370944.jpg';
import royalSindoorImg from '../assets/images/royal_sindoor_vivaha_1788535101917.jpg';
import lavenderReceptionImg from '../assets/images/lavender_reception_aisle_1788535137772.jpg';
import {
  christianChurchAltarImg,
  christianGatefoldArchImg,
  christianCoupleFigurineImg,
  christian3dCoupleArtImg,
  christianTwoCoupleImg,
  christianCarKissImg,
  christianAisleWalkImg,
  christianGracefulBrideImg,
  christianManhwaBoutonniereImg,
  isChristianTheme,
  isMuslimTheme,
  muslimNikahSigningImg,
  muslimMehndiPalaceImg,
  muslimCurtainGazeImg,
  muslimNikahSanctuaryImg,
} from '../data/weddingPresets';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { FairyLightsOverlay } from './FairyLightsOverlay';

interface SceneFunctions3DProps {
  config: InvitationConfig;
  onTriggerPetalShower?: () => void;
}

// Color and audio mapping based on ceremony type
interface CeremonyThemeConfig {
  defaultBg: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  petalColors: string[];
  tagline: string;
  soundType: 'haldi' | 'mehendi' | 'sangeet' | 'vivaha' | 'reception' | 'church';
}

const CEREMONY_THEMES: Record<string, CeremonyThemeConfig> = {
  nikah: {
    defaultBg: muslimNikahSigningImg,
    badgeBg: 'bg-emerald-950/70',
    badgeBorder: 'border-amber-400',
    textColor: 'text-amber-200',
    petalColors: ['#FBBF24', '#34D399', '#FFFDF7', '#F59E0B', '#FCE7F3'],
    tagline: 'Solemn Nikahnama signing, Qubool Hai affirmation & divine Du’as',
    soundType: 'church',
  },
  walima: {
    defaultBg: muslimNikahSanctuaryImg,
    badgeBg: 'bg-teal-950/70',
    badgeBorder: 'border-amber-300',
    textColor: 'text-amber-200',
    petalColors: ['#FBBF24', '#2DD4BF', '#FCE7F3', '#FFFFFF', '#F59E0B'],
    tagline: 'Grand celebratory feast, family banquet & heartfelt felicitations',
    soundType: 'reception',
  },
  aarsi_mushaf: {
    defaultBg: muslimCurtainGazeImg,
    badgeBg: 'bg-rose-950/70',
    badgeBorder: 'border-pink-300',
    textColor: 'text-pink-200',
    petalColors: ['#FB7185', '#FBBF24', '#FFFDF7', '#F472B6'],
    tagline: 'Unveiling the gaze through mirror & sacred floral veil under starry night',
    soundType: 'mehendi',
  },
  nuptial_mass: {
    defaultBg: christianChurchAltarImg,
    badgeBg: 'bg-purple-950/60',
    badgeBorder: 'border-amber-300',
    textColor: 'text-amber-200',
    petalColors: ['#FFFFFF', '#FCE7F3', '#FDE047', '#E0E7FF', '#C7D2FE'],
    tagline: 'Solemn Church blessing, choral hymns & sacred altar rings',
    soundType: 'church',
  },
  holy_vows: {
    defaultBg: christianCoupleFigurineImg,
    badgeBg: 'bg-rose-950/50',
    badgeBorder: 'border-pink-300',
    textColor: 'text-pink-200',
    petalColors: ['#FFFFFF', '#FBCFE8', '#F472B6', '#FDE047'],
    tagline: 'Exchanging gold bands & eternal vows before God and loved ones',
    soundType: 'church',
  },
  garden_arch: {
    defaultBg: christianGatefoldArchImg,
    badgeBg: 'bg-emerald-950/50',
    badgeBorder: 'border-emerald-300',
    textColor: 'text-emerald-200',
    petalColors: ['#FFFFFF', '#D1FAE5', '#FCE7F3', '#FEF3C7'],
    tagline: 'Under the blooming floral archway, walking hand-in-hand into forever',
    soundType: 'reception',
  },
  banquet_dance: {
    defaultBg: christianTwoCoupleImg,
    badgeBg: 'bg-indigo-950/50',
    badgeBorder: 'border-purple-300',
    textColor: 'text-purple-200',
    petalColors: ['#FFFFFF', '#E9D5FF', '#FBCFE8', '#FDE047'],
    tagline: 'Champagne toast, wedding cake cutting ceremony & romantic first dance waltz',
    soundType: 'reception',
  },
  limousine_sendoff: {
    defaultBg: christianCarKissImg,
    badgeBg: 'bg-blue-950/60',
    badgeBorder: 'border-blue-400',
    textColor: 'text-blue-200',
    petalColors: ['#FFFFFF', '#FB7185', '#FCE7F3', '#FDE047'],
    tagline: 'Rose petal showers, celebratory limousine champagne toast & romantic newlywed kiss',
    soundType: 'reception',
  },
  haldi: {
    defaultBg: goldenHaldiImg,
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-400',
    textColor: 'text-amber-300',
    petalColors: ['#F59E0B', '#FBBF24', '#FEF08A', '#EA580C', '#FFFFFF'],
    tagline: 'Sun-drenched yellow bliss, holy turmeric & marigold petals',
    soundType: 'haldi',
  },
  mehendi: {
    defaultBg: twilightMehendiImg,
    badgeBg: 'bg-emerald-900/40',
    badgeBorder: 'border-emerald-400',
    textColor: 'text-emerald-300',
    petalColors: ['#10B981', '#34D399', '#F472B6', '#FBBF24', '#FEF3C7'],
    tagline: 'Fragrant herbal henna woven under twilight fairy lights',
    soundType: 'mehendi',
  },
  sangeet: {
    defaultBg: royalSangeetImg,
    badgeBg: 'bg-purple-900/40',
    badgeBorder: 'border-amber-400',
    textColor: 'text-purple-300',
    petalColors: ['#C084FC', '#F43F5E', '#FBBF24', '#38BDF8', '#FFFFFF'],
    tagline: 'High-energy dance performances & dazzling stage lights',
    soundType: 'sangeet',
  },
  vivaha: {
    defaultBg: royalSindoorImg,
    badgeBg: 'bg-rose-950/50',
    badgeBorder: 'border-amber-400',
    textColor: 'text-amber-200',
    petalColors: ['#E11D48', '#BE123C', '#F59E0B', '#FFD700', '#FFFFFF'],
    tagline: 'Seven sacred Vedic vows taken by holy fire under starlight',
    soundType: 'vivaha',
  },
  reception: {
    defaultBg: lavenderReceptionImg,
    badgeBg: 'bg-indigo-950/50',
    badgeBorder: 'border-purple-300',
    textColor: 'text-purple-200',
    petalColors: ['#E9D5FF', '#C084FC', '#FDE047', '#FFFFFF', '#67E8F9'],
    tagline: 'Champagne toasts, midnight ballroom waltz & sky fireworks',
    soundType: 'reception',
  },
};

function getCeremonyType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('nikah') || lower.includes('nikaah') || lower.includes('qubool')) return 'nikah';
  if (lower.includes('walima') || lower.includes('valima')) return 'walima';
  if (lower.includes('aarsi') || lower.includes('curtain') || lower.includes('mushaf') || lower.includes('rukhsat')) return 'aarsi_mushaf';
  if (lower.includes('church') || lower.includes('mass') || lower.includes('nuptial') || lower.includes('matrimony') || lower.includes('cathedral') || lower.includes('altar') || lower.includes('processional')) return 'nuptial_mass';
  if (lower.includes('vow') || lower.includes('ring') || lower.includes('boutonniere') || lower.includes('christian')) return 'holy_vows';
  if (lower.includes('limousine') || lower.includes('send-off') || lower.includes('sendoff') || lower.includes('car kiss') || lower.includes('toast')) return 'limousine_sendoff';
  if (lower.includes('cocktail') || lower.includes('garden walk') || lower.includes('archway') || lower.includes('pergola')) return 'garden_arch';
  if (lower.includes('banquet') || lower.includes('first dance') || lower.includes('cake') || lower.includes('waltz')) return 'banquet_dance';
  if (lower.includes('mayun') || lower.includes('haldi') || lower.includes('turmeric')) return 'haldi';
  if (lower.includes('mehendi') || lower.includes('mehandi') || lower.includes('henna')) return 'mehendi';
  if (lower.includes('sangeet') || lower.includes('sangeeth') || lower.includes('dance') || lower.includes('musical')) return 'sangeet';
  if (lower.includes('vivaha') || lower.includes('vivaah') || lower.includes('phera') || lower.includes('wedding') || lower.includes('sindoor') || lower.includes('mandap')) return 'vivaha';
  if (lower.includes('reception') || lower.includes('ballroom') || lower.includes('gala')) return 'reception';
  return 'vivaha';
}

function getCeremonyBg(event: EventItem, ceremonyKey: string): string {
  if (event.bgImageUrl) return event.bgImageUrl;
  if (event.photoUrl && !event.photoUrl.includes('placeholder')) return event.photoUrl;
  return CEREMONY_THEMES[ceremonyKey]?.defaultBg || royalSindoorImg;
}

export const SceneFunctions3D: React.FC<SceneFunctions3DProps> = ({
  config,
  onTriggerPetalShower,
}) => {
  const isChristian = isChristianTheme(config);
  const isMuslim = isMuslimTheme(config);
  const events = config.events || [];
  const [activeCeremonyId, setActiveCeremonyId] = useState<string>(events[0]?.id || 'e-1');
  const [blessingCounts, setBlessingCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    events.forEach((evt, idx) => {
      const saved = localStorage.getItem(`wedding_blessings_${evt.id}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        initial[evt.id] = isNaN(parsed) ? (evt.blessingCount || 120 + idx * 45) : parsed;
      } else {
        const fallback = evt.blessingCount ?? (120 + idx * 45);
        initial[evt.id] = isNaN(fallback) ? 120 : fallback;
      }
    });
    return initial;
  });

  const [activeBlessingToast, setActiveBlessingToast] = useState<{ id: string; count: number } | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // 3D Card Tilt State for mouse movement
  const [cardTilt, setCardTilt] = useState<{ x: number; y: number; id: string | null }>({
    x: 0,
    y: 0,
    id: null,
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setCardTilt({ x: rotateX, y: rotateY, id });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0, id: null });
  };

  const toggleCardFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    weddingAudio.playCardFlipSound();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Interactive Bless Now handler: drops petals, increments counter, plays sound
  const handleBlessCeremony = (event: EventItem, ceremonyKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Increment count
    const nextCount = (blessingCounts[event.id] || 100) + 1;
    setBlessingCounts((prev) => ({
      ...prev,
      [event.id]: nextCount,
    }));
    localStorage.setItem(`wedding_blessings_${event.id}`, nextCount.toString());

    // 2. Play celebratory audio sound
    const theme = CEREMONY_THEMES[ceremonyKey] || CEREMONY_THEMES.vivaha;
    if (theme.soundType === 'church') {
      weddingAudio.playChurchChimesSound();
    } else if (theme.soundType === 'haldi' || theme.soundType === 'mehendi') {
      weddingAudio.playTempleBellSound();
    } else if (theme.soundType === 'sangeet') {
      weddingAudio.playFireworkSound();
    } else {
      weddingAudio.playBlessingChime();
    }

    // 3. Drop Petals Burst (Confetti)
    confetti({
      particleCount: 50,
      angle: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: theme.petalColors,
    });

    // 4. Trigger global ambient petal shower
    if (onTriggerPetalShower) {
      onTriggerPetalShower();
    }

    // 5. Show celebratory floating toast badge
    setActiveBlessingToast({ id: event.id, count: nextCount });
    setTimeout(() => {
      setActiveBlessingToast((curr) => (curr?.id === event.id ? null : curr));
    }, 2400);
  };

  const handleAddToCalendar = (event: EventItem) => {
    const title = encodeURIComponent(`${event.title} - Wedding of ${config.groomName} & ${config.brideName}`);
    const details = encodeURIComponent(
      `${event.description}\n\nDress Code: ${event.dressCode || 'Traditional Wedding Festive'}\nVenue: ${event.venue}\nCouple: ${config.groomName} & ${config.brideName}`
    );
    const location = encodeURIComponent(`${event.venue}, ${config.venueCity}`);
    const cleanDate = config.weddingDate.replace(/-/g, '');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T100000Z/${cleanDate}T230000Z`;
    window.open(googleCalUrl, '_blank');
  };

  const scrollToCeremony = (id: string) => {
    setActiveCeremonyId(id);
    const el = document.getElementById(`ceremony-section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="scene-functions-3d-wrapper" className="relative w-full text-white">
      {/* Top Floating Ceremony Navigation Bar */}
      <div className="sticky top-0 z-40 w-full bg-neutral-950/85 backdrop-blur-md border-y border-amber-500/30 px-3 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-1.5 shrink-0 pr-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          <span className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest hidden sm:inline">
            3D Ceremonies:
          </span>
        </div>

        {/* Ceremony Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {events.map((evt) => {
            const cKey = getCeremonyType(evt.title);
            const isActive = activeCeremonyId === evt.id;
            return (
              <button
                key={evt.id}
                type="button"
                onClick={() => scrollToCeremony(evt.id)}
                className={`px-3 py-1 rounded-full text-xs font-cinzel font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-105'
                    : 'bg-black/50 text-neutral-300 hover:text-amber-200 border-amber-500/30 hover:border-amber-400/60'
                }`}
              >
                <span>
                  {cKey === 'nikah' && '🌙 Sacred Nikah'}
                  {cKey === 'walima' && '✨ Grand Walima'}
                  {cKey === 'aarsi_mushaf' && '🪞 Aarsi Mushaf'}
                  {cKey === 'nuptial_mass' && '✝ Nuptial Mass'}
                  {cKey === 'holy_vows' && '💍 Holy Vows'}
                  {cKey === 'garden_arch' && '🌿 Garden Walk'}
                  {cKey === 'banquet_dance' && '🥂 Banquet & Waltz'}
                  {cKey === 'haldi' && (isMuslim ? '💛 Mayun' : '🟡 Haldi')}
                  {cKey === 'mehendi' && (isMuslim ? '🌿 Mehndi Ki Raat' : '🟢 Mehendi')}
                  {cKey === 'sangeet' && '🟣 Sangeeth'}
                  {cKey === 'vivaha' && '🔴 Vivaha'}
                  {cKey === 'reception' && '⚪ Reception'}
                </span>
                <span className="text-[10px] opacity-80 font-mono">
                  ({blessingCounts[evt.id] || 0})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Each Ceremony as its Dedicated Full 3D Section */}
      {events.map((event, index) => {
        const ceremonyKey = getCeremonyType(event.title);
        const theme = CEREMONY_THEMES[ceremonyKey] || CEREMONY_THEMES.vivaha;
        const bgImage = getCeremonyBg(event, ceremonyKey);
        const isFlipped = Boolean(flippedCards[event.id]);
        const isHovered = cardTilt.id === event.id;
        const count = blessingCounts[event.id] || 0;

        return (
          <section
            key={event.id}
            id={`ceremony-section-${event.id}`}
            className="relative w-full min-h-[750px] py-12 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden border-b border-amber-500/30 transition-all select-none"
            style={{
              backgroundColor: '#0A0508',
            }}
          >
            {/* BACKGROUND IMAGE FOR THIS SPECIFIC SECTION */}
            <div className="absolute inset-0 z-0">
              <img
                src={bgImage}
                alt={`${event.title} Background`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out brightness-[0.98] contrast-[1.1]"
              />

              {/* Atmospheric Multi-layer Gradient Vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    ceremonyKey === 'nuptial_mass'
                      ? 'linear-gradient(to bottom, rgba(20,10,32,0.72) 0%, rgba(35,14,48,0.42) 40%, rgba(12,6,20,0.94) 100%)'
                      : ceremonyKey === 'holy_vows'
                      ? 'linear-gradient(to bottom, rgba(30,12,24,0.74) 0%, rgba(46,16,36,0.40) 40%, rgba(18,6,15,0.94) 100%)'
                      : ceremonyKey === 'garden_arch'
                      ? 'linear-gradient(to bottom, rgba(12,25,18,0.70) 0%, rgba(18,36,25,0.40) 40%, rgba(8,18,12,0.94) 100%)'
                      : ceremonyKey === 'banquet_dance'
                      ? 'linear-gradient(to bottom, rgba(22,12,38,0.72) 0%, rgba(36,18,56,0.40) 40%, rgba(14,7,24,0.95) 100%)'
                      : ceremonyKey === 'haldi'
                      ? 'linear-gradient(to bottom, rgba(30,15,2,0.72) 0%, rgba(50,25,3,0.45) 40%, rgba(20,10,2,0.92) 100%)'
                      : ceremonyKey === 'mehendi'
                      ? 'linear-gradient(to bottom, rgba(5,25,18,0.75) 0%, rgba(10,35,22,0.45) 40%, rgba(4,18,12,0.95) 100%)'
                      : ceremonyKey === 'sangeet'
                      ? 'linear-gradient(to bottom, rgba(20,5,30,0.75) 0%, rgba(30,10,40,0.45) 40%, rgba(15,3,25,0.95) 100%)'
                      : ceremonyKey === 'reception'
                      ? 'linear-gradient(to bottom, rgba(15,10,35,0.75) 0%, rgba(25,15,45,0.45) 40%, rgba(10,5,25,0.95) 100%)'
                      : 'linear-gradient(to bottom, rgba(40,5,15,0.75) 0%, rgba(60,10,20,0.45) 40%, rgba(25,3,10,0.95) 100%)',
                }}
              />

              {/* Shimmering Golden Fairy Lights in background */}
              <FairyLightsOverlay opacity={0.75} />

              {/* Twinkling ambient sparkles */}
              <div className="absolute top-1/4 left-8 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle" />
              <div className="absolute bottom-1/3 right-8 w-2.5 h-2.5 rounded-full bg-amber-300 animate-sparkle delay-500" />
            </div>

            {/* Top Ceremony Identification Banner */}
            <div className="relative z-20 max-w-xl w-full text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
                <span className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest">
                  Function #{index + 1} • {ceremonyKey.toUpperCase()} 3D EXPERIENCE
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-sparkle" />
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {event.title}
              </h2>

              <p className="font-editorial italic text-amber-200/90 text-sm sm:text-base mt-1 max-w-md mx-auto drop-shadow-md">
                &ldquo;{event.tagline || theme.tagline}&rdquo;
              </p>
            </div>

            {/* 3D INTERACTIVE CEREMONY CARD CONTAINER */}
            <div
              className="relative z-20 w-full max-w-md perspective-1000 my-auto"
              onMouseMove={(e) => handleCardMouseMove(e, event.id)}
              onMouseLeave={handleCardMouseLeave}
            >
              <div
                className="w-full rounded-3xl transition-transform duration-200 ease-out preserve-3d"
                style={{
                  transform: isHovered
                    ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                    : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                }}
              >
                {/* 3D Front / Back Card Body */}
                <div
                  className="relative rounded-3xl overflow-hidden border-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl p-5 sm:p-6"
                  style={{
                    backgroundColor: 'rgba(18, 10, 20, 0.82)',
                    borderColor: '#FBBF24',
                    boxShadow: '0 0 35px rgba(251, 191, 36, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {/* Traditional Auspicious Corner Motifs */}
                  <div className="absolute top-2.5 left-2.5 pointer-events-none text-amber-400/80 text-sm">✦</div>
                  <div className="absolute top-2.5 right-2.5 pointer-events-none text-amber-400/80 text-sm">✦</div>
                  <div className="absolute bottom-2.5 left-2.5 pointer-events-none text-amber-400/80 text-sm">✦</div>
                  <div className="absolute bottom-2.5 right-2.5 pointer-events-none text-amber-400/80 text-sm">✦</div>

                  {/* Card Flip Content: Front vs Details */}
                  {!isFlipped ? (
                    /* FRONT OF 3D CARD */
                    <div className="space-y-4">
                      {/* Photo Cameo Banner with 3D Pop */}
                      {event.photoUrl && (
                        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-amber-400/60 shadow-inner group/photo">
                          <img
                            src={event.photoUrl}
                            alt={event.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                          {/* Floating Muhurat Pill on Photo */}
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-amber-300/80 text-amber-300 text-[10px] font-cinzel font-bold shadow-md">
                            {event.muhurat || 'Auspicious Muhurat'}
                          </div>

                          {/* 3D Flip Hint Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleCardFlip(event.id, e)}
                            className="absolute top-3 right-3 bg-amber-500/80 hover:bg-amber-500 text-white p-1.5 rounded-full backdrop-blur-md border border-amber-200 transition-all shadow-md active:scale-95"
                            title="Flip 3D Card for Rituals"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Bottom caption */}
                          <div className="absolute bottom-2.5 left-3 right-3 text-left">
                            <span className="text-[10px] font-cinzel text-amber-300 font-bold uppercase tracking-wider block">
                              Celebration Venue
                            </span>
                            <h4 className="font-classic text-sm font-bold text-white truncate">
                              {event.venue}
                            </h4>
                          </div>
                        </div>
                      )}

                      {/* Date & Time Highlights Row */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-white/5 border border-amber-400/30 rounded-xl p-2.5 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] font-cinzel text-neutral-400 uppercase tracking-wider block">
                              Date
                            </span>
                            <span className="font-cinzel text-xs font-bold text-amber-100 truncate block">
                              {event.date}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white/5 border border-amber-400/30 rounded-xl p-2.5 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-rose-300" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] font-cinzel text-neutral-400 uppercase tracking-wider block">
                              Timing
                            </span>
                            <span className="font-cinzel text-xs font-bold text-amber-100 truncate block">
                              {event.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description Narrative */}
                      <p className="font-montserrat text-xs text-neutral-200 leading-relaxed text-center px-1">
                        {event.description}
                      </p>

                      {/* Dress Code / Shringar Guide */}
                      {event.dressCode && (
                        <div className="bg-amber-950/40 border border-amber-400/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 font-cinzel font-bold text-[10px] uppercase tracking-wider">
                              Attire:
                            </span>
                            <span className="font-montserrat text-neutral-200 text-[11px] truncate">
                              {event.dressCode}
                            </span>
                          </div>
                          {event.attireColors && (
                            <div className="flex items-center gap-1 shrink-0">
                              {event.attireColors.map((color, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* RITUAL TAGS */}
                      {event.rituals && event.rituals.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                          {event.rituals.map((ritual, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] font-cinzel font-medium bg-black/40 text-amber-200/90 border border-amber-400/30 px-2 py-0.5 rounded-md"
                            >
                              ✦ {ritual}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* ACTION BUTTONS: BLESS NOW WITH COUNT + PETALS DROP */}
                      <div className="pt-2 flex flex-col gap-2">
                        {/* THE PROMINENT BLESS NOW BUTTON */}
                        <button
                          id={`bless-now-btn-${event.id}`}
                          type="button"
                          onClick={(e) => handleBlessCeremony(event, ceremonyKey, e)}
                          className="w-full group relative flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-500 hover:to-rose-500 text-white font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.5)] border-2 border-amber-300 transition-all active:scale-95 shining-sweep"
                        >
                          <Heart className="w-4 h-4 text-amber-200 fill-current group-hover:scale-125 transition-transform" />
                          <span>{isChristian ? 'Holy Blessing ✨ (Rose Petals)' : 'Bless Now ✨ (Drop Petals)'}</span>
                          <span className="bg-black/50 text-amber-200 text-xs px-2.5 py-0.5 rounded-full border border-amber-400/60 font-mono font-bold shadow-inner">
                            {count}
                          </span>
                        </button>

                        {/* Calendar & Map Directions Row */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCalendar(event)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-amber-100 text-xs font-cinzel font-semibold transition-all active:scale-95"
                          >
                            <CalendarPlus className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Cal</span>
                          </button>

                          <a
                            href={config.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-cinzel font-semibold transition-all active:scale-95"
                          >
                            <Navigation className="w-3.5 h-3.5 text-amber-300" />
                            <span>Directions</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BACK OF 3D CARD: SACRED DETAILS & VOWS */
                    <div className="space-y-4 py-2">
                      <div className="flex items-center justify-between border-b border-amber-400/30 pb-2">
                        <span className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          {isChristian ? 'Sacred Vows & Cathedral Details' : 'Ceremonial Insights & Vows'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleCardFlip(event.id, e)}
                          className="text-xs text-amber-200/80 hover:text-white flex items-center gap-1 font-cinzel"
                        >
                          <RotateCw className="w-3 h-3" /> Back
                        </button>
                      </div>

                      {/* Spiritual Mantra / Holy Scripture */}
                      <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-400/30 text-center">
                        <p className="font-cinzel text-xs text-amber-200 font-semibold italic">
                          {isChristian
                            ? '“Love never fails. And now these three remain: faith, hope and love. But the greatest of these is love.” • 1 Corinthians 13:13'
                            : '“May the sacred fragrance of fresh flower petals and divine blessings illuminate every step of this union.”'}
                        </p>
                      </div>

                      {/* Venue Address */}
                      <div>
                        <span className="text-[10px] font-cinzel text-neutral-400 uppercase tracking-wider block">
                          Venue Location
                        </span>
                        <p className="font-montserrat text-xs text-neutral-200 font-medium mt-0.5">
                          {event.venue} — {config.venueAddress || config.venueCity}
                        </p>
                      </div>

                      {/* Special Arrangements */}
                      <div className="space-y-1 text-xs font-montserrat text-neutral-300">
                        <span className="text-[10px] font-cinzel text-amber-300 font-bold uppercase tracking-wider block">
                          Guest Highlights
                        </span>
                        {isChristian ? (
                          <>
                            <p>✦ Cathedral organist, violin serenades &amp; choral hymns.</p>
                            <p>✦ Champagne reception, multi-course banquet &amp; wedding cake.</p>
                            <p>✦ Memorial signature guest book &amp; floral photo pergola.</p>
                          </>
                        ) : (
                          <>
                            <p>✦ Live catering featuring authentic regional delicacies.</p>
                            <p>✦ Valet parking &amp; golf cart transfers available at main portico.</p>
                            <p>✦ Professional photography zone with floral arches.</p>
                          </>
                        )}
                      </div>

                      {/* Direct Bless Button on Back */}
                      <button
                        type="button"
                        onClick={(e) => handleBlessCeremony(event, ceremonyKey, e)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-cinzel text-xs font-bold shadow-md border border-amber-300 transition-all active:scale-95"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-white" />
                        <span>{isChristian ? 'Shower White Petals Now' : 'Shower Petals Now'} ({count})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FLOATING +1 BLESSING TOAST ANIMATION */}
            <AnimatePresence>
              {activeBlessingToast?.id === event.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: -40, scale: 1 }}
                  exit={{ opacity: 0, y: -70, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="fixed bottom-24 z-50 pointer-events-none px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-rose-600 border-2 border-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex items-center gap-2 text-white font-cinzel text-xs font-bold"
                >
                  <Heart className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
                  <span>+1 Blessing Showered! Petals Falling 🌸</span>
                  <span className="font-mono text-yellow-200">({activeBlessingToast.count})</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Section Link */}
            <div className="relative z-20 mt-6 text-center">
              <span className="text-[11px] font-cinzel text-neutral-400 uppercase tracking-widest">
                {index < events.length - 1 ? 'Scroll down for next 3D function ↓' : 'Next: Sky Fireworks Celebration ↓'}
              </span>
            </div>
          </section>
        );
      })}
    </div>
  );
};
