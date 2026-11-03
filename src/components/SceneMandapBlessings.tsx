import React, { useState } from 'react';
import { MapPin, Navigation, CalendarPlus, Heart, Sparkles, Star } from 'lucide-react';
import { InvitationConfig } from '../types';
import radiantMandapBg from '../assets/images/radiant_mandap_palace_1788517140602.jpg';
import mandapArtImg from '../assets/images/mandap_art_1788532238310.jpg';
import royalSindoorImg from '../assets/images/royal_sindoor_vivaha_1788535101917.jpg';
import {
  isKeralaTheme,
  isNorthIndianTheme,
  isChristianTheme,
  isMuslimTheme,
  christianFairyArchTunnelImg,
  muslimNikahSigningImg,
} from '../data/weddingPresets';
import { weddingAudio } from '../utils/audioSynth';
import { FairyLightsOverlay } from './FairyLightsOverlay';
import confetti from 'canvas-confetti';

interface SceneMandapBlessingsProps {
  config: InvitationConfig;
  onTriggerPetalShower: () => void;
}

export const SceneMandapBlessings: React.FC<SceneMandapBlessingsProps> = ({
  config,
  onTriggerPetalShower,
}) => {
  const [blessingsCount, setBlessingsCount] = useState(48);
  const [hasBlessed, setHasBlessed] = useState(false);
  const isKerala = isKeralaTheme(config);
  const isNorthIndian = isNorthIndianTheme(config);
  const isChristian = isChristianTheme(config);
  const isMuslim = isMuslimTheme(config);

  const bgImg = isMuslim
    ? muslimNikahSigningImg
    : isChristian
    ? christianFairyArchTunnelImg
    : isNorthIndian
    ? royalSindoorImg
    : isKerala
    ? (config.theme?.backdropArtwork || mandapArtImg)
    : radiantMandapBg;

  const handleBlessCouple = () => {
    setBlessingsCount((prev) => prev + 1);
    setHasBlessed(true);
    if (isKerala) {
      weddingAudio.playTempleBellSound();
    }
    weddingAudio.playBlessingChime();
    onTriggerPetalShower();

    confetti({
      particleCount: isChristian ? 60 : isKerala ? 65 : isMuslim ? 70 : 55,
      spread: 80,
      origin: { y: 0.7 },
      colors: isMuslim
        ? ['#FBBF24', '#34D399', '#FFFDF7', '#F472B6', '#F59E0B']
        : isChristian
        ? ['#FFFFFF', '#FAF5FF', '#FEF08A', '#F59E0B', '#E0E7FF']
        : config.theme?.petalColors || (isKerala ? ['#FFFFFF', '#FEF08A', '#F59E0B', '#F472B6', '#34D399'] : ['#E11D48', '#FB7185', '#F59E0B', '#FFD700', '#FFFFFF']),
    });
  };

  const handleAddToCalendar = () => {
    // Generate Google Calendar Link
    const title = encodeURIComponent(`Wedding of ${config.groomName} & ${config.brideName}`);
    const details = encodeURIComponent(
      `Celebrating the wedding of ${config.groomName} & ${config.brideName} at ${config.venueName}, ${config.venueCity}. We look forward to your gracious presence!`
    );
    const location = encodeURIComponent(`${config.venueName}, ${config.venueAddress}`);
    // Start date format YYYYMMDDTHHmmssZ
    const cleanDate = config.weddingDate.replace(/-/g, '');
    const cleanTime = config.weddingTime.replace(/:/g, '') + '00';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T${cleanTime}/${cleanDate}T235900`;

    window.open(googleCalUrl, '_blank');
  };

  return (
    <section
      className="relative w-full min-h-[680px] h-full flex flex-col items-center justify-between overflow-hidden select-none text-white py-6"
      style={{ backgroundColor: config.theme?.primaryBg || (isKerala ? '#0C2518' : '#240B12') }}
    >
      {/* Background: Radiant Grand Mandap or Enchanted Fairy Arch Tunnel */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImg}
          alt={
            isMuslim
              ? '3D Sacred Nikahnama Solemnization under Floral Canopy'
              : isChristian
              ? 'Enchanted Cathedral Garden Floral Arch Tunnel & Fairy Light Runway'
              : 'Royal Mandap Blessings'
          }
          className="w-full h-full object-cover object-center brightness-[1.04] contrast-[1.08] saturate-[1.18]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isMuslim
              ? `linear-gradient(to bottom, rgba(6,78,59,0.72), rgba(9,33,23,0.50), rgba(5,26,18,0.95))`
              : isChristian
              ? `linear-gradient(to bottom, rgba(13,8,20,0.65), rgba(24,14,36,0.35), rgba(13,8,20,0.92))`
              : isNorthIndian
              ? `linear-gradient(to bottom, rgba(133,11,27,0.72), rgba(45,10,15,0.58), rgba(133,11,27,0.92))`
              : isKerala
              ? `linear-gradient(to bottom, rgba(6,78,59,0.7), ${config.theme?.primaryBg || '#0C2518'}55, rgba(0,0,0,0.92))`
              : `linear-gradient(to bottom, rgba(0,0,0,0.5), ${config.theme?.primaryBg || '#240B12'}50, rgba(0,0,0,0.85))`,
          }}
        />

        {/* Shimmering Golden Fairy Lights for North Indian theme */}
        {isNorthIndian && <FairyLightsOverlay opacity={0.8} />}

        {/* Shimmering Golden Fairy Light Dust */}
        <div className="absolute top-1/5 left-10 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle" />
        <div className="absolute top-1/3 right-12 w-2.5 h-2.5 rounded-full bg-amber-300 animate-sparkle delay-400" />
      </div>

      {/* Top Auspicious Inscription */}
      <div className="relative z-20 w-full flex flex-col items-center pt-2 px-4 text-center">
        <div
          className="backdrop-blur-md px-5 py-2 rounded-full border shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          style={{
            backgroundColor: `${config.theme?.cardBg || (isKerala ? '#153826' : '#18040A')}cc`,
            borderColor: `${config.theme?.borderGold || '#FBBF24'}80`,
          }}
        >
          <p className="text-amber-300 font-cinzel text-xs font-bold tracking-widest uppercase flex items-center gap-2 justify-center drop-shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
            {config.theme?.culturalInvocation || (isKerala ? '॥ OM SRI MAHAGANAPATAYE NAMAHA • KERALA VIVAHA ॥' : 'Sacred Auspicious Union')}
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          </p>
        </div>
      </div>

      {/* Center Interactive Blessing Action */}
      <div className="relative z-20 w-full flex flex-col items-center px-4 my-auto text-center">
        {isKerala ? (
          /* 3D Animated Full-Body Couple Visual Showcase */
          <div className="relative max-w-sm w-full my-2 flex flex-col items-center">
            <div className="relative w-48 sm:w-56 h-64 sm:h-72 rounded-3xl p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-emerald-600 shadow-[0_0_40px_rgba(245,158,11,0.5)] border-2 border-amber-300 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={config.heroCouplePhoto}
                alt="3D Animated Full-Body Kerala Couple Visual"
                className="w-full h-full object-cover object-top rounded-2xl brightness-[1.02] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
              
              {/* Top Tag */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
                <span className="bg-emerald-950/85 backdrop-blur-md text-amber-300 text-[9px] font-cinzel font-bold px-2.5 py-0.5 rounded-full border border-amber-400/60 uppercase tracking-wider">
                  3D Animated Couple
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-mono">
                  Kasavu &amp; Mundu
                </span>
              </div>

              {/* Bottom Caption on Card */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center pointer-events-none">
                <p className="text-[10px] text-amber-200/90 font-serif italic line-clamp-2">
                  White &amp; gold Kasavu saree, temple jewelry &amp; Mullappoo jasmine woven braid
                </p>
              </div>
            </div>

            <h3 className="font-script text-4xl sm:text-5xl text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-2.5">
              {config.groomName} &amp; {config.brideName}
            </h3>
            <p className="text-[11px] font-cinzel text-emerald-200 font-bold tracking-widest uppercase mt-0.5 drop-shadow-xs">
              Seek Your Gracious Blessings &amp; Mullappoo Petals
            </p>
          </div>
        ) : (
          /* Standard Couple Cameo */
          <div className="relative mb-2">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-[0_0_35px_rgba(255,215,0,0.6)] mx-auto mb-3 border-2 border-amber-200/90 animate-aura-glow transform hover:scale-105 transition-transform duration-300">
              <img
                src={config.heroCouplePhoto}
                alt="Couple Blessing"
                className="w-full h-full object-cover rounded-full brightness-[1.02] contrast-[1.05]"
              />
              <div className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#FFFFFF] animate-sparkle" />
            </div>

            <h3 className="font-script text-4xl sm:text-5xl text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {config.groomName} &amp; {config.brideName}
            </h3>
            <p className="text-[11px] font-cinzel text-amber-100 font-semibold tracking-widest uppercase mt-0.5 drop-shadow-xs">
              {isMuslim
                ? 'Seek Allah’s Divine Blessings, Love & Heartfelt Du’as'
                : isChristian
                ? 'Seek God’s Richest Blessings & Sacred Love'
                : 'Seek Your Gracious Blessings & Love'}
            </p>
          </div>
        )}

        {/* Phoolon ki Baarish (Shower Petals Button) */}
        <button
          id="shower-blessings-button"
          onClick={handleBlessCouple}
          type="button"
          className="mt-3 group relative inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-600 text-white text-xs font-cinzel font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(255,215,0,0.4)] border border-amber-300 transform active:scale-95 transition-all shining-sweep"
        >
          <Heart
            className={`w-4 h-4 text-amber-200 ${
              hasBlessed ? 'fill-current text-rose-300 scale-110' : 'group-hover:scale-110'
            } transition-transform`}
          />
          <span>
            {isMuslim
              ? 'Shower Jasmine & Rose Petals 🌸'
              : isChristian
              ? 'Shower White Rose Petals ✨'
              : isKerala
              ? 'Shower Jasmine Mullappoo Petals ✨'
              : 'Shower Flower Petals ✨'}
          </span>
          <span className="bg-black/40 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-amber-200 font-bold shadow-inner">
            {blessingsCount}
          </span>
        </button>
      </div>

      {/* Bottom Venue & Directions Card */}
      <div className="relative z-20 w-full flex flex-col items-center pb-4 px-4">
        <div
          className="w-full max-w-sm backdrop-blur-md rounded-2xl p-4.5 border shadow-[0_0_30px_rgba(0,0,0,0.9)] text-center"
          style={{
            backgroundColor: `${config.theme?.cardBg || (isKerala ? '#153826' : '#18040A')}e0`,
            borderColor: `${config.theme?.borderGold || '#F59E0B'}70`,
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-cinzel font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isMuslim
                ? 'Sacred Nikah & Walima Destination'
                : isChristian
                ? 'Holy Matrimony Cathedral & Venue'
                : 'The Wedding Destination'}
            </span>
          </div>

          <h4 className="font-classic text-xl font-bold text-white mb-0.5">
            {config.venueName}
          </h4>
          <p className="text-xs text-amber-100/90 font-body mb-3 font-medium">
            {config.venueAddress}
          </p>

          <div className="flex items-center gap-2.5 justify-center pt-2.5 border-t border-amber-400/20">
            <a
              id="venue-map-link"
              href={config.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/50 text-xs font-cinzel font-bold transition-all shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              Get Directions
            </a>

            <button
              id="add-calendar-button"
              onClick={handleAddToCalendar}
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-cinzel font-bold transition-all shadow-sm"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-amber-300" />
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

