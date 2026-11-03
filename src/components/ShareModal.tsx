import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, ExternalLink, QrCode, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import { InvitationConfig, PricingTierPrice } from '../types';
import { getPresetPrice } from '../data/weddingPresets';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: InvitationConfig;
  onOpenPayment?: (price?: PricingTierPrice) => void;
  onOpenPricing?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, config, onOpenPayment, onOpenPricing }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Standalone URL for guests to open the pure wedding site without editor sidebar
  const standaloneUrl = `${window.location.origin}${window.location.pathname}?view=invitation&groom=${encodeURIComponent(
    config.groomName
  )}&bride=${encodeURIComponent(config.brideName)}&date=${encodeURIComponent(
    config.weddingDate
  )}&venue=${encodeURIComponent(config.venueName)}`;

  const whatsappMessage = encodeURIComponent(
    `🌸 Shubh Vivah! 🌸\n\nYou are cordially invited to celebrate the royal wedding of ${config.groomName} & ${config.brideName}!\n\n📅 Date: ${config.weddingDateFormatted}\n📍 Venue: ${config.venueName}, ${config.venueCity}\n\n✨ Experience our 3D Animated Invitation Website with interactive scroll, secret reveal & royal music:\n${standaloneUrl}\n\nWith love,\n${config.groomName} & ${config.brideName}`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(standaloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="font-classic text-xl font-bold text-neutral-900">
            Share 3D Wedding Invitation
          </h3>
          <p className="text-xs text-neutral-500 font-body mt-1">
            Send this interactive animated experience to your guests
          </p>
        </div>

        {/* Standalone Guest Link Box */}
        <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-cinzel font-semibold text-neutral-700 uppercase tracking-wider block">
              Guest Invitation Link
            </label>
            {config.isUnlocked ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                VIP Unlocked
              </span>
            ) : (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                Free Preview Link
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={standaloneUrl}
              className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-700 font-mono select-all focus:outline-none"
            />
            <button
              id="copy-invitation-link-btn"
              onClick={handleCopyLink}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Upgrade / License Banner */}
        {!config.isUnlocked && onOpenPayment && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-cinzel font-bold text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Unlock Official Lifetime Hosting
              </span>
              <p className="text-[11px] text-amber-800 line-clamp-1">
                Packages from ₹1,499 - ₹2,999 • Razorpay Live &amp; Demo
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPayment(getPresetPrice(config.theme?.presetId));
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-cinzel font-bold shadow-sm shrink-0 flex items-center gap-1"
            >
              <span>Unlock (₹{getPresetPrice(config.theme?.presetId)})</span>
            </button>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct Share */}
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

          {/* Open in Fullscreen Standalone Tab */}
          <a
            id="open-standalone-tab-btn"
            href={standaloneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold font-body flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-amber-300" />
            Open Guest View in New Tab
          </a>
        </div>

        {/* QR Code generator placeholder / info */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-amber-700" />
            Scan &amp; View on Mobile
          </span>
          <span className="font-mono text-[11px] text-amber-800 font-medium">
            {config.hashtag}
          </span>
        </div>
      </div>
    </div>
  );
};
