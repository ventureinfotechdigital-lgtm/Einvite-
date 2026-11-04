import React, { useState, useEffect } from 'react';
import { InvitationConfig, ViewMode, RSVPResponse, PricingTierPrice, OrderRecord } from './types';
import { DEFAULT_INVITATION } from './data/defaultInvitation';
import { BuilderSidebar } from './components/BuilderSidebar';
import { MobileFrame } from './components/MobileFrame';
import { WeddingInvitationWebsite } from './components/WeddingInvitationWebsite';
import { ThreeDCardStudio } from './components/ThreeDCardStudio';
import { ShareModal } from './components/ShareModal';
import { CreateWebsiteModal } from './components/CreateWebsiteModal';
import { PaymentModal } from './components/PaymentModal';
import { PricingModal } from './components/PricingModal';
import { WeddingPreset, applyPresetToConfig, getPresetPrice } from './data/weddingPresets';
import { weddingAudio } from './utils/audioSynth';
import confetti from 'canvas-confetti';
import {
  Edit3,
  Eye,
  Smartphone,
  Maximize2,
  Sparkles,
  RefreshCw,
  Wand2,
  Layers,
  Globe,
  CreditCard,
  ShieldCheck,
  Tag,
  Lock,
  Check,
} from 'lucide-react';

export default function App() {
  // Check URL parameters for standalone guest view or customized names
  const queryParams = new URLSearchParams(window.location.search);
  const isGuestViewQuery = queryParams.get('view') === 'invitation';

  // Load from localStorage or defaults
  const [config, setConfig] = useState<InvitationConfig>(() => {
    const saved = localStorage.getItem('3d_wedding_invitation_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'royal-wedding-pulkit-shreya' || parsed.groomName === 'Pulkit') {
          return DEFAULT_INVITATION;
        }
        return parsed;
      } catch {
        // fallback
      }
    }

    // Override with query params if present
    const groom = queryParams.get('groom');
    const bride = queryParams.get('bride');
    const venue = queryParams.get('venue');
    const date = queryParams.get('date');

    const initial = { ...DEFAULT_INVITATION };
    if (groom) initial.groomName = groom;
    if (bride) initial.brideName = bride;
    if (venue) initial.venueName = venue;
    if (date) {
      initial.weddingDate = date;
      const d = new Date(date);
      initial.weddingDateFormatted = d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    if (groom && bride) {
      initial.monogramText = `${groom.charAt(0)}${bride.charAt(0)}`.toUpperCase();
      initial.hashtag = `#${groom}Weds${bride}`;
    }
    return initial;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeStage, setActiveStage] = useState<'website' | '3d-cards'>('website');
  const [mobileTab, setMobileTab] = useState<'builder' | 'preview'>('builder');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(isGuestViewQuery);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [checkoutTargetPrice, setCheckoutTargetPrice] = useState<PricingTierPrice>(() => getPresetPrice(config.theme?.presetId));

  // Persist config changes
  useEffect(() => {
    localStorage.setItem('3d_wedding_invitation_config', JSON.stringify(config));
  }, [config]);

  const handleOpenPayment = (price?: PricingTierPrice) => {
    if (price) {
      setCheckoutTargetPrice(price);
    } else {
      setCheckoutTargetPrice(getPresetPrice(config.theme?.presetId));
    }
    setIsPaymentModalOpen(true);
  };

  const handleOpenPricing = () => {
    setIsPricingModalOpen(true);
  };

  const handlePaymentSuccess = (order: OrderRecord) => {
    const updated: InvitationConfig = {
      ...config,
      isUnlocked: true,
      activeOrder: order,
    };
    setConfig(updated);
    localStorage.setItem('3d_wedding_invitation_config', JSON.stringify(updated));
  };

  const handleConfigChange = (updated: InvitationConfig) => {
    setConfig(updated);
  };

  const handleGenerateWebsite = () => {
    setActiveStage('website');
    setMobileTab('preview');
  };

  const handleViewWebsite = () => {
    setActiveStage('website');
    setMobileTab('preview');
  };

  const handleApplyPreset = (preset: WeddingPreset) => {
    weddingAudio.playBlessingChime();
    const updated = applyPresetToConfig(preset, config);
    setConfig(updated);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: preset.petalColors || ['#D4AF37', '#F59E0B', '#E11D48', '#FFFFFF'],
    });
  };

  const handleAddRSVP = (newRSVP: RSVPResponse) => {
    const updated = {
      ...config,
      rsvpResponses: [newRSVP, ...config.rsvpResponses],
    };
    setConfig(updated);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset invitation to default sample template (Pulkit & Shreya)?')) {
      setConfig(DEFAULT_INVITATION);
      localStorage.removeItem('3d_wedding_invitation_config');
    }
  };

  // Pure Guest View (When shared to friends & family or opened via standalone link)
  if (isGuestMode) {
    const isGuestUnlocked = Boolean(
      config.isUnlocked ||
      queryParams.get('licensed') === 'true' ||
      Boolean(queryParams.get('order'))
    );
    const activePrice = getPresetPrice(config.theme?.presetId);

    // If invitation is locked, show royal purchase gate instead of free guest preview
    if (!isGuestUnlocked) {
      return (
        <main className="relative w-full h-screen bg-[#0A0508] overflow-y-auto flex flex-col items-center justify-center p-4">
          {/* Subtle animated background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative w-full max-w-md bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
            {/* Couple Monogram Badge */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-rose-600 p-0.5 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
                <span className="font-classic text-amber-300 font-bold text-lg">
                  {config.monogramText || 'WED'}
                </span>
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-cinzel font-bold border border-amber-500/40 uppercase tracking-widest inline-flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                Private 3D Wedding Website
              </span>
              <h1 className="font-classic text-2xl font-bold text-white mt-2">
                {config.groomName} &amp; {config.brideName}
              </h1>
              <p className="text-xs text-amber-200/70 font-editorial italic mt-0.5">
                {config.weddingDateFormatted} • {config.venueName}, {config.venueCity}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 text-left space-y-2 text-xs text-neutral-300">
              <p className="leading-relaxed">
                This 3D wedding invitation is currently in <strong>private preview</strong>. Free external guest access links have been disabled.
              </p>
              <p className="text-[11px] text-amber-200/80">
                To experience this animated 3D invitation website or share it with family and friends on WhatsApp, please purchase your design license.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Interactive 3D unrolling scroll &amp; gatefold card</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Royal palace music serenades &amp; live blessings</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Unlimited guest RSVP tracking &amp; photo gallery</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleOpenPayment(activePrice)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Unlock Official Website (₹{activePrice.toLocaleString('en-IN')})</span>
              </button>

              <button
                type="button"
                onClick={handleOpenPricing}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-200 border border-neutral-700 font-cinzel font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Compare All 4 Packages (₹1,499 - ₹2,999)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = window.location.pathname;
                }}
                className="text-xs text-neutral-400 hover:text-white underline pt-1 block mx-auto transition-colors"
              >
                Open in Creator Studio (Edit Free in App) &rarr;
              </button>
            </div>
          </div>

          {/* Payment and Pricing Modals */}
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            config={config}
            onPaymentSuccess={handlePaymentSuccess}
            initialPrice={checkoutTargetPrice}
          />

          <PricingModal
            isOpen={isPricingModalOpen}
            onClose={() => setIsPricingModalOpen(false)}
            config={config}
            onSelectPlan={(price) => {
              setIsPricingModalOpen(false);
              handleOpenPayment(price);
            }}
          />
        </main>
      );
    }

    // Unlocked guest view: Render the official interactive 3D wedding website
    return (
      <main className="relative w-full h-screen bg-neutral-950 overflow-hidden flex flex-col items-center justify-center">
        {/* Responsive mobile width container for optimal viewing on desktop or mobile */}
        <div className="w-full h-full max-w-md mx-auto relative shadow-2xl overflow-hidden">
          <WeddingInvitationWebsite
            config={config}
            isStandalone={true}
          />
        </div>

        {/* Studio Preview Exit: Only visible when studio creator toggled Guest View for testing */}
        {!isGuestViewQuery && (
          <button
            onClick={() => setIsGuestMode(false)}
            className="fixed bottom-4 right-4 z-50 bg-black/80 hover:bg-black text-pink-200 border border-pink-500/40 text-xs px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-all"
            title="Return to Studio Creator"
          >
            <Eye className="w-3.5 h-3.5" />
            Exit Guest View
          </button>
        )}
      </main>
    );
  }

  return (
    <div className="relative w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-neutral-900">
      {/* Mobile Top Navigation Bar (Visible only on small screens < lg) */}
      <div className="lg:hidden w-full bg-gradient-to-r from-[#18030F] via-[#0D0108] to-[#080005] border-b border-pink-500/30 px-3 py-2 flex items-center justify-between z-40 shrink-0 shadow-md">
        <span className="font-cinzel text-xs font-bold text-pink-200 truncate pr-2">
          {config.groomName} &amp; {config.brideName}
        </span>
        <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-pink-500/30">
          <button
            type="button"
            onClick={() => setMobileTab('builder')}
            className={`px-2.5 py-1 text-xs rounded-md font-cinzel font-bold transition-all ${
              mobileTab === 'builder'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            Studio
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileTab('preview');
              setActiveStage('website');
            }}
            className={`px-2.5 py-1 text-xs rounded-md font-cinzel font-bold transition-all ${
              mobileTab === 'preview'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                : 'text-pink-200/70 hover:text-white'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {/* Left Sidebar: Creator Studio / Configurator */}
      <div className={`h-full ${mobileTab === 'builder' ? 'flex flex-col w-full' : 'hidden'} lg:flex lg:w-auto shrink-0`}>
        <BuilderSidebar
          config={config}
          onChange={handleConfigChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenShare={() => setIsShareModalOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenPayment={handleOpenPayment}
          onOpenPricing={handleOpenPricing}
          onOpen3DStudio={() => {
            setActiveStage('3d-cards');
            setMobileTab('preview');
          }}
          onApplyPreset={handleApplyPreset}
          onGenerateWebsite={handleGenerateWebsite}
          onViewWebsite={handleViewWebsite}
        />
      </div>

      {/* Right Canvas: Live 3D Animated Website & 3D Cards Stage */}
      <main className={`relative flex-1 h-full overflow-hidden ${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex flex-col bg-gradient-to-br from-neutral-950 via-[#18080C] to-neutral-950`}>
        {/* Top Floating Control Bar over preview canvas */}
        <header className="relative z-30 w-full h-12 border-b border-pink-500/20 bg-[#0A0A0E]/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between">
          {/* Left: Stage Switcher (Website vs 3D Cards Studio) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-pink-500/25 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveStage('website')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-cinzel transition-all ${
                  activeStage === 'website'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-pink-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D Website</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('3d-cards')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-cinzel transition-all ${
                  activeStage === '3d-cards'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-pink-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-pink-300" />
                <span>3D Cards &amp; Presets</span>
              </button>
            </div>

            <span className="hidden xl:inline-block text-xs font-cinzel text-neutral-400 tracking-wider">
              {config.groomName} &amp; {config.brideName}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Pricing Plans button */}
            <button
              type="button"
              onClick={handleOpenPricing}
              className="text-xs text-amber-200 hover:text-white bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 px-2.5 py-1 rounded-md flex items-center gap-1 font-cinzel font-semibold transition-colors"
              title="Compare all 4 Pricing Tiers (₹1,499 - ₹2,999)"
            >
              <Tag className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Pricing (₹1499 - ₹2999)</span>
              <span className="sm:hidden">Plans</span>
            </button>

            {/* Buy & Publish CTA button */}
            <button
              type="button"
              onClick={() => handleOpenPayment()}
              className="text-xs text-neutral-950 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 px-3 py-1 rounded-md flex items-center gap-1.5 font-cinzel font-bold shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
              <span>
                {config.isUnlocked
                  ? 'VIP Active'
                  : `Buy ₹${getPresetPrice(config.theme?.presetId)}`}
              </span>
            </button>

            <button
              id="top-bar-create-website-btn"
              onClick={() => setIsCreateModalOpen(true)}
              type="button"
              className="text-xs text-white bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:opacity-95 px-3 py-1 rounded-md flex items-center gap-1.5 font-cinzel font-bold shadow-md transition-all active:scale-95 border border-pink-400/30"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Wizard</span>
            </button>

            <button
              onClick={handleResetToDefault}
              type="button"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
              title="Reset to default Pulkit &amp; Shreya template"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsGuestMode(true)}
              type="button"
              className="text-xs text-pink-300 hover:text-pink-200 bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/40 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition-colors"
            >
              <Eye className="w-3 h-3" />
              Guest View
            </button>
          </div>
        </header>

        {/* Center Preview Stage: Mode Dependent */}
        <div className="relative flex-1 w-full h-[calc(100%-48px)] flex items-center justify-center overflow-hidden">
          {activeStage === '3d-cards' ? (
            /* Stage A: Full-featured 3D Cards & Presets Studio */
            <div className="w-full h-full animate-in fade-in duration-200">
              <ThreeDCardStudio
                onApplyPreset={(preset) => {
                  handleApplyPreset(preset);
                  setActiveStage('website');
                }}
                onOpenPayment={handleOpenPayment}
                onOpenPricing={handleOpenPricing}
                currentCouple={{
                  groom: config.groomName,
                  bride: config.brideName,
                  date: config.weddingDateFormatted,
                  venue: config.venueName,
                }}
              />
            </div>
          ) : (
            /* Stage B: Live 3D Website Preview (Device Frame or Fullscreen) */
            <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              {viewMode === 'split' ? (
                /* Mode 1: Realistic Smartphone Frame matching the viral video */
                <div className="relative max-h-full flex items-center justify-center animate-in zoom-in-95 duration-200">
                  <MobileFrame coupleNames={`${config.groomName.toLowerCase()}-${config.brideName.toLowerCase()}.wedding`}>
                    <WeddingInvitationWebsite config={config} />
                  </MobileFrame>
                </div>
              ) : (
                /* Mode 2: Responsive Fullscreen View */
                <div className="relative w-full h-full max-w-lg mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                  <WeddingInvitationWebsite config={config} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Share / WhatsApp Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        config={config}
        onOpenPayment={handleOpenPayment}
        onOpenPricing={handleOpenPricing}
      />

      {/* Interactive 3D Website Creation Wizard */}
      <CreateWebsiteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onWebsiteCreated={(newConfig) => {
          setConfig(newConfig);
          setActiveStage('website');
          setViewMode('split');
        }}
        currentConfig={config}
      />

      {/* Payment & Razorpay Checkout Modal (Live & Demo) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        config={config}
        initialPrice={checkoutTargetPrice}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Pricing Catalog & Plan Comparison Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentSelectedPrice={checkoutTargetPrice}
        onSelectPlan={(price) => {
          setCheckoutTargetPrice(price);
          setIsPricingModalOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />
    </div>
  );
}
