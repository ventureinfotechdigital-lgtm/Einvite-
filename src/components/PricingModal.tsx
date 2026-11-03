import React from 'react';
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Crown,
  Heart,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { PRICING_PLANS } from '../data/weddingPresets';
import { PricingTierPrice, PricingPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (price: PricingTierPrice) => void;
  currentSelectedPrice?: PricingTierPrice;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  currentSelectedPrice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-neutral-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#20040E] via-[#350A19] to-[#1C050D] border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider font-cinzel">
                Official Pricing &amp; Designs Catalog
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider font-cinzel">
                Razorpay Live + Demo Mode
              </span>
            </div>
            <h2 className="font-classic text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Wedding Invitation Website Packages
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs text-amber-200/80 font-body mt-0.5">
              Transparent one-time pricing (₹1,499 - ₹2,999) based on design complexity, 3D physics, and ceremony scenes
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PLANS.map((plan) => {
              const isCurrent = currentSelectedPrice === plan.price;
              const isUltra = plan.price === 2999;
              const isImperial = plan.price === 2499;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-5 flex flex-col justify-between border transition-all duration-300 ${
                    isUltra
                      ? 'bg-gradient-to-b from-[#2E0B19] via-[#1B050E] to-[#100308] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/60'
                      : isImperial
                      ? 'bg-gradient-to-b from-[#1C0F2B] via-[#11081A] to-[#0A0410] border-purple-500/50 shadow-lg'
                      : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider ${
                        isUltra
                          ? 'bg-amber-500 text-neutral-950 shadow-sm'
                          : isImperial
                          ? 'bg-purple-600 text-white'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {plan.discount}
                    </span>
                  </div>

                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="font-classic text-lg font-bold text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {plan.tagline}
                    </p>

                    {/* Price Tag */}
                    <div className="mt-4 pb-4 border-b border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans text-3xl font-extrabold text-amber-300">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                        <span className="font-sans text-xs text-neutral-500 line-through">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        One-time fee • Lifetime cloud hosting
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="py-4 space-y-2">
                      <span className="text-[10px] font-cinzel font-bold text-amber-200 uppercase tracking-wider block mb-2">
                        Key Inclusions:
                      </span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recommended designs */}
                    <div className="pt-2 pb-4">
                      <span className="text-[10px] font-cinzel font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Matched Designs:
                      </span>
                      <div className="space-y-1">
                        {plan.recommendedDesigns.map((des, dIdx) => (
                          <div
                            key={dIdx}
                            className="text-[11px] text-amber-200/80 bg-black/40 px-2 py-1 rounded-md border border-white/5 truncate"
                          >
                            • {des}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-3 border-t border-white/10 mt-auto">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan.price)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 ${
                        isUltra
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold'
                          : isImperial
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-amber-200 border border-amber-500/30'
                      }`}
                    >
                      <span>Unlock for ₹{plan.price.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantee Footer */}
          <div className="mt-6 p-4 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">100% Satisfaction Guarantee</span>
                <span>Both Live Real Razorpay Payments &amp; Instant Demo Mode available for testing.</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-neutral-300 font-cinzel text-[11px]">
              <span>✓ Instant QR Generation</span>
              <span>✓ WhatsApp 1-Click Invite</span>
              <span>✓ Mobile Responsive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
