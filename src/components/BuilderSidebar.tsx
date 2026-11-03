import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Share2,
  Eye,
  Smartphone,
  Maximize2,
  Upload,
  Plus,
  Trash2,
  Music,
  CheckCircle2,
  Layers,
  Wand2,
  Compass,
  ArrowRight,
  Flower2,
  Check,
  Flame,
  Camera,
  CreditCard,
  ShieldCheck,
  Tag,
  Receipt,
} from 'lucide-react';
import { InvitationConfig, ViewMode, EventItem, PricingTierPrice } from '../types';
import { WEDDING_PRESETS, WeddingPreset, THEME_PHOTO_LIBRARY, getPresetPrice, getPresetTierName } from '../data/weddingPresets';
import goldenHaldiImg from '../assets/images/golden_haldi_ceremony_1788535162943.jpg';
import twilightMehendiImg from '../assets/images/twilight_garden_mehendi_1788535181766.jpg';
import royalSangeetImg from '../assets/images/royal_sangeet_celebration_1788588370944.jpg';
import royalSindoorImg from '../assets/images/royal_sindoor_vivaha_1788535101917.jpg';
import lavenderReceptionImg from '../assets/images/lavender_reception_aisle_1788535137772.jpg';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface BuilderSidebarProps {
  config: InvitationConfig;
  onChange: (updated: InvitationConfig) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenShare: () => void;
  onOpenCreateModal?: () => void;
  onOpen3DStudio?: () => void;
  onOpenPayment?: (price?: PricingTierPrice) => void;
  onOpenPricing?: () => void;
  onApplyPreset?: (preset: WeddingPreset) => void;
  onViewWebsite?: () => void;
  onGenerateWebsite?: () => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  config,
  onChange,
  viewMode,
  onViewModeChange,
  onOpenShare,
  onOpenCreateModal,
  onOpen3DStudio,
  onOpenPayment,
  onOpenPricing,
  onApplyPreset,
  onViewWebsite,
  onGenerateWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<'couple' | 'venue' | 'ceremonies' | 'photos' | 'presets'>('couple');
  const [isGenerated, setIsGenerated] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Check how many details are filled
  const isCoupleFilled = Boolean(config.groomName && config.brideName);
  const isVenueFilled = Boolean(config.weddingDate && config.venueName && config.venueCity);
  const isEventsFilled = config.events.length > 0;
  const isPhotosFilled = Boolean(config.heroCouplePhoto && config.galleryPhotos.length > 0);
  const completedSteps = [isCoupleFilled, isVenueFilled, isEventsFilled, isPhotosFilled].filter(Boolean).length;
  const totalSteps = 4;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const activePrice = getPresetPrice(config.theme?.presetId);
  const activeTierName = getPresetTierName(config.theme?.presetId);

  const handleTextChange = (field: keyof InvitationConfig, val: string) => {
    const updated = { ...config, [field]: val };
    // Auto-update monogram and hashtag if names change
    if (field === 'groomName' || field === 'brideName') {
      const gInitial = (field === 'groomName' ? val : config.groomName).charAt(0).toUpperCase();
      const bInitial = (field === 'brideName' ? val : config.brideName).charAt(0).toUpperCase();
      updated.monogramText = `${gInitial || 'P'}${bInitial || 'S'}`;
      updated.hashtag = `#${(field === 'groomName' ? val : config.groomName)}Weds${(field === 'brideName' ? val : config.brideName)}`;
    }
    onChange(updated);
  };

  const handleDateChange = (val: string) => {
    const d = new Date(val);
    const formatted = isNaN(d.getTime())
      ? config.weddingDateFormatted
      : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    onChange({
      ...config,
      weddingDate: val,
      weddingDateFormatted: formatted,
    });
  };

  const handleFileUpload = (
    field: 'heroCouplePhoto' | 'scratchRevealPhoto',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange({ ...config, [field]: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newPhoto = {
            id: 'g-' + Date.now(),
            url: reader.result,
            caption: 'Auspicious Moment ✨',
            date: 'Wedding Festivities',
          };
          onChange({
            ...config,
            galleryPhotos: [...config.galleryPhotos, newPhoto],
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGalleryPhoto = (id: string) => {
    onChange({
      ...config,
      galleryPhotos: config.galleryPhotos.filter((p) => p.id !== id),
    });
  };

  const handleAddEvent = () => {
    const newEvent: EventItem = {
      id: 'e-' + Date.now(),
      title: 'New Sacred Ceremony',
      date: config.weddingDateFormatted,
      time: '07:00 PM',
      venue: config.venueName,
      description: 'Grand celebration with traditional music, dining, and festivities.',
      dressCode: 'Royal Ethnic Formal',
    };
    onChange({
      ...config,
      events: [...config.events, newEvent],
    });
  };

  const handleDeleteEvent = (id: string) => {
    onChange({
      ...config,
      events: config.events.filter((e) => e.id !== id),
    });
  };

  // Generate Website Action
  const handleGenerateWebsite = () => {
    weddingAudio.playBlessingChime();
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#F59E0B', '#E11D48', '#FF69B4', '#FFF'],
    });

    setIsGenerated(true);
    setShowSuccessBanner(true);

    if (onGenerateWebsite) {
      onGenerateWebsite();
    }
  };

  const handleTriggerViewWebsite = () => {
    weddingAudio.playBlessingChime();
    if (onViewWebsite) {
      onViewWebsite();
    }
  };

  return (
    <aside
      id="invitation-builder-sidebar"
      className="w-full lg:w-[440px] xl:w-[480px] h-full flex flex-col bg-[#09090D] border-r border-pink-500/25 shadow-2xl overflow-hidden z-20 font-body text-pink-50"
    >
      {/* Luxury Pink & Black Header Banner */}
      <div className="relative bg-gradient-to-b from-[#220415] via-[#12010B] to-[#070004] p-4 text-white border-b-2 border-pink-500/40 overflow-hidden shrink-0 shadow-lg">
        {/* Subtle Background Pink Twinkle Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#F472B6_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between text-pink-300 mb-1.5">
          <span className="font-cinzel text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-sparkle" />
            ROYAL WEDDING COLLECTION
          </span>
          <span className="font-cinzel text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
            3D INTERACTIVE SUITE
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-sparkle" />
          </span>
        </div>

        {/* Title & Couple Tag */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div>
            <h1 className="font-classic font-bold text-pink-100 text-lg leading-tight flex items-center gap-2">
              <span>Wedding Invitation Studio</span>
            </h1>
            <p className="text-xs text-pink-300/80 font-editorial italic mt-0.5">
              {config.groomName} &amp; {config.brideName} • 3D Wedding Website
            </p>
          </div>

          <button
            id="open-share-modal-btn"
            onClick={onOpenShare}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 text-xs font-cinzel font-semibold shadow-xs transition-colors shrink-0 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-300" />
            Share
          </button>
        </div>

        {/* Progress Readiness Bar */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-pink-500/25 flex items-center justify-between text-[11px]">
          <span className="text-pink-200/90 font-cinzel flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
            Invitation Readiness: {completedSteps}/{totalSteps} Completed
          </span>
          <span className="text-pink-300 font-bold font-mono">{progressPercent}% Ready</span>
        </div>
        <div className="relative z-10 w-full h-1.5 bg-black/70 rounded-full mt-1 overflow-hidden border border-pink-500/30">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Pricing & License Status Strip */}
        <div className="relative z-10 mt-2.5 pt-2 border-t border-pink-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {config.isUnlocked ? (
              <span className="flex items-center gap-1 text-[11px] font-cinzel font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                VIP Licensed
              </span>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] uppercase font-cinzel text-amber-300/90 font-bold">Design Tier:</span>
                <span className="text-xs font-bold font-sans text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40">
                  ₹{activePrice}
                </span>
                <span className="text-[10px] text-pink-200/70 truncate hidden sm:inline">{activeTierName.split('(')[0]}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenPricing && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="px-2 py-1 rounded-lg text-[10px] font-cinzel font-bold text-pink-200 hover:text-white bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 transition-colors"
                title="View All 4 Pricing Tiers (₹1499 - ₹2999)"
              >
                Plans
              </button>
            )}

            {onOpenPayment && (
              <button
                type="button"
                onClick={() => onOpenPayment(activePrice)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-cinzel font-bold bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 shadow-sm flex items-center gap-1 transition-all active:scale-95"
              >
                <Sparkles className="w-3 h-3 text-neutral-950" />
                <span>{config.isUnlocked ? 'VIP Active' : `Buy ₹${activePrice}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode & Live Preview Switcher Strip */}
      <div className="px-4 py-2 bg-[#0F0F15] border-b border-pink-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 text-xs font-cinzel text-pink-300">
          <Eye className="w-3.5 h-3.5 text-pink-400" />
          <span className="font-semibold">Preview Mode:</span>
        </div>

        <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-pink-500/25 shadow-inner">
          <button
            onClick={() => onViewModeChange('split')}
            type="button"
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]'
                : 'text-neutral-400 hover:text-pink-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Mobile Frame
          </button>
          <button
            onClick={() => onViewModeChange('fullscreen')}
            type="button"
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md font-semibold transition-all ${
              viewMode === 'fullscreen'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]'
                : 'text-neutral-400 hover:text-pink-200'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            Full Screen
          </button>
        </div>
      </div>

      {/* Professional Step Navigation Tabs */}
      <div className="flex border-b border-pink-500/20 bg-[#0B0B0F] px-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveTab('couple')}
          type="button"
          className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'couple'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30 shadow-xs'
              : 'border-transparent text-neutral-400 hover:text-pink-300'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] flex items-center justify-center font-bold">
            1
          </span>
          Couple
        </button>

        <button
          onClick={() => setActiveTab('venue')}
          type="button"
          className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'venue'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30 shadow-xs'
              : 'border-transparent text-neutral-400 hover:text-pink-300'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] flex items-center justify-center font-bold">
            2
          </span>
          Date &amp; Venue
        </button>

        <button
          onClick={() => setActiveTab('ceremonies')}
          type="button"
          className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'ceremonies'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30 shadow-xs'
              : 'border-transparent text-neutral-400 hover:text-pink-300'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] flex items-center justify-center font-bold">
            3
          </span>
          Ceremonies
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          type="button"
          className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'photos'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30 shadow-xs'
              : 'border-transparent text-neutral-400 hover:text-pink-300'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] flex items-center justify-center font-bold">
            4
          </span>
          Media Gallery
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          type="button"
          className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === 'presets'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30 shadow-xs'
              : 'border-transparent text-neutral-400 hover:text-pink-300'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] flex items-center justify-center font-bold">
            5
          </span>
          3D Themes
        </button>
      </div>

      {/* Main Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090D] no-scrollbar">
        {/* STEP 1: COUPLE (BRIDE & GROOM DETAILS) */}
        {activeTab === 'couple' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Professional Section Card */}
            <div className="bg-[#121218] p-4 rounded-2xl border border-pink-500/25 shadow-md space-y-3.5">
              <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <span className="p-1.5 rounded-lg bg-pink-950/60 text-pink-400 border border-pink-500/30">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                </span>
                <div>
                  <h3 className="font-classic text-sm font-bold text-pink-100">
                    Bride &amp; Groom Profiles
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Names are displayed on the 3D royal scroll, mandap, and gold foil card
                  </p>
                </div>
              </div>

              {/* Groom Input */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1 flex items-center justify-between">
                  <span>Groom&apos;s Full Name *</span>
                  <span className="text-[10px] text-pink-400 font-normal">Royal Groom</span>
                </label>
                <div className="relative">
                  <input
                    id="groom-name-input"
                    type="text"
                    value={config.groomName}
                    onChange={(e) => handleTextChange('groomName', e.target.value)}
                    placeholder="e.g. Pulkit"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/25 rounded-xl px-3.5 py-2 text-sm font-semibold text-pink-50 placeholder:text-neutral-500 outline-none transition-all shadow-inner"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-pink-400">👑</span>
                </div>
              </div>

              {/* Bride Input */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1 flex items-center justify-between">
                  <span>Bride&apos;s Full Name *</span>
                  <span className="text-[10px] text-pink-400 font-normal">Royal Bride</span>
                </label>
                <div className="relative">
                  <input
                    id="bride-name-input"
                    type="text"
                    value={config.brideName}
                    onChange={(e) => handleTextChange('brideName', e.target.value)}
                    placeholder="e.g. Shreya"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/25 rounded-xl px-3.5 py-2 text-sm font-semibold text-pink-50 placeholder:text-neutral-500 outline-none transition-all shadow-inner"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-pink-400">🪷</span>
                </div>
              </div>

              {/* Hashtag & Monogram Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                    Wedding Hashtag
                  </label>
                  <input
                    id="hashtag-input"
                    type="text"
                    value={config.hashtag}
                    onChange={(e) => handleTextChange('hashtag', e.target.value)}
                    placeholder="#PulkitWedsShreya"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs font-medium text-pink-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                    Royal Monogram
                  </label>
                  <input
                    id="monogram-input"
                    type="text"
                    maxLength={3}
                    value={config.monogramText}
                    onChange={(e) => handleTextChange('monogramText', e.target.value.toUpperCase())}
                    placeholder="PS"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs font-bold text-pink-300 uppercase text-center outline-none"
                  />
                </div>
              </div>

              {/* Welcome Blessing Note */}
              <div className="pt-1">
                <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                  Welcome Blessing / Message
                </label>
                <textarea
                  rows={2}
                  value={config.welcomeMessage}
                  onChange={(e) => handleTextChange('welcomeMessage', e.target.value)}
                  placeholder="With the celestial blessings of our elders..."
                  className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl p-2.5 text-xs text-pink-100 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="p-3 bg-pink-950/30 rounded-xl border border-pink-500/30 flex items-start gap-2.5 text-xs text-pink-200">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <p>
                <strong>Tip:</strong> Changing couple names automatically synchronizes your royal monogram and hashtag across all 3D scenes.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & VENUE */}
        {activeTab === 'venue' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#121218] p-4 rounded-2xl border border-pink-500/25 shadow-md space-y-3.5">
              <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2">
                <span className="p-1.5 rounded-lg bg-pink-950/60 text-pink-400 border border-pink-500/30">
                  <Calendar className="w-4 h-4 text-pink-400" />
                </span>
                <div>
                  <h3 className="font-classic text-sm font-bold text-pink-100">
                    Wedding Date &amp; Venue Details
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Set the auspicious date, muhurtham ceremony time, and grand palace location
                  </p>
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                    Wedding Date *
                  </label>
                  <input
                    id="wedding-date-picker"
                    type="date"
                    value={config.weddingDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-2 text-xs font-semibold text-pink-100 outline-none"
                  />
                  <p className="text-[10px] text-pink-300 font-medium mt-1">
                    {config.weddingDateFormatted}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                    Ceremony Time *
                  </label>
                  <input
                    id="wedding-time-input"
                    type="text"
                    value={config.weddingTime}
                    onChange={(e) => handleTextChange('weddingTime', e.target.value)}
                    placeholder="e.g. 07:00 PM onwards"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-2 text-xs font-semibold text-pink-100 outline-none"
                  />
                </div>
              </div>

              {/* Venue Name */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1 flex items-center justify-between">
                  <span>Palace / Resort Venue *</span>
                  <span className="text-[10px] text-pink-400">Palace / Resort</span>
                </label>
                <div className="relative">
                  <input
                    id="venue-name-input"
                    type="text"
                    value={config.venueName}
                    onChange={(e) => handleTextChange('venueName', e.target.value)}
                    placeholder="e.g. The Oberoi Rajvilas Palace"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-2 text-sm font-semibold text-pink-100 outline-none shadow-inner"
                  />
                  <MapPin className="w-4 h-4 text-pink-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                    City, State *
                  </label>
                  <input
                    id="venue-city-input"
                    type="text"
                    value={config.venueCity}
                    onChange={(e) => handleTextChange('venueCity', e.target.value)}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs font-medium text-pink-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    id="google-maps-url-input"
                    type="url"
                    value={config.googleMapsUrl}
                    onChange={(e) => handleTextChange('googleMapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs text-pink-200 outline-none truncate"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-pink-200 mb-1">
                  Street Address
                </label>
                <input
                  id="venue-address-input"
                  type="text"
                  value={config.venueAddress}
                  onChange={(e) => handleTextChange('venueAddress', e.target.value)}
                  placeholder="e.g. Goner Road, Jagatpura, Jaipur, Rajasthan 302031"
                  className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs text-pink-200 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CEREMONIES (EVENTS & ITINERARY) */}
        {activeTab === 'ceremonies' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-classic text-sm font-bold text-pink-100 flex items-center gap-1.5">
                  <span>Wedding Ceremonies Itinerary</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-500/30 font-mono">
                    {config.events.length} Events
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Haldi, Mehendi, Sangeeth, Vivaha &amp; Reception 3D sections
                </p>
              </div>

              <button
                id="add-ceremony-btn"
                onClick={handleAddEvent}
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-cinzel font-bold shadow-[0_0_12px_rgba(236,72,153,0.3)] transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                + Add Ceremony
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {config.events.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="bg-[#121218] p-3.5 rounded-2xl border border-pink-500/25 shadow-sm space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between border-b border-pink-500/20 pb-1.5">
                    <span className="text-[10px] font-cinzel font-bold text-pink-200 bg-pink-950/60 px-2 py-0.5 rounded-md border border-pink-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-pink-400" />
                      Ceremony #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      type="button"
                      aria-label="Delete ceremony"
                      className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <input
                    type="text"
                    value={evt.title}
                    onChange={(e) => {
                      const updated = config.events.map((item) =>
                        item.id === evt.id ? { ...item, title: e.target.value } : item
                      );
                      onChange({ ...config, events: updated });
                    }}
                    placeholder="Ceremony Title (e.g. Royal Sangeeth & Musical Celebration)"
                    className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs font-bold text-pink-100 outline-none"
                  />

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={evt.date}
                      onChange={(e) => {
                        const updated = config.events.map((item) =>
                          item.id === evt.id ? { ...item, date: e.target.value } : item
                        );
                        onChange({ ...config, events: updated });
                      }}
                      placeholder="Date (e.g. 13 Dec 2026)"
                      className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-2.5 py-1 text-xs text-pink-200 outline-none"
                    />
                    <input
                      type="text"
                      value={evt.time}
                      onChange={(e) => {
                        const updated = config.events.map((item) =>
                          item.id === evt.id ? { ...item, time: e.target.value } : item
                        );
                        onChange({ ...config, events: updated });
                      }}
                      placeholder="Time (e.g. 06:30 PM)"
                      className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-2.5 py-1 text-xs text-pink-200 outline-none"
                    />
                  </div>

                  {/* Specific Venue & Dress Code */}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={evt.venue}
                      onChange={(e) => {
                        const updated = config.events.map((item) =>
                          item.id === evt.id ? { ...item, venue: e.target.value } : item
                        );
                        onChange({ ...config, events: updated });
                      }}
                      placeholder="Hall / Lawn (e.g. Royal Courtyard)"
                      className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-2.5 py-1 text-xs text-pink-200 outline-none"
                    />
                    <input
                      type="text"
                      value={evt.dressCode || ''}
                      onChange={(e) => {
                        const updated = config.events.map((item) =>
                          item.id === evt.id ? { ...item, dressCode: e.target.value } : item
                        );
                        onChange({ ...config, events: updated });
                      }}
                      placeholder="Dress Code (e.g. Royal Ethnic)"
                      className="w-full bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-xl px-2.5 py-1 text-xs text-pink-300 font-medium outline-none"
                    />
                  </div>

                  {/* 3D Section Background Image & Blessings Config */}
                  <div className="pt-1.5 border-t border-pink-500/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-cinzel font-bold text-pink-300 uppercase">
                        Ceremony 3D Background
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(`ceremony-section-${evt.id}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[10px] font-cinzel font-bold text-pink-400 hover:text-pink-300 underline flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        Preview 3D Section
                      </button>
                    </div>

                    {/* Quick 1-click Preset Backgrounds */}
                    <div className="grid grid-cols-5 gap-1 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.events.map((item) =>
                            item.id === evt.id ? { ...item, bgImageUrl: goldenHaldiImg, photoUrl: goldenHaldiImg } : item
                          );
                          onChange({ ...config, events: updated });
                        }}
                        className="p-1 rounded-lg border border-amber-500/50 bg-[#1A1508] hover:bg-[#28200A] text-[9px] font-bold text-amber-300 truncate"
                        title="Set Haldi Background"
                      >
                        🟡 Haldi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.events.map((item) =>
                            item.id === evt.id ? { ...item, bgImageUrl: twilightMehendiImg, photoUrl: twilightMehendiImg } : item
                          );
                          onChange({ ...config, events: updated });
                        }}
                        className="p-1 rounded-lg border border-emerald-500/50 bg-[#0A1A10] hover:bg-[#0E2818] text-[9px] font-bold text-emerald-300 truncate"
                        title="Set Mehendi Background"
                      >
                        🟢 Mehendi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.events.map((item) =>
                            item.id === evt.id ? { ...item, bgImageUrl: royalSangeetImg, photoUrl: royalSangeetImg } : item
                          );
                          onChange({ ...config, events: updated });
                        }}
                        className="p-1 rounded-lg border border-purple-500/50 bg-[#180A22] hover:bg-[#240E34] text-[9px] font-bold text-purple-300 truncate"
                        title="Set Sangeeth Background"
                      >
                        🟣 Sangeeth
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.events.map((item) =>
                            item.id === evt.id ? { ...item, bgImageUrl: royalSindoorImg, photoUrl: royalSindoorImg } : item
                          );
                          onChange({ ...config, events: updated });
                        }}
                        className="p-1 rounded-lg border border-rose-500/50 bg-[#200A10] hover:bg-[#300E18] text-[9px] font-bold text-rose-300 truncate"
                        title="Set Vivaha Background"
                      >
                        🔴 Vivaha
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.events.map((item) =>
                            item.id === evt.id ? { ...item, bgImageUrl: lavenderReceptionImg, photoUrl: lavenderReceptionImg } : item
                          );
                          onChange({ ...config, events: updated });
                        }}
                        className="p-1 rounded-lg border border-pink-500/50 bg-[#200A1A] hover:bg-[#300E26] text-[9px] font-bold text-pink-300 truncate"
                        title="Set Reception Background"
                      >
                        ⚪ Reception
                      </button>
                    </div>

                    {/* Live Blessing Count */}
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="font-cinzel text-neutral-300 font-medium">Blessing Count:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={evt.blessingCount ?? 150}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            const updated = config.events.map((item) =>
                              item.id === evt.id ? { ...item, blessingCount: val } : item
                            );
                            localStorage.setItem(`wedding_blessings_${evt.id}`, val.toString());
                            onChange({ ...config, events: updated });
                          }}
                          className="w-16 bg-[#08080C] border border-pink-500/30 focus:border-pink-500 rounded-lg px-2 py-0.5 text-right font-mono font-bold text-xs text-pink-200 outline-none"
                        />
                        <span className="text-neutral-400">blessings</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: MEDIA GALLERY */}
        {activeTab === 'photos' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Theme Artwork Collection Selector */}
            <div className="bg-gradient-to-br from-[#200414] via-[#10010A] to-[#080005] p-4 rounded-2xl text-white border border-pink-500/40 shadow-sm space-y-3">
              <div>
                <h3 className="font-cinzel text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  Wedding Artwork &amp; Ceremony Photos
                </h3>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  Curated photos matching your theme. Tap Hero, Scratch, or +Gallery to assign.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {THEME_PHOTO_LIBRARY.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden border border-pink-500/30 bg-black/60 flex flex-col"
                  >
                    <div className="relative w-full h-18 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1 py-0.2 rounded bg-black/80 text-pink-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[9px] font-medium text-neutral-200 p-1 truncate leading-tight">
                      {item.name}
                    </p>
                    <div className="p-1 pt-0 flex items-center gap-1">
                      <button
                        type="button"
                        title="Set as Hero Couple Portrait"
                        onClick={() => {
                          onChange({ ...config, heroCouplePhoto: item.url });
                          weddingAudio.playBlessingChime();
                        }}
                        className="flex-1 py-0.5 text-[8px] font-semibold bg-pink-600 hover:bg-pink-500 text-white rounded transition-colors text-center"
                      >
                        Hero
                      </button>
                      <button
                        type="button"
                        title="Set as Scratch Card Keepsake"
                        onClick={() => {
                          onChange({
                            ...config,
                            scratchRevealPhoto: item.url,
                            scratchRevealHeading: item.name.toUpperCase(),
                          });
                          weddingAudio.playBlessingChime();
                        }}
                        className="flex-1 py-0.5 text-[8px] font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors text-center"
                      >
                        Scratch
                      </button>
                      <button
                        type="button"
                        title="Add to 3D Polaroid Gallery"
                        onClick={() => {
                          const newPhoto = {
                            id: 'g-' + Date.now(),
                            url: item.url,
                            caption: item.name,
                            date: item.category + ' Moments',
                          };
                          onChange({
                            ...config,
                            galleryPhotos: [...config.galleryPhotos, newPhoto],
                          });
                          weddingAudio.playBlessingChime();
                        }}
                        className="flex-1 py-0.5 text-[8px] font-bold bg-pink-500/30 hover:bg-pink-500/50 text-pink-200 rounded transition-colors text-center"
                      >
                        + Gallery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Couple Photo */}
            <div className="bg-[#121218] p-4 rounded-2xl border border-pink-500/25 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-2">
                <div>
                  <h3 className="font-classic text-sm font-bold text-pink-100 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-pink-400" />
                    Hero Couple Portrait
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Featured on the royal scroll unfurl and welcoming section
                  </p>
                </div>
                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-3 h-3" />
                  Replace
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('heroCouplePhoto', e)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-pink-500/30 shadow-md">
                <img
                  src={config.heroCouplePhoto}
                  alt="Couple Hero"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Scratch-to-Reveal Keepsake & Gatefold Section */}
            <div className="bg-[#121218] p-4 rounded-2xl border border-amber-500/30 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div>
                  <h3 className="font-classic text-sm font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Scratch Keepsake &amp; Gatefold Photo
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    The intimate ritual photo revealed under the ceremonial gold foil
                  </p>
                </div>
                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                  <Upload className="w-3 h-3" />
                  Replace
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('scratchRevealPhoto', e)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-amber-500/30 shadow-md">
                <img
                  src={config.scratchRevealPhoto}
                  alt="Scratch Reveal Keepsake"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold text-amber-200 mb-1">
                    Keepsake Heading
                  </label>
                  <input
                    type="text"
                    value={config.scratchRevealHeading || ''}
                    onChange={(e) =>
                      onChange({ ...config, scratchRevealHeading: e.target.value })
                    }
                    placeholder="e.g. 3D ROMANTIC VOW: PINNING THE BOUTONNIÈRE"
                    className="w-full bg-[#08080C] border border-amber-500/30 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-amber-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel font-bold text-amber-200 mb-1">
                    Keepsake Note
                  </label>
                  <textarea
                    rows={2}
                    value={config.scratchRevealNote || ''}
                    onChange={(e) =>
                      onChange({ ...config, scratchRevealNote: e.target.value })
                    }
                    placeholder="Romantic description revealed when guests scratch the foil"
                    className="w-full bg-[#08080C] border border-amber-500/30 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-neutral-200 outline-none resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('scene-scratch-gatefold');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] font-cinzel font-bold text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Jump to Scratch &amp; Gatefold Section
                </button>
              </div>
            </div>

            {/* 3D Gallery Photos */}
            <div className="bg-[#121218] p-4 rounded-2xl border border-pink-500/25 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-2">
                <div>
                  <h3 className="font-classic text-sm font-bold text-pink-100 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    3D Polaroid Gallery ({config.galleryPhotos.length} Photos)
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Interactive polaroid photos in the 3D gallery scene
                  </p>
                </div>
                <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                  <Plus className="w-3 h-3" />
                  Add Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddGalleryPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {config.galleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative bg-[#0A0A0E] rounded-xl p-1.5 border border-pink-500/30 shadow-xs group overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <p className="text-[10px] font-medium text-pink-100 truncate mt-1 px-0.5">
                      {photo.caption}
                    </p>
                    <button
                      onClick={() => handleDeleteGalleryPhoto(photo.id)}
                      type="button"
                      aria-label="Delete photo"
                      className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: 3D THEMES & PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-gradient-to-br from-[#200414] via-[#10010A] to-[#080005] p-4 rounded-2xl text-white border border-pink-500/40 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    Cultural 3D Themes &amp; Foil Presets
                  </h3>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    One-click applies the complete visual theme, 3D foil card, and animations from start to end.
                  </p>
                </div>
                {onOpen3DStudio && (
                  <button
                    type="button"
                    onClick={onOpen3DStudio}
                    className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 text-xs font-cinzel font-bold shrink-0 transition-colors"
                  >
                    3D Studio ✨
                  </button>
                )}
              </div>
            </div>

            {/* Presets List */}
            <div className="space-y-3">
              {WEDDING_PRESETS.map((preset) => {
                const isActive =
                  config.theme?.presetId === preset.id ||
                  config.groomName.toLowerCase() === preset.groomName.toLowerCase();
                return (
                  <div
                    key={preset.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-pink-950/40 border-pink-500 ring-2 ring-pink-500/30 shadow-md'
                        : 'bg-[#121218] border-pink-500/20 hover:border-pink-400 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-22 rounded-xl overflow-hidden shrink-0 border border-pink-400/50 shadow-md">
                        <img
                          src={preset.coverImage}
                          alt={preset.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-block text-[9px] font-cinzel font-bold px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-500/30 uppercase tracking-wider">
                            {preset.badge}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-sans bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            ₹{preset.price}
                          </span>
                        </div>
                        <h4 className="font-classic text-sm font-bold text-pink-100 leading-tight">
                          {preset.name}
                        </h4>
                        <p className="text-[11px] text-pink-300/80 mt-0.5 line-clamp-1 italic">
                          {preset.subtitle}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {preset.culturalTheme} • {preset.venueCity}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onApplyPreset) {
                                onApplyPreset(preset);
                              }
                            }}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1 transition-all ${
                              isActive
                                ? 'bg-pink-600 text-white shadow-xs'
                                : 'bg-[#1A0512] hover:bg-[#28081C] text-pink-200 border border-pink-500/40 active:scale-95'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-pink-300" />
                                Active Theme
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                                Apply Theme
                              </>
                            )}
                          </button>

                          {onOpenPayment && (
                            <button
                              type="button"
                              onClick={() => {
                                if (onApplyPreset) onApplyPreset(preset);
                                onOpenPayment(preset.price);
                              }}
                              className="py-1.5 px-2.5 rounded-xl text-xs font-cinzel font-bold bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 flex items-center gap-1 shrink-0 shadow-sm transition-all active:scale-95"
                              title={`Buy & Publish ${preset.name} (₹${preset.price})`}
                            >
                              <Sparkles className="w-3 h-3 text-neutral-950" />
                              <span>Buy ₹{preset.price}</span>
                            </button>
                          )}

                          {onOpen3DStudio && (
                            <button
                              type="button"
                              onClick={onOpen3DStudio}
                              className="py-1.5 px-2 rounded-xl bg-black/50 hover:bg-black/70 text-neutral-300 text-xs font-semibold border border-pink-500/20"
                            >
                              3D View
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SUCCESS CELEBRATION CALLOUT (Shown after generating website) */}
      {showSuccessBanner && (
        <div className="mx-4 mb-2 p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 via-rose-950/40 to-pink-950/60 border-2 border-pink-500/60 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
              <div>
                <h4 className="font-cinzel text-xs font-bold text-pink-200 uppercase tracking-wide">
                  🎉 Wedding Website Generated!
                </h4>
                <p className="text-[11px] text-neutral-300 font-medium">
                  {config.groomName} &amp; {config.brideName}&apos;s 3D royal invitation is live.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessBanner(false)}
              className="text-neutral-400 hover:text-pink-300 text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerViewWebsite}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:opacity-95 text-white text-xs font-cinzel font-bold shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <Eye className="w-4 h-4 text-pink-200" />
              <span>View Live Website</span>
              <ArrowRight className="w-3.5 h-3.5 text-pink-200" />
            </button>
          </div>
        </div>
      )}

      {/* Prominent Action Footer: Generate & View Website */}
      <div className="p-3.5 bg-[#0A0A0E] border-t-2 border-pink-500/30 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <span className="flex items-center gap-1 font-cinzel font-semibold text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Invitation Status: {progressPercent}% Completed
          </span>
          <span className="text-pink-300/70 font-mono">
            {config.groomName} &amp; {config.brideName}
          </span>
        </div>

        {onOpenPayment && (
          <button
            type="button"
            onClick={() => onOpenPayment(activePrice)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-neutral-950" />
            <span>
              {config.isUnlocked
                ? 'VIP License Active • Upgrade or Re-Download'
                : `Buy & Publish Website — ₹${activePrice.toLocaleString('en-IN')}`}
            </span>
            <span className="text-[10px] bg-black/20 text-neutral-950 font-sans font-extrabold px-1.5 py-0.5 rounded">
              Razorpay Live
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {/* Main Generate Button */}
          <button
            id="generate-wedding-website-btn"
            type="button"
            onClick={handleGenerateWebsite}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white font-cinzel font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-95 hover:shadow-xl border border-pink-300/40"
          >
            <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
            <span>Generate 3D Wedding Website</span>
          </button>

          {/* View Website Button */}
          <button
            id="view-live-wedding-website-btn"
            type="button"
            onClick={handleTriggerViewWebsite}
            className={`py-3 px-3.5 rounded-xl font-cinzel font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
              isGenerated
                ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-400/50 ring-2 ring-pink-400/30 animate-pulse'
                : 'bg-[#14141C] hover:bg-[#1C1C26] text-pink-200 border-pink-500/30'
            }`}
            title="View Live 3D Wedding Website"
          >
            <Eye className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">View</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
