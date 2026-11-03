import React, { useState } from 'react';
import { Sparkles, Heart, MapPin, Calendar, Share2, Compass, BellRing } from 'lucide-react';
import { InvitationConfig } from '../types';
import { weddingAudio } from '../utils/audioSynth';
import { isChristianTheme, isKeralaTheme } from '../data/weddingPresets';
import confetti from 'canvas-confetti';

interface SceneBlessingsFarewellProps {
  config: InvitationConfig;
}

export const SceneBlessingsFarewell: React.FC<SceneBlessingsFarewellProps> = ({ config }) => {
  const [blessingsGiven, setBlessingsGiven] = useState(false);
  const [blessingCount, setBlessingCount] = useState(108);
  const isChristian = isChristianTheme(config);
  const isKerala = isKeralaTheme(config);

  const handleGiveBlessing = () => {
    weddingAudio.playBlessingChime();
    setBlessingCount((prev) => prev + 1);
    setBlessingsGiven(true);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: isChristian
        ? ['#FFFFFF', '#FAF5FF', '#FEF08A', '#F59E0B', '#E2E8F0']
        : config.theme?.petalColors || ['#D4AF37', '#FFD700', '#E11D48', '#FF69B4', '#FFF'],
    });
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${config.venueName}, ${config.venueCity}`);
    window.open(config.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${config.groomName} & ${config.brideName}'s Wedding`);
    const details = encodeURIComponent(
      `Join us in celebrating the sacred union of ${config.groomName} & ${config.brideName} at ${config.venueName}.`
    );
    const location = encodeURIComponent(`${config.venueName}, ${config.venueCity}`);
    const dateStr = config.weddingDate.replace(/-/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T130000Z/${dateStr}T180000Z&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <section
      id="scene-blessings-farewell"
      className="relative w-full min-h-[640px] py-16 px-4 text-white flex flex-col items-center justify-between border-t border-amber-500/30 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, #0a0a0a, ${config.theme?.primaryBg || '#22040B'}, #0a0a0a)`,
      }}
    >
      {/* Background Ornate Traditional Motifs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ backgroundColor: config.theme?.accentGold || '#881337' }}
      />

      {/* Top Traditional Auspicious Invocation */}
      <div className="relative z-10 text-center max-w-md pt-2">
        <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-300 uppercase mb-1 drop-shadow-sm">
          {config.theme?.culturalInvocation ||
            (isChristian
              ? '✝ IN SACRED UNION BEFORE GOD • HOLY MATRIMONY ✝'
              : '॥ MANGALAM BHAGWAN VISHNU • SACRED CELEBRATION ॥')}
        </p>
        <p className="text-[10px] sm:text-xs text-amber-200/70 font-cinzel tracking-wider uppercase mb-4">
          {isChristian
            ? 'FAITH • HOPE • LOVE • BLESSED BY GOD FOR ETERNITY'
            : '॥ ETERNAL LOVE • SACRED UNION & DIVINE BLESSINGS ॥'}
        </p>
      </div>

      {/* Center Royal Seal & Blessings Card with 3D Depth */}
      <div
        className="relative z-10 w-full max-w-sm my-4 backdrop-blur-md rounded-2xl p-6 border shadow-2xl text-center transition-transform duration-300 hover:scale-[1.02]"
        style={{
          backgroundColor: `${config.theme?.cardBg || '#18040A'}d8`,
          borderColor: `${config.theme?.borderGold || '#F59E0B'}70`,
        }}
      >
        {/* Ornate Monogram Medallion */}
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.5)] mb-3 transform hover:rotate-6 transition-transform">
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center border border-amber-300/40">
            <span className="font-title text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 font-bold tracking-widest">
              {config.monogramText}
            </span>
          </div>
        </div>

        <h3 className="font-classic text-xl sm:text-2xl font-bold text-amber-100 mb-1">
          {config.groomName} &amp; {config.brideName}
        </h3>
        <p className="text-xs font-cinzel text-amber-400 tracking-wider uppercase mb-3">
          {config.weddingDateFormatted} • {config.venueCity}
        </p>

        <p className="text-xs text-neutral-300 font-editorial italic leading-relaxed px-2 mb-5">
          {isChristian
            ? '“May grace, love, and peace be multiplied to you. With joyful hearts and heartfelt gratitude, we eagerly look forward to your blessed presence on our wedding day.”'
            : '“With the blessings of our elders and the warmth of beloved family & friends, we eagerly look forward to your gracious presence on our most auspicious day.”'}
        </p>

        {/* Interactive Blessings Flower Button */}
        <button
          type="button"
          onClick={handleGiveBlessing}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-cinzel font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mb-3"
        >
          <Heart className={`w-4 h-4 ${blessingsGiven ? 'fill-current text-rose-200' : 'text-amber-200'}`} />
          <span>
            {blessingsGiven
              ? isChristian
                ? 'Sacred Blessings Showered! 🕊️'
                : 'Blessings Showered! 🌸'
              : isChristian
              ? 'Shower Holy Blessings upon the Couple 🕊️'
              : 'Shower Blessings upon the Couple'}
          </span>
        </button>

        <div className="text-[10px] text-amber-300/80 font-cinzel flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>
            {blessingCount} {isChristian ? 'Sacred Blessings Received ✨' : 'Auspicious Blessings Received'}
          </span>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-amber-400/20">
          <button
            type="button"
            onClick={handleOpenMaps}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-amber-400/30 text-[11px] font-cinzel font-semibold text-amber-200 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Venue Map</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-amber-400/30 text-[11px] font-cinzel font-semibold text-amber-200 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {/* Royal Footer Note */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-[11px] font-cinzel text-amber-400/90 tracking-widest uppercase">
          {isChristian
            ? 'WITH HEARTFELT GRATITUDE & PRAYERS • HOLY MATRIMONY'
            : '॥ WITH HEARTFELT GRATITUDE • ROYAL WEDDING CELEBRATION ॥'}
        </p>
        <p className="text-[9px] text-neutral-400 mt-1 font-body">
          {config.venueName} • {config.venueAddress}
        </p>
      </div>
    </section>
  );
};
