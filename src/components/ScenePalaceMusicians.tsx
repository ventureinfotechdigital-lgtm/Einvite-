import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Star } from 'lucide-react';
import { InvitationConfig } from '../types';
import shiningPalaceMusiciansBg from '../assets/images/shining_palace_musicians_1788517105210.jpg';
import southTempleGopuramImg from '../assets/images/south_temple_gopuram_1788535078716.jpg';
import joyfulVarmalaImg from '../assets/images/joyful_varmala_art_1788532266907.jpg';
import {
  isKeralaTheme,
  isNorthIndianTheme,
  isChristianTheme,
  isMuslimTheme,
  isRajasthanTheme,
  isTamilTheme,
  christianCathedralCrossAisleImg,
  muslimMehndiPalaceImg,
  rajasthanFolkMusiciansImg,
  tamilMandapamMuhurthamImg,
} from '../data/weddingPresets';
import { FairyLightsOverlay } from './FairyLightsOverlay';

interface ScenePalaceMusiciansProps {
  config: InvitationConfig;
}

function parseWeddingTargetDate(dateStr?: string, timeStr?: string): number {
  if (!dateStr) {
    return Date.now() + 60 * 24 * 60 * 60 * 1000;
  }

  let hours = 11;
  let minutes = 0;

  if (timeStr) {
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const modifier = timeMatch[3]?.toUpperCase();

      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;

      hours = isNaN(h) ? 11 : h;
      minutes = isNaN(m) ? 0 : m;
    }
  }

  const ymdMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day, hours, minutes, 0);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    parsed.setHours(hours, minutes, 0, 0);
    return parsed.getTime();
  }

  return Date.now() + 60 * 24 * 60 * 60 * 1000;
}

export const ScenePalaceMusicians: React.FC<ScenePalaceMusiciansProps> = ({ config }) => {
  const isKerala = isKeralaTheme(config);
  const isNorthIndian = isNorthIndianTheme(config);
  const isChristian = isChristianTheme(config);
  const isMuslim = isMuslimTheme(config);
  const isRajasthan = isRajasthanTheme(config);

  const bgImg = isRajasthan
    ? rajasthanFolkMusiciansImg
    : isMuslim
    ? muslimMehndiPalaceImg
    : isChristian
    ? (config.theme?.backdropArtwork || christianCathedralCrossAisleImg)
    : isNorthIndian
    ? joyfulVarmalaImg
    : isKerala
    ? (config.theme?.backdropArtwork || southTempleGopuramImg)
    : shiningPalaceMusiciansBg;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = parseWeddingTargetDate(config.weddingDate, config.weddingTime);
      const now = Date.now();
      const diff = target - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: isNaN(days) ? 0 : Math.max(0, days),
        hours: isNaN(hours) ? 0 : Math.max(0, hours),
        minutes: isNaN(minutes) ? 0 : Math.max(0, minutes),
        seconds: isNaN(seconds) ? 0 : Math.max(0, seconds),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.weddingDate, config.weddingTime]);

  return (
    <section
      className="relative w-full min-h-[640px] h-full flex flex-col items-center justify-between overflow-hidden select-none text-white"
      style={{ backgroundColor: config.theme?.primaryBg || (isKerala ? '#0C2518' : '#18040A') }}
    >
      {/* Background: Cathedral Cross Aisle, Kerala Temple Gopuram, or Shining Palace Courtyard */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImg}
          alt={
            isMuslim
              ? '3D Grand Mughal Palace illuminated with lanterns, crescent moon and courtyard fountain'
              : isChristian
              ? 'Grand Cathedral Sanctuary Aisle with Lanterns & Glowing Holy Cross'
              : isKerala
              ? 'Kerala Temple Nilavilakku & Musicians Ambiance'
              : 'Palace Sitar & Harmonium Musicians'
          }
          className="w-full h-full object-cover object-center brightness-[1.04] contrast-[1.08] saturate-[1.2]"
        />
        {/* Warm gradient overlay matching preset primary tone */}
        <div
          className="absolute inset-0"
          style={{
            background: isRajasthan
              ? `linear-gradient(to bottom, rgba(26,5,11,0.72), rgba(76,5,25,0.45), rgba(26,5,11,0.92))`
              : isMuslim
              ? `linear-gradient(to bottom, rgba(6,78,59,0.72), rgba(9,33,23,0.50), rgba(5,26,18,0.94))`
              : isChristian
              ? `linear-gradient(to bottom, rgba(13,8,20,0.65), rgba(24,14,36,0.40), rgba(13,8,20,0.92))`
              : isNorthIndian
              ? `linear-gradient(to bottom, rgba(133,11,27,0.72), rgba(45,10,15,0.60), rgba(133,11,27,0.92))`
              : isKerala
              ? `linear-gradient(to bottom, rgba(6,78,59,0.75), ${config.theme?.primaryBg || '#0C2518'}55, rgba(0,0,0,0.92))`
              : `linear-gradient(to bottom, rgba(0,0,0,0.55), ${config.theme?.primaryBg || '#18040A'}40, rgba(0,0,0,0.88))`,
          }}
        />

        {/* Fairy lights for North Indian and Rajasthan themes */}
        {(isNorthIndian || isRajasthan) && <FairyLightsOverlay opacity={0.85} />}

        {/* Floating golden sparkle motes */}
        <div className="absolute top-1/4 right-8 w-3 h-3 rounded-full bg-yellow-200 animate-sparkle" />
        <div className="absolute top-1/3 left-6 w-2.5 h-2.5 rounded-full bg-amber-300 animate-sparkle delay-500" />
      </div>

      {/* Top Monogram Crest */}
      <div className="relative z-20 w-full flex flex-col items-center pt-8 px-4 text-center">
        <div className="relative flex flex-col items-center">
          {/* Glowing Monogram Emblem with Aura */}
          <div
            className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 backdrop-blur-md shadow-[0_0_40px_rgba(255,215,0,0.6)] animate-aura-glow"
            style={{
              borderColor: config.theme?.borderGold || '#FBBF24',
              background: `radial-gradient(circle, ${config.theme?.accentGold || '#F59E0B'}40, ${config.theme?.cardBg || '#2A0610'}cc, #000000)`,
            }}
          >
            {/* Ornate flourishes around circle */}
            <div
              className="absolute -inset-2 border-2 rounded-full animate-spin-slow pointer-events-none"
              style={{ borderColor: `${config.theme?.borderGold || '#FBBF24'}50` }}
            />

            <span className="font-title text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-yellow-200 via-amber-100 to-yellow-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] tracking-tight">
              {config.monogramText}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 text-amber-200 text-xs font-cinzel tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
            <span className="font-bold">
              {isRajasthan
                ? '🦚 3D Royal Rajasthan Vivaah Countdown 🦚'
                : isMuslim
                ? '🌙 Nikah Mubarak & Walima Countdown 🌙'
                : isChristian
                ? '✝ Holy Matrimony Nuptial Countdown ✝'
                : config.theme?.badge || 'The Royal Celebration'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-sparkle" />
          </div>
        </div>
      </div>

      {/* Center Sacred Scripture / Shloka & Cultural Theme Aura */}
      <div className="relative z-10 w-full flex justify-center px-4 py-2">
        <div
          className="max-w-md px-5 py-2.5 rounded-full backdrop-blur-md border text-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          style={{
            backgroundColor: `${config.theme?.cardBg || '#2A0610'}cc`,
            borderColor: `${config.theme?.borderGold || '#FBBF24'}90`,
          }}
        >
          <p className="text-amber-200 text-xs sm:text-sm font-serif italic tracking-wide">
            {config.theme?.shloka ||
              (isChristian
                ? '“Therefore what God has joined together, let no one separate.” • Mark 10:9'
                : 'Yadetad hridayam tava tadastu hridayam mama • Yadidam hridayam mama tadastu hridayam tava')}
          </p>
          {config.theme?.shlokaMeaning && (
            <p className="text-[10px] text-amber-100/80 font-body mt-0.5 line-clamp-1">
              {config.theme.shlokaMeaning}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Proclamation & Live Countdown Timer */}
      <div className="relative z-20 w-full flex flex-col items-center pb-8 px-4 text-center">
        <div
          className="w-full max-w-sm backdrop-blur-md rounded-2xl p-4.5 border shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          style={{
            backgroundColor: `${config.theme?.cardBg || '#18040A'}d4`,
            borderColor: `${config.theme?.borderGold || '#F59E0B'}80`,
          }}
        >
          <p className="text-amber-100/95 text-xs font-editorial italic mb-3 leading-relaxed px-2">
            &ldquo;{config.welcomeMessage}&rdquo;
          </p>

          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <p className="font-cinzel text-amber-300 text-sm font-bold tracking-widest uppercase">
              {isChristian ? 'Countdown to Holy Matrimony' : 'Countdown to the Big Day'}
            </p>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </div>

          {/* 4 Block Countdown */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-amber-950/80 border border-amber-400/50 rounded-xl py-2 flex flex-col items-center shadow-inner">
              <span className="font-cinzel text-xl font-bold text-amber-200 drop-shadow-[0_0_6px_rgba(255,215,0,0.4)]">
                {String(Number.isNaN(timeLeft.days) ? 0 : timeLeft.days)}
              </span>
              <span className="text-[10px] text-amber-300 font-body uppercase tracking-wider font-semibold">
                Days
              </span>
            </div>
            <div className="bg-amber-950/80 border border-amber-400/50 rounded-xl py-2 flex flex-col items-center shadow-inner">
              <span className="font-cinzel text-xl font-bold text-amber-200 drop-shadow-[0_0_6px_rgba(255,215,0,0.4)]">
                {String(Number.isNaN(timeLeft.hours) ? 0 : timeLeft.hours)}
              </span>
              <span className="text-[10px] text-amber-300 font-body uppercase tracking-wider font-semibold">
                Hours
              </span>
            </div>
            <div className="bg-amber-950/80 border border-amber-400/50 rounded-xl py-2 flex flex-col items-center shadow-inner">
              <span className="font-cinzel text-xl font-bold text-amber-200 drop-shadow-[0_0_6px_rgba(255,215,0,0.4)]">
                {String(Number.isNaN(timeLeft.minutes) ? 0 : timeLeft.minutes)}
              </span>
              <span className="text-[10px] text-amber-300 font-body uppercase tracking-wider font-semibold">
                Mins
              </span>
            </div>
            <div className="bg-amber-950/80 border border-amber-400/50 rounded-xl py-2 flex flex-col items-center shadow-inner">
              <span className="font-cinzel text-xl font-bold text-amber-200 drop-shadow-[0_0_6px_rgba(255,215,0,0.4)]">
                {String(Number.isNaN(timeLeft.seconds) ? 0 : timeLeft.seconds)}
              </span>
              <span className="text-[10px] text-amber-300 font-body uppercase tracking-wider font-semibold">
                Secs
              </span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-4 text-xs text-amber-200 font-cinzel font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {config.weddingDateFormatted}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {config.weddingTime}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
