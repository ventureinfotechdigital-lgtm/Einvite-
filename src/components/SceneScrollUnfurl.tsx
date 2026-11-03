import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, ScrollText, Star, Heart, Calendar } from 'lucide-react';
import { InvitationConfig } from '../types';
import glowingScrollBg from '../assets/images/glowing_scroll_balcony_1788517049186.jpg';
import southTempleGopuramImg from '../assets/images/south_temple_gopuram_1788535078716.jpg';
import punjabiEmbraceImg from '../assets/images/punjabi_embrace_art_1788532200547.jpg';
import royalVarmalaImg from '../assets/images/royal_varmala_art_1788532216549.jpg';
import {
  isKeralaTheme,
  isNorthIndianTheme,
  isChristianTheme,
  isMuslimTheme,
  isRajasthanTheme,
  isTamilTheme,
  christianChurchAltarImg,
  christianTwoCoupleImg,
  christianCarKissImg,
  christianAisleWalkImg,
  christianGracefulBrideImg,
  christianManhwaBoutonniereImg,
  muslimNikahSanctuaryImg,
  muslimCurtainGazeImg,
  muslimNikahSigningImg,
  rajasthanNightDanceImg,
  rajasthanRajputDarbarImg,
  rajasthanBaraatProcessionImg,
  rajasthanPalaceCourtyardImg,
  rajasthanFolkMusiciansImg,
  tamilThaliMangalyamImg,
  tamilMettiKolusuImg,
  tamilMandapamMuhurthamImg,
  tamilJasmineMalliImg,
  tamilPaaniGrahanamHandsImg,
  tamilMaalaiMaatralImg,
} from '../data/weddingPresets';
import { FairyLightsOverlay } from './FairyLightsOverlay';
import { RajasthanAnimatedBackdrop } from './RajasthanAnimatedBackdrop';
import { TamilTempleAnimatedBackdrop, TamilSceneType } from './TamilTempleAnimatedBackdrop';

interface SceneScrollUnfurlProps {
  config: InvitationConfig;
  onScrollNext?: () => void;
  onScrollToEvents?: () => void;
}

const FloralCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 40 40"
    className={`w-5 h-5 text-[#D4AF37] pointer-events-none fill-none stroke-current ${className}`}
  >
    <path d="M4,20 Q4,4 20,4" strokeWidth="1.5" />
    <path d="M8,16 Q8,8 16,8" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <circle cx="20" cy="4" r="1.5" className="fill-[#D4AF37]" />
    <circle cx="4" cy="20" r="1.5" className="fill-[#D4AF37]" />
    <path d="M4,4 Q10,10 4,16 Q10,10 16,4" strokeWidth="0.75" />
    <circle cx="8" cy="8" r="1" className="fill-[#D4AF37]" />
  </svg>
);

export const SceneScrollUnfurl: React.FC<SceneScrollUnfurlProps> = ({
  config,
  onScrollNext,
  onScrollToEvents,
}) => {
  const [isUnrolled, setIsUnrolled] = useState(true);
  const [selectedHeroArt, setSelectedHeroArt] = useState<'embrace' | 'chandelier'>('embrace');
  const isKerala = isKeralaTheme(config);
  const isNorthIndian = isNorthIndianTheme(config);
  const isChristian = isChristianTheme(config);
  const isMuslim = isMuslimTheme(config);
  const isRajasthan = isRajasthanTheme(config);
  const isTamil = isTamilTheme(config);

  const [selectedTamilArt, setSelectedTamilArt] = useState<TamilSceneType>('mandapam');
  const [selectedRajasthanArt, setSelectedRajasthanArt] = useState<'dance' | 'darbar' | 'baraat' | 'courtyard' | 'musicians'>('dance');
  const [selectedMuslimArt, setSelectedMuslimArt] = useState<'sanctuary' | 'curtain' | 'signing'>('sanctuary');
  const [selectedChristianArt, setSelectedChristianArt] = useState<'couple' | 'carkiss' | 'aisle' | 'bride' | 'boutonniere'>('couple');

  const tamilImg =
    selectedTamilArt === 'mandapam'
      ? tamilMandapamMuhurthamImg
      : selectedTamilArt === 'mangalyam'
      ? tamilThaliMangalyamImg
      : selectedTamilArt === 'metti'
      ? tamilMettiKolusuImg
      : selectedTamilArt === 'maalai'
      ? tamilMaalaiMaatralImg
      : selectedTamilArt === 'jasmine'
      ? tamilJasmineMalliImg
      : tamilPaaniGrahanamHandsImg;

  const rajasthanImg =
    selectedRajasthanArt === 'dance'
      ? rajasthanNightDanceImg
      : selectedRajasthanArt === 'darbar'
      ? rajasthanRajputDarbarImg
      : selectedRajasthanArt === 'baraat'
      ? rajasthanBaraatProcessionImg
      : selectedRajasthanArt === 'courtyard'
      ? rajasthanPalaceCourtyardImg
      : rajasthanFolkMusiciansImg;

  const heroImageDefault = isTamil
    ? tamilImg
    : isRajasthan
    ? rajasthanImg
    : isChristian
    ? selectedChristianArt === 'couple'
      ? (config.heroCouplePhoto || christianTwoCoupleImg)
      : selectedChristianArt === 'carkiss'
      ? christianCarKissImg
      : selectedChristianArt === 'aisle'
      ? christianAisleWalkImg
      : selectedChristianArt === 'bride'
      ? christianGracefulBrideImg
      : christianManhwaBoutonniereImg
    : isMuslim
    ? selectedMuslimArt === 'sanctuary'
      ? muslimNikahSanctuaryImg
      : selectedMuslimArt === 'curtain'
      ? muslimCurtainGazeImg
      : muslimNikahSigningImg
    : isNorthIndian
    ? selectedHeroArt === 'embrace'
      ? punjabiEmbraceImg
      : royalVarmalaImg
    : config.heroCouplePhoto;

  const bgImage = isTamil
    ? tamilImg
    : isRajasthan
    ? rajasthanImg
    : isMuslim
    ? muslimNikahSanctuaryImg
    : config.theme?.backdropArtwork ||
      (isChristian
        ? christianChurchAltarImg
        : isNorthIndian
        ? heroImageDefault
        : isKerala
        ? southTempleGopuramImg
        : glowingScrollBg);

  const handleEventsClick = () => {
    if (onScrollToEvents) {
      onScrollToEvents();
    } else {
      const el = document.getElementById('scene-functions-3d-wrapper') || document.getElementById('scene-fireworks-celebration') || document.getElementById('scene-mandap-blessings');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[680px] h-full flex flex-col items-center justify-between overflow-hidden bg-[#FAF6EE] select-none">
      {/* 3D Animated Tamil Temple Backdrop, Rajasthan Backdrop, or Fairy Lights Overlay */}
      {isTamil ? (
        <TamilTempleAnimatedBackdrop
          currentScene={selectedTamilArt}
          onSelectScene={setSelectedTamilArt}
        />
      ) : isRajasthan ? (
        <RajasthanAnimatedBackdrop
          currentScene={selectedRajasthanArt}
          onSelectScene={setSelectedRajasthanArt}
        />
      ) : (
        <FairyLightsOverlay opacity={isNorthIndian ? 1 : 0.7} />
      )}

      {/* Background Image: 3D Pixar Hero Render / Palace Balcony */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={
            isTamil
              ? `Temple Tamil Wedding: ${selectedTamilArt}`
              : isRajasthan
              ? `3D Animated Royal Rajasthan Wedding: ${selectedRajasthanArt}`
              : isMuslim
              ? '3D Muslim Nikah Sanctuary under Bismillah Scalloped Arch'
              : isChristian
              ? '3D Christian Cathedral Altar & Floral Archway'
              : isNorthIndian
              ? '3D Pixar-style Animated North Indian Wedding Couple'
              : isKerala
              ? '3D Kerala Temple & Banana Leaves Background Frame'
              : 'Palace Balcony Street Scene'
          }
          className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.06] saturate-[1.12] transition-all duration-700"
        />

        {/* Soft atmospheric golden bokeh & warm lighting overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            background: isRajasthan
              ? `radial-gradient(circle at 50% 25%, #F59E0B45, transparent 70%), linear-gradient(to bottom, rgba(26,5,11,0.45), transparent 45%, rgba(26,5,11,0.92))`
              : isMuslim
              ? `radial-gradient(circle at 50% 25%, #F59E0B38, transparent 70%), linear-gradient(to bottom, #09211755, transparent 45%, #09211790)`
              : isChristian
              ? `radial-gradient(circle at 50% 20%, ${config.theme?.accentGold || '#E2B866'}30, transparent 65%), linear-gradient(to bottom, rgba(40,15,35,0.45), transparent 50%, rgba(20,8,22,0.88))`
              : isNorthIndian
              ? `radial-gradient(circle at 50% 25%, ${config.theme?.accentGold || '#D4AF37'}30, transparent 70%), linear-gradient(to bottom, ${config.theme?.primaryBg || '#850B1B'}55, transparent 45%, ${config.theme?.primaryBg || '#850B1B'}88)`
              : isKerala
              ? `radial-gradient(circle at 50% 20%, ${config.theme?.accentGold || '#F59E0B'}30, transparent 65%), linear-gradient(to bottom, ${config.theme?.primaryBg || '#0C2518'}40, transparent 50%, ${config.theme?.primaryBg || '#0C2518'}85)`
              : `radial-gradient(circle at 50% 20%, ${config.theme?.accentGold || '#F59E0B'}25, transparent 60%), linear-gradient(to bottom, ${config.theme?.primaryBg || '#18040A'}33, transparent 50%, ${config.theme?.primaryBg || '#18040A'}80)`,
          }}
        />

        {/* Subtle light golden bokeh sparkles overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Balcony Arch & Dropping Scroll Container */}
      <div className="relative z-20 w-full flex flex-col items-center pt-3 sm:pt-5 px-3 sm:px-4">
        {/* Unrolling Scroll Banner Canvas/Physics */}
        <AnimatePresence>
          {isUnrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0.4, scaleY: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                scaleY: 1,
                transition: {
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1], // natural cloth unfolding easing
                },
              }}
              exit={{ height: 0, opacity: 0, scaleY: 0 }}
              className="relative w-full max-w-[340px] sm:max-w-[360px] origin-top preserve-3d"
            >
              {/* Wooden Top Roller Bar with Golden Finials */}
              <div className="relative z-10 w-[104%] -left-[2%] h-4 bg-gradient-to-r from-[#5a3214] via-[#945524] to-[#5a3214] rounded-full shadow-md border-b border-[#3b1d07] flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
              </div>

              {/* Floating Central Invitation Card with subtle parchment texture & gold foil border */}
              <div className="relative bg-[#FFFDF7] border-x-2 border-b-2 border-amber-400/90 shadow-2xl rounded-b-2xl px-4 py-5 text-center overflow-hidden">
                {/* Parchment Damask Texture */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Inner Ornate Gold Foil Border with Delicate Floral Corners */}
                <div
                  className="relative border-2 p-3 sm:p-4 rounded-xl bg-[#FAF5EC]/80 backdrop-blur-[1px] shadow-inner"
                  style={{ borderColor: config.theme?.borderGold || '#D4AF37' }}
                >
                  {/* 4 Delicate Floral Corners */}
                  <FloralCorner className="absolute top-1.5 left-1.5" />
                  <FloralCorner className="absolute top-1.5 right-1.5 -scale-x-100" />
                  <FloralCorner className="absolute bottom-1.5 left-1.5 -scale-y-100" />
                  <FloralCorner className="absolute bottom-1.5 right-1.5 -scale-x-100 -scale-y-100" />

                  {/* Auspicious Cultural Invocation */}
                  <div className="flex items-center justify-center gap-1.5 mb-1.5 text-amber-900">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] sm:text-[11px] font-cinzel tracking-wider font-bold uppercase drop-shadow-xs">
                      {config.theme?.culturalInvocation || '॥ SHREE GANESHAYA NAMAHA • SACRED UNION ॥'}
                    </span>
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  </div>

                  {config.theme?.badge && (
                    <div className="mb-1">
                      <span
                        className="inline-block text-[9px] font-cinzel font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-300/40"
                        style={{
                          backgroundColor: config.theme?.badgeBg || '#850B1B',
                          color: config.theme?.badgeText || '#FEF3C7',
                        }}
                      >
                        {config.theme.badge}
                      </span>
                    </div>
                  )}

                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-cinzel font-bold text-amber-950 mb-1">
                    WE ARE GETTING MARRIED
                  </p>

                  {/* Selected Theme Hero Couple Photo Cameo Frame */}
                  {config.heroCouplePhoto && (
                    <div className="my-2 flex flex-col items-center justify-center">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 shadow-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#FFFDF7] bg-neutral-100">
                          <img
                            src={heroImageDefault}
                            alt={`${config.groomName} & ${config.brideName}`}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>

                      {/* Alternate 3D Hero Render Toggle (Screenshot 1 vs Screenshot 3) */}
                      {isNorthIndian && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedHeroArt('embrace')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedHeroArt === 'embrace'
                                ? 'bg-[#850B1B] text-amber-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Embrace (Shot 1)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedHeroArt('chandelier')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedHeroArt === 'chandelier'
                                ? 'bg-[#850B1B] text-amber-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Varmala (Shot 3)
                          </button>
                        </div>
                      )}

                      {/* Alternate 3D Muslim Theme Render Toggle */}
                      {isMuslim && (
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap justify-center">
                          <button
                            type="button"
                            onClick={() => setSelectedMuslimArt('sanctuary')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedMuslimArt === 'sanctuary'
                                ? 'bg-[#064E3B] text-emerald-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Sanctuary Arch
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedMuslimArt('curtain')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedMuslimArt === 'curtain'
                                ? 'bg-[#064E3B] text-emerald-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Aarsi Mushaf
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedMuslimArt('signing')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedMuslimArt === 'signing'
                                ? 'bg-[#064E3B] text-emerald-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Nikahnama
                          </button>
                        </div>
                      )}

                      {/* Alternate 3D Christian Template 2 Render Toggle */}
                      {isChristian && (
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
                          <button
                            type="button"
                            onClick={() => setSelectedChristianArt('couple')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedChristianArt === 'couple'
                                ? 'bg-[#1E3A8A] text-blue-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Union
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChristianArt('carkiss')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedChristianArt === 'carkiss'
                                ? 'bg-[#1E3A8A] text-blue-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Car Kiss
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChristianArt('aisle')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedChristianArt === 'aisle'
                                ? 'bg-[#1E3A8A] text-blue-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Aisle Walk
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChristianArt('bride')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedChristianArt === 'bride'
                                ? 'bg-[#1E3A8A] text-blue-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Bride
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedChristianArt('boutonniere')}
                            className={`text-[9px] font-cinzel px-2 py-0.5 rounded-full border transition-all ${
                              selectedChristianArt === 'boutonniere'
                                ? 'bg-[#1E3A8A] text-blue-100 border-amber-400 font-bold shadow-2xs'
                                : 'bg-white/80 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Boutonnière
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Couple Names in Grand Calligraphy with Theme Color */}
                  <div className="my-2 py-1 border-y border-amber-400/50">
                    <h1
                      className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide leading-tight"
                      style={{ color: isMuslim ? '#064E3B' : isNorthIndian ? '#850B1B' : (config.theme?.cardBg || '#991B1B') }}
                    >
                      {config.groomName}
                    </h1>
                    <div className="flex items-center justify-center gap-2 my-0.5">
                      <span className="w-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                      <span
                        className="font-script text-lg font-bold"
                        style={{ color: config.theme?.accentGold || '#D4AF37' }}
                      >
                        &amp;
                      </span>
                      <span className="w-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                    </div>
                    <h1
                      className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide leading-tight"
                      style={{ color: isNorthIndian ? '#850B1B' : (config.theme?.cardBg || '#991B1B') }}
                    >
                      {config.brideName}
                    </h1>
                  </div>

                  {/* Date & Location preview */}
                  <div className="mt-1.5">
                    <p className="text-xs font-cinzel font-bold text-neutral-900 tracking-wider">
                      {config.weddingDateFormatted}
                    </p>
                    <p className="text-[11px] font-montserrat text-neutral-700 font-medium mt-0.5">
                      {config.venueCity}
                    </p>
                  </div>

                  {/* Main CTA Button: View Event Schedule */}
                  <div className="mt-3 flex items-center justify-center pt-2 border-t border-amber-900/10">
                    <button
                      type="button"
                      onClick={handleEventsClick}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#850B1B] via-[#991B1B] to-[#B91C1C] hover:opacity-95 text-white text-[11px] font-cinzel font-bold shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-amber-300/40"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      View Event Schedule &amp; Celebrations
                    </button>
                  </div>

                  {/* Royal Monogram Seal */}
                  <div className="mt-2.5 flex justify-center">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-red-950 shadow-xs font-title text-[11px] font-black border border-amber-200">
                      {config.monogramText}
                    </div>
                  </div>
                </div>

                {/* Bottom Wooden Roller Weight */}
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[#5a3214] via-[#945524] to-[#5a3214] shadow-md border-t border-[#3b1d07]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Scroll Replay Button */}
        <button
          onClick={() => setIsUnrolled(!isUnrolled)}
          type="button"
          className="mt-2.5 text-[11px] font-cinzel tracking-wider text-amber-950 bg-amber-100/90 hover:bg-white backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/80 shadow-md flex items-center gap-1.5 transition-all"
        >
          <ScrollText className="w-3.5 h-3.5 text-amber-800" />
          {isUnrolled ? 'Fold Banner' : 'Unroll Royal Scroll ✨'}
        </button>
      </div>

      {/* Bottom Scroll Indicator & Call to Action */}
      <div className="relative z-20 w-full flex flex-col items-center pb-6 pt-8">
        <button
          onClick={onScrollNext}
          type="button"
          className="group flex flex-col items-center gap-1 text-white text-xs font-cinzel tracking-widest uppercase hover:scale-105 transition-transform"
        >
          <span className="bg-neutral-950/75 backdrop-blur-md px-5 py-2 rounded-full border border-amber-400/60 text-amber-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <Sparkles className="w-4 h-4 text-amber-400 animate-sparkle" />
            Enter Royal Celebration
          </span>
          <ChevronDown className="w-5 h-5 text-amber-300 animate-bounce mt-1 drop-shadow" />
        </button>
      </div>
    </section>
  );
};
