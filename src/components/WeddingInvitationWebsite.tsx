import React, { useState, useRef } from 'react';
import { InvitationConfig } from '../types';
import { SceneScrollUnfurl } from './SceneScrollUnfurl';
import { ScenePalaceMusicians } from './ScenePalaceMusicians';
import { SceneScratchGatefold } from './SceneScratchGatefold';
import { SceneMandapBlessings } from './SceneMandapBlessings';
import { SceneGallery3D } from './SceneGallery3D';
import { SceneFireworksCelebration } from './SceneFireworksCelebration';
import { SceneBlessingsFarewell } from './SceneBlessingsFarewell';
import { SceneFunctions3D } from './SceneFunctions3D';
import { KaleereinFloralDivider } from './KaleereinFloralDivider';
import { PetalShowerCanvas } from './PetalShowerCanvas';
import { GoldenSparklesOverlay } from './GoldenSparklesOverlay';
import { FloatingMusicButton } from './FloatingMusicButton';
import {
  isNorthIndianTheme,
  isChristianTheme,
  isMuslimTheme,
  isRajasthanTheme,
  isTamilTheme,
} from '../data/weddingPresets';

interface WeddingInvitationWebsiteProps {
  config: InvitationConfig;
  isStandalone?: boolean;
}

export const WeddingInvitationWebsite: React.FC<WeddingInvitationWebsiteProps> = ({
  config,
}) => {
  const [burstTrigger, setBurstTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isNorthIndian = isNorthIndianTheme(config);
  const isChristian = isChristianTheme(config);
  const isMuslim = isMuslimTheme(config);
  const isRajasthan = isRajasthanTheme(config);
  const isTamil = isTamilTheme(config);

  const handleTriggerPetalShower = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const handleScrollToSection = (index: number) => {
    if (!containerRef.current) return;
    const sections = containerRef.current.querySelectorAll('section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToEvents = () => {
    const el = document.getElementById('scene-functions-3d-wrapper');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      id="wedding-website-container"
      className="relative w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar bg-neutral-950 font-body scroll-smooth"
    >
      {/* Universal Floating Audio Toggle in Top Right */}
      <FloatingMusicButton musicPreset={config.theme?.musicPreset} />

      {/* Official Verified VIP Invitation Badge if Unlocked */}
      {config.isUnlocked && (
        <div className="fixed top-3 left-3 z-40 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/50 text-[10px] font-cinzel font-bold text-amber-200 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-in fade-in duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Official Licensed Invitation</span>
          {config.activeOrder?.licenseKey && (
            <span className="text-[9px] font-mono text-amber-400/80">({config.activeOrder.licenseKey.slice(0, 14)})</span>
          )}
        </div>
      )}

      {/* Ambient Falling Flower Petals Overlay */}
      <PetalShowerCanvas
        burstTrigger={burstTrigger}
        petalColors={config.theme?.petalColors}
      />

      {/* Floating Golden Diamond Twinkles & Dust Overlay */}
      <GoldenSparklesOverlay />

      {/* Scene 1: Balcony Scroll Unfurl with 3D Pixar Hero Render */}
      <SceneScrollUnfurl
        config={config}
        onScrollNext={() => handleScrollToSection(1)}
        onScrollToEvents={handleScrollToEvents}
      />

      {/* Cultural Hanging Floral Garland / Crescent Moon Lantern Divider */}
      <KaleereinFloralDivider
        isTamil={isTamil}
        isRajasthan={isRajasthan}
        isMuslim={isMuslim}
        isChristian={isChristian}
        variant={isNorthIndian ? 'kaleerein' : 'floral'}
        themeAccent={config.theme?.accentGold || '#D4AF37'}
      />

      {/* Scene 2: Cathedral Sanctuary Aisle / Royal Palace Musicians & Monogram */}
      <ScenePalaceMusicians config={config} />

      {/* Cultural Hanging Floral Garland / Crescent Moon Lantern Divider */}
      <KaleereinFloralDivider
        isTamil={isTamil}
        isRajasthan={isRajasthan}
        isMuslim={isMuslim}
        isChristian={isChristian}
        variant={isNorthIndian ? 'kaleerein' : 'floral'}
        themeAccent={config.theme?.accentGold || '#D4AF37'}
      />

      {/* Scene: Scratch Section to Reveal Royal 3D Gatefold Card (All Templates) */}
      <SceneScratchGatefold config={config} />

      {/* Cultural Hanging Floral Garland / Crescent Moon Lantern Divider */}
      <KaleereinFloralDivider
        isTamil={isTamil}
        isRajasthan={isRajasthan}
        isMuslim={isMuslim}
        isChristian={isChristian}
        variant={isNorthIndian ? 'kaleerein' : 'floral'}
        themeAccent={config.theme?.accentGold || '#D4AF37'}
      />

      {/* Scene 3: Enchanted Floral Arch Tunnel / Temple Mandap & Blessing Petal Shower */}
      <SceneMandapBlessings
        config={config}
        onTriggerPetalShower={handleTriggerPetalShower}
      />

      {/* Scene 4: IN FRAME - 3D Polaroid Photo Gallery */}
      <SceneGallery3D photos={config.galleryPhotos} config={config} />

      {/* Cultural Hanging Floral Garland / Crescent Moon Lantern Divider */}
      <KaleereinFloralDivider
        isTamil={isTamil}
        isRajasthan={isRajasthan}
        isMuslim={isMuslim}
        isChristian={isChristian}
        variant={isNorthIndian ? 'kaleerein' : 'floral'}
        themeAccent={config.theme?.accentGold || '#D4AF37'}
      />

      {/* 3D Wedding Functions & Ceremonies Showcase: Nuptial Mass, Vows, Haldi, Mehendi, Sangeeth, Vivaha, Reception */}
      <SceneFunctions3D
        config={config}
        onTriggerPetalShower={handleTriggerPetalShower}
      />

      {/* Scene 5: Our Forever - Fireworks Celebration & Events Summary */}
      <SceneFireworksCelebration config={config} />

      {/* Scene 6: Sacred Blessings, Venue Directions & Auspicious Farewell */}
      <SceneBlessingsFarewell config={config} />
    </div>
  );
};
