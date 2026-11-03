import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  Check,
  RotateCw,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Music,
  Sliders,
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Bell,
  Wand2,
} from 'lucide-react';
import { WEDDING_PRESETS, WeddingPreset } from '../data/weddingPresets';
import { ThreeDWeddingCard } from './ThreeDWeddingCard';
import { weddingAudio } from '../utils/audioSynth';
import { PricingTierPrice } from '../types';

interface ThreeDCardStudioProps {
  onApplyPreset: (preset: WeddingPreset) => void;
  onClose?: () => void;
  onOpenPayment?: (price?: PricingTierPrice) => void;
  onOpenPricing?: () => void;
  currentCouple?: {
    groom: string;
    bride: string;
    date: string;
    venue: string;
  };
}

export const ThreeDCardStudio: React.FC<ThreeDCardStudioProps> = ({
  onApplyPreset,
  onClose,
  onOpenPayment,
  onOpenPricing,
  currentCouple,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(WEDDING_PRESETS[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Editable couple names for previewing on 3D cards
  const [customNames, setCustomNames] = useState({
    groom: currentCouple?.groom || WEDDING_PRESETS[0].groomName,
    bride: currentCouple?.bride || WEDDING_PRESETS[0].brideName,
    date: currentCouple?.date || WEDDING_PRESETS[0].weddingDateFormatted,
    venue: currentCouple?.venue || WEDDING_PRESETS[0].venueName,
  });

  const selectedPreset =
    WEDDING_PRESETS.find((p) => p.id === selectedPresetId) || WEDDING_PRESETS[0];

  const filteredPresets =
    categoryFilter === 'all'
      ? WEDDING_PRESETS
      : WEDDING_PRESETS.filter((p) =>
          p.culturalTheme.toLowerCase().includes(categoryFilter.toLowerCase())
        );

  const handleSelectPreset = (preset: WeddingPreset) => {
    setSelectedPresetId(preset.id);
    weddingAudio.playCardFlipSound();
    // Update default names if user hasn't heavily customized
    if (!isCustomizing) {
      setCustomNames({
        groom: preset.groomName,
        bride: preset.brideName,
        date: preset.weddingDateFormatted,
        venue: preset.venueName,
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-neutral-950 text-white overflow-hidden">
      {/* Top Header */}
      <header className="relative z-20 w-full px-4 py-3 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm font-bold text-amber-200 tracking-wider uppercase flex items-center gap-1.5">
              3D Wedding Cards &amp; Templates Studio
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h2>
            <p className="text-[11px] text-neutral-400">
              Interactive 3D foil cards, realistic tilt, gatefold box &amp; cultural presets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPricing && (
            <button
              type="button"
              onClick={onOpenPricing}
              className="px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-semibold flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-200 border border-amber-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pricing (₹1499 - ₹2999)</span>
            </button>
          )}

          {onOpenPayment && (
            <button
              type="button"
              onClick={() => onOpenPayment(selectedPreset.price)}
              className="px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 shadow-md transition-all active:scale-95"
            >
              <span>Buy for ₹{selectedPreset.price.toLocaleString('en-IN')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold flex items-center gap-1.5 border transition-all ${
              isCustomizing
                ? 'bg-amber-500 text-neutral-950 border-amber-300 font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:text-white border-white/15'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Text</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/15 transition-colors"
              title="Close Studio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area: Left/Top presets selector + Center 3D Stage */}
      <div className="relative flex-1 w-full overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
        {/* Left/Sidebar: Preset Cards Selection List */}
        <aside className="w-full lg:w-80 lg:h-full shrink-0 bg-neutral-900/60 border-r border-white/10 flex flex-col overflow-y-auto">
          {/* Category Filter Chips */}
          <div className="p-3 border-b border-white/10 sticky top-0 bg-neutral-900/90 backdrop-blur-md z-10">
            <p className="text-[10px] font-cinzel text-amber-300 uppercase tracking-widest mb-2">
              Filter by Theme
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Presets' },
                { id: 'South Indian', label: 'South Indian' },
                { id: 'Rajput', label: 'Royal Rajput' },
                { id: 'Punjabi', label: 'North Indian / Punjabi' },
                { id: 'Sacred', label: 'Vedic Sacred' },
                { id: 'Pastel', label: 'Pastel Romance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap font-medium transition-all ${
                    categoryFilter === tab.id
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Presets List */}
          <div className="p-3 space-y-2.5 flex-1">
            {filteredPresets.map((p) => {
              const isSelected = p.id === selectedPreset.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`relative cursor-pointer rounded-xl p-2.5 transition-all flex items-center gap-3 border ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'bg-neutral-800/40 border-white/10 hover:border-white/20 hover:bg-neutral-800/80'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden shrink-0 border border-amber-400/40 shadow-md">
                    <img
                      src={p.coverImage}
                      alt={p.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-500/20 border-2 border-amber-300 rounded-lg pointer-events-none" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-block text-[9px] font-cinzel font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                        {p.badge}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-sans bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ₹{p.price}
                      </span>
                    </div>
                    <h4 className="font-classic text-xs font-bold text-white truncate">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                      {p.subtitle}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-amber-200/80">
                      <span>{p.groomName} &amp; {p.brideName}</span>
                      <span className="text-neutral-400 font-mono text-[9px]">{p.pricingTier.split('(')[0].trim()}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center/Right: Interactive 3D Card Stage */}
        <main className="flex-1 h-full overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-neutral-950 via-[#1A080E] to-neutral-950">
          {/* Active Preset Title Banner */}
          <div className="w-full max-w-lg text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[10px] font-cinzel font-bold text-amber-400 tracking-widest uppercase bg-amber-500/20 border border-amber-400/40 px-3 py-0.5 rounded-full">
                {selectedPreset.badge}
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-sans">
                ₹{selectedPreset.price.toLocaleString('en-IN')} (One-time)
              </span>
            </div>
            <h3 className="font-classic text-xl sm:text-2xl font-bold text-white mt-1">
              {selectedPreset.name}
            </h3>
            <p className="text-xs text-neutral-300 italic mt-0.5">
              {selectedPreset.subtitle}
            </p>

            {onOpenPayment && (
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPayment(selectedPreset.price)}
                  className="px-4 py-1.5 rounded-full text-xs font-cinzel font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Unlock &amp; Publish for ₹{selectedPreset.price.toLocaleString('en-IN')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Inline Customizer Drawer (If opened) */}
          {isCustomizing && (
            <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 border border-amber-400/40 shadow-2xl mb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-cinzel font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Customize Names &amp; Details for 3D Card
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">
                    Groom Name
                  </label>
                  <input
                    type="text"
                    value={customNames.groom}
                    onChange={(e) =>
                      setCustomNames({ ...customNames, groom: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-800 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">
                    Bride Name
                  </label>
                  <input
                    type="text"
                    value={customNames.bride}
                    onChange={(e) =>
                      setCustomNames({ ...customNames, bride: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-800 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="text"
                    value={customNames.date}
                    onChange={(e) =>
                      setCustomNames({ ...customNames, date: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-800 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={customNames.venue}
                    onChange={(e) =>
                      setCustomNames({ ...customNames, venue: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-800 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* The Live Interactive 3D Card */}
          <div className="w-full flex justify-center py-2">
            <ThreeDWeddingCard
              preset={selectedPreset}
              onApplyPresetToWebsite={onApplyPreset}
              customNames={customNames}
              isInteractive={true}
            />
          </div>

          {/* Cultural Insight & Auspicious Shloka Details */}
          <div className="w-full max-w-md bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-amber-300/20 text-center mt-3">
            <p className="text-[11px] font-sanskrit text-amber-200">
              {selectedPreset.shloka}
            </p>
            <p className="text-[10px] text-amber-100/80 font-editorial italic mt-1">
              &ldquo;{selectedPreset.shlokaMeaning}&rdquo;
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
