import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Wand2,
} from 'lucide-react';
import { InvitationConfig } from '../types';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebsiteCreated: (newConfig: InvitationConfig) => void;
  currentConfig: InvitationConfig;
}

export const CreateWebsiteModal: React.FC<CreateWebsiteModalProps> = ({
  isOpen,
  onClose,
  onWebsiteCreated,
  currentConfig,
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [groomName, setGroomName] = useState(currentConfig.groomName);
  const [brideName, setBrideName] = useState(currentConfig.brideName);
  const [weddingDate, setWeddingDate] = useState(currentConfig.weddingDate);
  const [weddingTime, setWeddingTime] = useState(currentConfig.weddingTime);
  const [venueName, setVenueName] = useState(currentConfig.venueName);
  const [venueCity, setVenueCity] = useState(currentConfig.venueCity);
  const [venueAddress, setVenueAddress] = useState(currentConfig.venueAddress);
  const [heroPhoto, setHeroPhoto] = useState(currentConfig.heroCouplePhoto);
  const [scratchPhoto, setScratchPhoto] = useState(currentConfig.scratchRevealPhoto);

  if (!isOpen) return null;

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setHeroPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScratchPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setScratchPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    setIsGenerating(true);

    // Format date
    const d = new Date(weddingDate);
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const gInitial = groomName.trim().charAt(0).toUpperCase() || 'G';
    const bInitial = brideName.trim().charAt(0).toUpperCase() || 'B';
    const monogram = `${gInitial}${bInitial}`;
    const hashtag = `#${groomName.replace(/\s+/g, '')}Weds${brideName.replace(/\s+/g, '')}`;

    const newConfig: InvitationConfig = {
      ...currentConfig,
      id: `wedding-${Date.now()}`,
      groomName: groomName.trim() || 'Groom',
      brideName: brideName.trim() || 'Bride',
      monogramText: monogram,
      weddingDate,
      weddingTime,
      weddingDateFormatted: formattedDate,
      venueName: venueName.trim() || 'Royal Palace',
      venueCity: venueCity.trim() || 'Udaipur, India',
      venueAddress: venueAddress.trim() || `${venueName}, ${venueCity}`,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(venueName + ' ' + venueCity)}`,
      hashtag,
      heroCouplePhoto: heroPhoto,
      scratchRevealPhoto: scratchPhoto,
      galleryPhotos: [
        {
          id: 'g-user-1',
          url: heroPhoto,
          caption: 'Two souls, one heart ✨',
          date: 'Special Moment',
        },
        ...currentConfig.galleryPhotos.slice(1),
      ],
    };

    setTimeout(() => {
      weddingAudio.playBlessingChime();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E11D48', '#FFD700', '#FFFFFF', '#EA580C'],
      });
      setIsGenerating(false);
      onWebsiteCreated(newConfig);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-900 via-rose-950 to-neutral-900 text-white border-b border-amber-500/30 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-lg mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-classic text-2xl font-bold text-amber-200">
              Create Your 3D Wedding Website
            </h2>
            <p className="text-xs text-amber-100/80 font-body mt-1 max-w-md">
              Enter couple details, date, venue, and upload photos to generate a viral 3D animated invitation website.
            </p>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 mt-4">
              <span
                className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center border transition-all ${
                  step === 1
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold scale-110'
                    : step > 1
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                1
              </span>
              <span className="w-6 h-0.5 bg-white/20" />
              <span
                className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center border transition-all ${
                  step === 2
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold scale-110'
                    : step > 2
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                2
              </span>
              <span className="w-6 h-0.5 bg-white/20" />
              <span
                className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center border transition-all ${
                  step === 3
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold scale-110'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                3
              </span>
            </div>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* STEP 1: COUPLE DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-amber-900 font-cinzel font-semibold text-xs uppercase tracking-wider border-b border-amber-100 pb-2">
                <Heart className="w-4 h-4 text-rose-600" />
                Step 1: Who is getting married?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Groom's Name *
                  </label>
                  <input
                    id="modal-input-groom"
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g., Pulkit"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Bride's Name *
                  </label>
                  <input
                    id="modal-input-bride"
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g., Shreya"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Preview Monogram Badge */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-950 font-cinzel">
                    Royal Monogram Emblem:
                  </p>
                  <p className="text-[11px] text-amber-800/80">
                    Will glow on the royal palace arch &amp; 3D scenes
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-600 border-2 border-amber-300 text-white font-title text-lg font-black flex items-center justify-center shadow-md">
                  {groomName.charAt(0).toUpperCase() || 'G'}
                  {brideName.charAt(0).toUpperCase() || 'B'}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & VENUE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-amber-900 font-cinzel font-semibold text-xs uppercase tracking-wider border-b border-amber-100 pb-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Step 2: When &amp; Where is the wedding?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Wedding Date *
                  </label>
                  <input
                    id="modal-input-date"
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Ceremony Time *
                  </label>
                  <input
                    id="modal-input-time"
                    type="time"
                    required
                    value={weddingTime}
                    onChange={(e) => setWeddingTime(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Venue Name *
                </label>
                <input
                  id="modal-input-venue"
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g., The Oberoi Udaivilas"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    City / Destination *
                  </label>
                  <input
                    id="modal-input-city"
                    type="text"
                    required
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="e.g., Udaipur, Rajasthan"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                    Address / Landmark
                  </label>
                  <input
                    id="modal-input-address"
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g., Haridas Ji Ki Magri, Mulla Talai"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD PHOTOS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-amber-900 font-cinzel font-semibold text-xs uppercase tracking-wider border-b border-amber-100 pb-2">
                <Upload className="w-4 h-4 text-amber-600" />
                Step 3: Upload Couple Photos
              </div>

              {/* Main Photo */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex items-center gap-4">
                <img
                  src={heroPhoto}
                  alt="Couple Preview"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-neutral-900 font-cinzel mb-0.5">
                    Main Couple Portrait
                  </h4>
                  <p className="text-[11px] text-neutral-500 mb-2">
                    Used for the blessing scene, gallery, and invitation card.
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Couple Photo
                    <input
                      id="modal-upload-hero-input"
                      type="file"
                      accept="image/*"
                      onChange={handleHeroPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Scratch Reveal Secret Photo */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-center gap-4">
                <img
                  src={scratchPhoto}
                  alt="Secret Scratch Preview"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500 shadow-md shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-amber-900 font-cinzel">
                      Secret Scratch-to-Reveal Photo
                    </h4>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      Interactive
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mb-2">
                    The surprise photo hidden under golden scratch foil.
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Reveal Photo
                    <input
                      id="modal-upload-scratch-input"
                      type="file"
                      accept="image/*"
                      onChange={handleScratchPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              type="button"
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              id="modal-next-step-btn"
              onClick={() => setStep(step + 1)}
              type="button"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-cinzel tracking-wider uppercase shadow-md transition-all active:scale-98"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="modal-create-website-btn"
              onClick={handleCreate}
              disabled={isGenerating}
              type="button"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 text-white text-xs font-bold font-cinzel tracking-widest uppercase shadow-xl hover:shadow-amber-500/40 transition-all active:scale-98 disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Crafting 3D Website...' : 'Create 3D Website ✨'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
