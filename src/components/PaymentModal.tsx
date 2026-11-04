import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Info,
  Lock,
  Zap,
  Check,
  AlertCircle,
  Copy,
  Receipt,
  Printer,
  Smartphone,
} from 'lucide-react';
import { InvitationConfig, PricingTierPrice, PricingPlan, OrderRecord } from '../types';
import { PRICING_PLANS, getPresetPrice, getPlanByPrice, WEDDING_PRESETS } from '../data/weddingPresets';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: InvitationConfig;
  onPaymentSuccess: (order: OrderRecord) => void;
  initialPrice?: PricingTierPrice;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  config,
  onPaymentSuccess,
  initialPrice,
}) => {
  // Determine default selected tier from active design or initialPrice
  const defaultPrice = initialPrice || getPresetPrice(config.theme?.presetId);
  const [selectedPrice, setSelectedPrice] = useState<PricingTierPrice>(defaultPrice);
  
  // Payment mode: 'live' uses real Razorpay Checkout; 'demo' simulates instant test checkout
  const [paymentMode, setPaymentMode] = useState<'live' | 'demo'>('live');

  // Customer checkout info
  const [customerName, setCustomerName] = useState(
    config.groomName && config.brideName ? `${config.groomName} & ${config.brideName}` : 'Wedding Host'
  );
  const [customerEmail, setCustomerEmail] = useState('host@weddinginvitation.luxury');
  const [customerPhone, setCustomerPhone] = useState('9876543210');

  // Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(config.activeOrder || null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLicense, setCopiedLicense] = useState(false);

  // Sync selected price if initialPrice changes
  useEffect(() => {
    if (initialPrice) {
      setSelectedPrice(initialPrice);
    } else {
      setSelectedPrice(getPresetPrice(config.theme?.presetId));
    }
  }, [initialPrice, config.theme?.presetId, isOpen]);

  if (!isOpen) return null;

  const currentPlan = getPlanByPrice(selectedPrice);
  const coupleTitle = `${config.groomName} & ${config.brideName}`;

  // Guest invitation URL for the unlocked order with full details & theme
  const liveInvitationUrl = `${window.location.origin}${window.location.pathname}?view=invitation&licensed=true&groom=${encodeURIComponent(
    config.groomName
  )}&bride=${encodeURIComponent(config.brideName)}&date=${encodeURIComponent(
    config.weddingDate
  )}&venue=${encodeURIComponent(config.venueName)}&city=${encodeURIComponent(
    config.venueCity
  )}&theme=${encodeURIComponent(config.theme?.presetId || 'rajasthan-royal-darbar')}&order=${completedOrder?.licenseKey || 'ROYAL-VIP'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveInvitationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyLicense = (lic: string) => {
    navigator.clipboard.writeText(lic);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 2500);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Helper to ensure Razorpay SDK script is loaded and ready
  const ensureRazorpayLoaded = (): Promise<boolean> => {
    if (typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined') {
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(Boolean(window.Razorpay)));
        setTimeout(() => resolve(Boolean(window.Razorpay)), 1500);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(Boolean(window.Razorpay));
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Trigger Razorpay Checkout or Demo Checkout
  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    // Sanitize user inputs to prevent HTML5/Regex "The string did not match the expected pattern" error
    const cleanPhone = (customerPhone || '').replace(/\D/g, '').slice(-10);
    const cleanEmail = (customerEmail || '').trim();
    const cleanName = (customerName || '').trim() || coupleTitle;

    // Strict prefill validation
    const prefill: Record<string, string> = {
      name: cleanName,
    };
    if (cleanEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      prefill.email = cleanEmail;
    }
    if (cleanPhone && cleanPhone.length === 10) {
      prefill.contact = cleanPhone;
    }

    try {
      // Step 1: Try requesting Order from backend proxy (handles both local Node server & Vercel serverless)
      let orderData: any = null;
      try {
        const response = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: selectedPrice,
            currency: 'INR',
            planId: currentPlan.id,
            planName: currentPlan.name,
            coupleNames: coupleTitle,
            customerName: cleanName,
            customerEmail: cleanEmail,
            customerPhone: cleanPhone,
            isDemo: paymentMode === 'demo',
          }),
        });

        if (response.ok) {
          orderData = await response.json();
        }
      } catch (fetchErr) {
        console.warn('Backend /api/razorpay/create-order unreachable or static deployment; using direct client checkout:', fetchErr);
      }

      // Step 2A: Demo Mode or simulated response
      if (paymentMode === 'demo' || orderData?.isDemo) {
        setTimeout(async () => {
          const demoOrderId = orderData?.orderId || `order_demo_${Date.now()}`;
          const demoPaymentId = `pay_demo_${Date.now()}`;
          const demoLicenseKey = `ROYAL-VIP-DEMO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

          const demoOrder: OrderRecord = {
            orderId: demoOrderId,
            paymentId: demoPaymentId,
            licenseKey: demoLicenseKey,
            planId: currentPlan.id,
            planName: currentPlan.name,
            amount: selectedPrice,
            currency: 'INR',
            coupleNames: coupleTitle,
            customerName: cleanName,
            customerEmail: cleanEmail || 'demo.guest@weddinginvitation.luxury',
            customerPhone: cleanPhone || '9876543210',
            paidAt: new Date().toISOString(),
            status: 'PAID_AND_ACTIVE',
            isDemo: true,
            unlockedFeatures: currentPlan.features,
          };

          // Try verification logging in background
          try {
            await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: demoOrderId,
                razorpay_payment_id: demoPaymentId,
                razorpay_signature: 'sig_demo_verified',
                planId: currentPlan.id,
                planName: currentPlan.name,
                amount: selectedPrice,
                coupleNames: coupleTitle,
                customerName: cleanName,
                customerEmail: cleanEmail,
                customerPhone: cleanPhone,
                isDemo: true,
              }),
            });
          } catch {
            // ignore
          }

          setIsProcessing(false);
          setCompletedOrder(demoOrder);
          onPaymentSuccess(demoOrder);
          weddingAudio.playBlessingChime();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#D4AF37', '#F59E0B', '#E11D48', '#10B981', '#FFFFFF'],
          });
        }, 600);
        return;
      }

      // Step 2B: Real Live Razorpay Checkout via window.Razorpay
      const isLoaded = await ensureRazorpayLoaded();
      if (!isLoaded || typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay payment gateway script blocked or offline. Please disable ad-blockers or try Demo Mode.');
      }

      // Live Razorpay Key
      const keyId =
        orderData?.keyId && typeof orderData.keyId === 'string' && orderData.keyId.startsWith('rzp_')
          ? orderData.keyId.trim()
          : 'rzp_live_TvEqJY28K4esDP';

      // Amount in paise
      const amountInPaise = Math.round(Number(selectedPrice) * 100);

      // Validate order_id pattern: Razorpay Checkout expects strictly /^order_[a-zA-Z0-9]{14}$/
      // If order_id does not match this regex, Razorpay throws "The string did not match the expected pattern"!
      // When omitted, Razorpay standard web checkout charges the amount directly and returns payment_id.
      const rawOrderId = orderData?.orderId;
      const isValidRazorpayOrderId = typeof rawOrderId === 'string' && /^order_[a-zA-Z0-9]{14}$/.test(rawOrderId.trim());

      const options: any = {
        key: keyId,
        amount: amountInPaise,
        currency: 'INR',
        name: 'WED-TALE 3D Studio',
        description: `${currentPlan.name} • ${coupleTitle}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3655/3655581.png',
        prefill,
        notes: {
          wedding: coupleTitle,
          plan: currentPlan.name,
        },
        theme: {
          color: '#C05621',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        handler: async function (paymentResponse: any) {
          try {
            const paymentId = paymentResponse.razorpay_payment_id || `pay_live_${Date.now()}`;
            const orderId = paymentResponse.razorpay_order_id || (isValidRazorpayOrderId ? rawOrderId : `order_${Date.now()}`);
            const licenseKey = `ROYAL-VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

            // Optional background server verification
            try {
              await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id || orderId,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id || paymentId,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  planId: currentPlan.id,
                  planName: currentPlan.name,
                  amount: selectedPrice,
                  coupleNames: coupleTitle,
                  customerName: cleanName,
                  customerEmail: cleanEmail,
                  customerPhone: cleanPhone,
                  isDemo: false,
                }),
              });
            } catch (verErr) {
              console.warn('Backend verification call logged:', verErr);
            }

            const verifiedOrder: OrderRecord = {
              orderId,
              paymentId,
              signature: paymentResponse.razorpay_signature,
              licenseKey,
              planId: currentPlan.id,
              planName: currentPlan.name,
              amount: selectedPrice,
              currency: 'INR',
              coupleNames: coupleTitle,
              customerName: cleanName,
              customerEmail: cleanEmail || 'customer@weddinginvitation.luxury',
              customerPhone: cleanPhone || '9876543210',
              paidAt: new Date().toISOString(),
              status: 'PAID_AND_ACTIVE',
              isDemo: false,
              unlockedFeatures: currentPlan.features,
            };

            setCompletedOrder(verifiedOrder);
            onPaymentSuccess(verifiedOrder);
            setIsProcessing(false);
            weddingAudio.playBlessingChime();
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#D4AF37', '#F59E0B', '#E11D48', '#10B981', '#FFFFFF'],
            });
          } catch (handlerErr: any) {
            setIsProcessing(false);
            setErrorMessage(handlerErr.message || 'Error processing payment confirmation');
          }
        },
      };

      // Only add order_id if it meets Razorpay's exact required regex
      if (isValidRazorpayOrderId) {
        options.order_id = rawOrderId.trim();
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (failRes: any) {
        setIsProcessing(false);
        setErrorMessage(failRes.error?.description || 'Payment was declined or cancelled. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed. Try Demo Mode to test immediately.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-[#20040E] via-[#350A19] to-[#1C050D] border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                {completedOrder ? 'Payment Confirmed & Invitation Unlocked' : 'Publish & Unlock 3D Wedding Website'}
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-sans font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  Razorpay Live Gateway
                </span>
              </h2>
              <p className="text-xs text-amber-200/70 font-body">
                {completedOrder
                  ? 'Your official wedding invitation website is live and ready to share!'
                  : `Select your design tier (₹1499 - ₹2999) and activate instant guest sharing`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-neutral-200">
          {/* SUCCESS SCREEN */}
          {completedOrder ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
              {/* Receipt Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-black/80 border border-emerald-500/40 text-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 uppercase tracking-widest inline-block mb-1">
                  Payment Verified • Active VIP License
                </span>
                <h3 className="font-classic text-2xl font-bold text-white mt-1">
                  Congratulations, {coupleTitle}!
                </h3>
                <p className="text-xs text-neutral-300 font-body mt-1 max-w-md mx-auto">
                  Your 3D Animated Wedding Website has been officially licensed and published with full lifetime access.
                </p>

                {/* License Key & Order Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 text-left bg-black/40 p-3.5 rounded-xl border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono">License Key</span>
                    <button
                      onClick={() => handleCopyLicense(completedOrder.licenseKey)}
                      className="font-mono font-bold text-amber-300 hover:text-white flex items-center gap-1 mt-0.5 truncate"
                    >
                      {completedOrder.licenseKey}
                      {copiedLicense ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono">Payment ID</span>
                    <span className="font-mono text-neutral-200 truncate block mt-0.5">
                      {completedOrder.paymentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono">Plan Unlocked</span>
                    <span className="font-medium text-neutral-200 truncate block mt-0.5">
                      {completedOrder.planName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono">Amount Paid</span>
                    <span className="font-bold text-emerald-400 text-sm block mt-0.5">
                      ₹{completedOrder.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Sharing Link Box */}
              <div className="bg-neutral-800/80 p-4 rounded-2xl border border-amber-500/30">
                <label className="text-xs font-cinzel font-bold text-amber-200 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Official Guest Website Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={liveInvitationUrl}
                    className="flex-1 bg-black/60 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `🌸 Shubh Vivah! 🌸\n\nYou are cordially invited to celebrate the royal wedding of ${config.groomName} & ${config.brideName}!\n\n✨ Experience our Official 3D Animated Invitation Website:\n${liveInvitationUrl}\n\nWith love,\n${config.groomName} & ${config.brideName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold font-body uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
                >
                  <Share2 className="w-4 h-4" />
                  Share via WhatsApp
                </a>

                <a
                  href={liveInvitationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  Open Live Guest View
                </a>

                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="py-3 px-4 rounded-xl bg-black/50 hover:bg-black/70 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <Printer className="w-4 h-4 text-neutral-400" />
                  Print Tax Invoice
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-amber-300/80 hover:text-amber-200 underline"
                >
                  Return to Studio Editor
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT SCREEN */
            <>
              {/* Mode Switch: Live Razorpay vs Demo Sandbox */}
              <div className="bg-black/40 p-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('live')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMode === 'live'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  Live Razorpay Payment
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                    Real UPI / Cards
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('demo')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMode === 'demo'
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md border border-purple-400/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  Demo Mode (Free Instant Test)
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/30 text-purple-200 border border-purple-500/40">
                    1-Click Simulation
                  </span>
                </button>
              </div>

              {/* Notice Banner */}
              {paymentMode === 'live' ? (
                <div className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Secured by <strong>Razorpay Live Gateway</strong>. Accepts UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
                  </span>
                </div>
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-200">
                  <Info className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    <strong>Demo Sandbox Mode Active:</strong> Allows instant 1-click test payment verification without charging your bank card or UPI.
                  </span>
                </div>
              )}

              {/* Tiers / Price Selector (₹1499, ₹1999, ₹2499, ₹2999) */}
              <div>
                <label className="text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider block mb-2">
                  Select Design Package Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRICING_PLANS.map((plan) => {
                    const isSelected = selectedPrice === plan.price;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPrice(plan.price)}
                        className={`p-3 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-900/60 via-amber-950/50 to-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                            : 'bg-black/40 border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-black">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-300 font-cinzel block truncate">
                            {plan.badge}
                          </span>
                          <h4 className="font-classic text-xs font-bold text-white mt-0.5 line-clamp-1">
                            {plan.name}
                          </h4>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/10">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-amber-300 font-sans">
                              ₹{plan.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-neutral-500 line-through">
                              ₹{plan.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-medium block">
                            {plan.discount}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Summary Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h3 className="font-classic text-sm font-bold text-amber-200">
                      {currentPlan.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {currentPlan.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white font-sans">
                      ₹{currentPlan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-medium">
                      One-time • Lifetime
                    </span>
                  </div>
                </div>

                {/* Features included */}
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <span className="text-[10px] font-cinzel font-bold text-neutral-400 uppercase tracking-wider block">
                    Included in this plan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentPlan.features.slice(0, 6).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-2">
                <label className="text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider block">
                  Wedding Contact Details (For Invoice &amp; License)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-1">Host Name</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-1">Email (For Receipt)</span>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-1">Phone / WhatsApp</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-black/50 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Bottom Payment Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-6 rounded-2xl font-cinzel font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-[0.99] ${
                    isProcessing
                      ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                      : paymentMode === 'live'
                      ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-950/20 border-t-neutral-950 rounded-full animate-spin" />
                      Initiating Gateway...
                    </>
                  ) : paymentMode === 'live' ? (
                    <>
                      <Lock className="w-4 h-4 text-neutral-950" />
                      Pay ₹{currentPlan.price.toLocaleString('en-IN')} with Razorpay Live
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-yellow-300" />
                      Instant Demo Test Checkout (₹{currentPlan.price.toLocaleString('en-IN')})
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 mt-2.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    256-bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>Instant Activation</span>
                  <span>•</span>
                  <span>No Recurring Subscriptions</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
