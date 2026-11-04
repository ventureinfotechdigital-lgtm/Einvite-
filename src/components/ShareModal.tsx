import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  QrCode,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  ChevronRight,
  Gift,
} from 'lucide-react';
import { InvitationConfig, PricingTierPrice } from '../types';
import { getPresetPrice, getPlanByPrice } from '../data/weddingPresets';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: InvitationConfig;
  onOpenPayment?: (price?: PricingTierPrice) => void;
  onOpenPricing?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  config,
  onOpenPayment,
  onOpenPricing,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activePrice = getPresetPrice(config.theme?.presetId);
  const activePlan = getPlanByPrice(activePrice);

  // Standalone official licensed guest URL (Only for unlocked orders)
  const officialGuestUrl = `${window.location.origin}${window.location.pathname}?view=invitation&licensed=true&groom=${encodeURIComponent(
    config.groomName
  )}&bride=${encodeURIComponent(config.brideName)}&date=${encodeURIComponent(
    config.weddingDate
  )}&venue=${encodeURIComponent(config.venueName)}&city=${encodeURIComponent(
    config.venueCity
  )}&theme=${encodeURIComponent(config.theme?.presetId || 'rajasthan-royal-darbar')}&order=${config.activeOrder?.licenseKey || 'ROYAL-VIP'}`;

  const whatsappMessage = encodeURIComponent(
    `🌸 Shubh Vivah! 🌸\n\nYou are cordially invited to celebrate the royal wedding of ${config.groomName} & ${config.brideName}!\n\n📅 Date: ${config.weddingDateFormatted}\n📍 Venue: ${config.venueName}, ${config.venueCity}\n\n✨ Experience our Official 3D Animated Invitation Website with interactive scroll, sacred ceremonies & royal music:\n${officialGuestUrl}\n\nWith love,\n${config.groomName} & ${config.brideName}`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(officialGuestUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenCheckout = () => {
    onClose();
    if (onOpenPayment) {
      onOpenPayment(activePrice);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-500/40 p-6 text-neutral-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner ${
              config.isUnlocked
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {config.isUnlocked ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <Lock className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <h3 className="font-classic text-xl font-bold text-white">
            {config.isUnlocked ? 'Share Official Guest Invitation' : 'Official Guest Link Locked'}
          </h3>
          <p className="text-xs text-neutral-400 font-body mt-1">
            {config.isUnlocked
              ? 'Your VIP wedding invitation website is unlocked and ready for all guests'
              : 'Preview your design directly inside this app. Purchase to unlock the official guest link.'}
          </p>
        </div>

        {/* UNLOCKED STATE: Verified Guest Sharing Controls */}
        {config.isUnlocked ? (
          <div className="space-y-4">
            <div className="bg-black/50 p-3.5 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-cinzel font-semibold text-emerald-300 uppercase tracking-wider block">
                  Official Guest Website Link
                </label>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  VIP Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={officialGuestUrl}
                  className="flex-1 bg-black/60 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-300 font-mono select-all focus:outline-none"
                />
                <button
                  id="copy-invitation-link-btn"
                  onClick={handleCopyLink}
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Quick Action Buttons for Unlocked State */}
            <div className="space-y-2.5">
              <a
                id="share-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold font-body uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                Share via WhatsApp
              </a>

              <a
                id="open-standalone-tab-btn"
                href={officialGuestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold font-body flex items-center justify-center gap-2 border border-neutral-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-amber-300" />
                Open Live Guest View in New Tab
              </a>
            </div>

            {/* QR Info */}
            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                License: {config.activeOrder?.licenseKey || 'ROYAL-VIP'}
              </span>
              <span className="font-mono text-[11px] text-amber-300 font-medium">
                {config.hashtag}
              </span>
            </div>
          </div>
        ) : (
          /* LOCKED STATE: Free guest link removed; prompt user to purchase */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 via-black/60 to-black/80 border border-amber-500/30 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  VIP Guest Access Required
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 font-sans">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-body">
                To prevent unauthorized distribution, free external guest preview links have been disabled. You can freely customize and preview everything directly in the app.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Permanent unique wedding website link for all guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>One-click WhatsApp invitation broadcast card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Live interactive 3D Scroll, Gatefold &amp; Musician animations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Instant RSVP tracking &amp; guest petal blessings</span>
                </div>
              </div>
            </div>

            {/* Direct Unlock / Buy CTA Button */}
            <button
              id="unlock-guest-link-cta-btn"
              type="button"
              onClick={handleOpenCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-neutral-950" />
              <span>Purchase &amp; Unlock Guest Link (₹{activePrice.toLocaleString('en-IN')})</span>
            </button>

            {/* Compare Plans Link */}
            {onOpenPricing && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="w-full py-2 text-center text-xs text-amber-300/80 hover:text-amber-200 font-cinzel font-semibold transition-colors"
              >
                Compare all 4 Design Tiers (₹1,499 - ₹2,999) &rarr;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
