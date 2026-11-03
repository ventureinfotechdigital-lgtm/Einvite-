import React, { useState } from 'react';
import { Sparkles, BellRing } from 'lucide-react';
import { InvitationConfig } from '../types';
import { WEDDING_PRESETS, WeddingPreset, isNorthIndianTheme, royalVarmalaImg } from '../data/weddingPresets';
import { ThreeDWeddingCard } from './ThreeDWeddingCard';
import { weddingAudio } from '../utils/audioSynth';
import { FairyLightsOverlay } from './FairyLightsOverlay';
import confetti from 'canvas-confetti';

interface SceneCard3DProps {
  config: InvitationConfig;
  onApplyPreset?: (preset: WeddingPreset) => void;
}

export const SceneCard3D: React.FC<SceneCard3DProps> = ({ config }) => {
  const isNorthIndian = isNorthIndianTheme(config);
  // Find preset that matches active config, or default to the second one (Royal Rajput) or first
  const [selectedPreset, setSelectedPreset] = useState<WeddingPreset>(() => {
    const match = WEDDING_PRESETS.find(
      (p) =>
        (config.theme?.presetId && p.id === config.theme.presetId) ||
        p.groomName.toLowerCase() === config.groomName.toLowerCase()
    );
    return match || WEDDING_PRESETS[1];
  });

  // Keep selectedPreset in sync if theme changes from sidebar or studio
  React.useEffect(() => {
    if (config.theme?.presetId) {
      const match = WEDDING_PRESETS.find((p) => p.id === config.theme.presetId);
      if (match) setSelectedPreset(match);
    }
  }, [config.theme?.presetId]);

  const handleRingMandapBell = () => {
    weddingAudio.playTempleBellSound();
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: config.theme?.petalColors || ['#FFD700', '#F59E0B', '#E11D48'],
    });
  };

  return (
    <section
      id="scene-3d-card-invitation"
      className="relative w-full min-h-[720px] py-14 px-3 sm:px-6 border-y overflow-hidden flex flex-col items-center justify-center text-white transition-colors duration-700"
      style={{
        background: `linear-gradient(to bottom, #0a0a0a, ${config.theme?.primaryBg || '#1C050D'}, #0a0a0a)`,
        borderColor: `${config.theme?.borderGold || '#F59E0B'}40`,
      }}
    >
      {/* Background Decorative Art / Temple Elements */}
      {isNorthIndian && (
        <div className="absolute inset-0 z-0">
          <img
            src={royalVarmalaImg}
            alt="Royal Chandelier Varmala"
            className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.1] saturate-[1.15]"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 30%, transparent 10%, rgba(133, 11, 27, 0.78) 60%, #0a0a0a 95%)`,
            }}
          />
          <FairyLightsOverlay opacity={0.7} />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30 transition-colors duration-700"
        style={{ backgroundColor: config.theme?.cardBg || '#881337' }}
      />

      {/* Section Title */}
      <div className="relative z-10 text-center max-w-md mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-cinzel font-bold text-amber-300 uppercase tracking-widest mb-2 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Royal 3D Gatefold Card
          <Sparkles className="w-3 h-3 text-amber-400" />
        </div>
        <h3 className="font-classic text-2xl sm:text-3xl font-bold text-white tracking-wide">
          The Ceremonial 3D Invitation
        </h3>
        <p className="text-xs text-neutral-300 font-editorial italic mt-1.5">
          Click the royal wax seal to open the gatefold invitation &amp; reveal the auspicious blessings
        </p>
      </div>

      {/* The 3D Wedding Card (Starts in Royal Gatefold Mode) */}
      <div className="relative z-10 w-full flex justify-center">
        <ThreeDWeddingCard
          preset={selectedPreset}
          defaultCardStyle="royal-gatefold"
          customNames={{
            groom: config.groomName,
            bride: config.brideName,
            date: config.weddingDateFormatted,
            venue: config.venueName,
          }}
          isInteractive={true}
        />
      </div>

      {/* Auspicious Blessings & Bell Action */}
      <div className="relative z-10 mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRingMandapBell}
          className="px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-cinzel font-semibold text-amber-200 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-400" />
          Ring Sacred Temple Bell
        </button>
      </div>
    </section>
  );
};
