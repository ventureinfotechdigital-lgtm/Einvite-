import React, { useState } from 'react';
import { Sparkles, Heart, Send, CheckCircle2, User, Phone, Users, MessageSquare } from 'lucide-react';
import { InvitationConfig, RSVPResponse } from '../types';
import { weddingAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface SceneRSVPProps {
  config: InvitationConfig;
  onAddRSVP: (rsvp: RSVPResponse) => void;
}

export const SceneRSVP: React.FC<SceneRSVPProps> = ({ config, onAddRSVP }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [attending, setAttending] = useState(true);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRSVP: RSVPResponse = {
      id: 'rsvp-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      guests: Number(guests),
      attending,
      message: message.trim(),
      submittedAt: 'Just now',
    };

    onAddRSVP(newRSVP);
    setSubmitted(true);
    weddingAudio.playBlessingChime();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E11D48', '#FF69B4', '#FEF08A'],
    });
  };

  return (
    <section id="scene-rsvp" className="relative w-full min-h-[660px] h-full flex flex-col items-center justify-between p-6 overflow-hidden bg-[#18080C] select-none text-white">
      {/* Ornate Indian gold foil filigree background watermark */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Header - Matching video "JOIN US - RSVP" */}
      <div className="relative z-10 text-center pt-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-cinzel tracking-widest uppercase text-amber-400 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>JOIN US</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-script text-amber-200 tracking-wide">
          RSVP
        </h2>
        <p className="text-xs text-amber-100/70 font-editorial italic mt-1">
          Kindly grace us with your response by November 30
        </p>
      </div>

      {/* Center RSVP Form Container */}
      <div className="relative z-10 w-full max-w-sm my-auto">
        {submitted ? (
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-amber-400/50 shadow-2xl text-center flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-classic text-xl font-bold text-amber-200">
              RSVP Received with Gratitude!
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-body">
              Thank you, <strong className="text-white">{name}</strong>! We are overjoyed to celebrate our special day with you.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setMessage('');
                setPhone('');
              }}
              type="button"
              className="mt-2 text-xs font-cinzel text-amber-300 underline underline-offset-4 hover:text-amber-200"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-amber-400/30 shadow-2xl flex flex-col gap-3"
          >
            {/* Attending / Regret Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-cinzel font-semibold transition-all ${
                  attending
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                Will Attend with Joy
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-cinzel font-semibold transition-all ${
                  !attending
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-500'
                    : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                }`}
              >
                Regretfully Decline
              </button>
            </div>

            {/* Your Name */}
            <div>
              <label className="text-[11px] font-cinzel tracking-wider text-amber-300 flex items-center gap-1 mb-1">
                <User className="w-3 h-3 text-amber-400" />
                Your Name *
              </label>
              <input
                id="rsvp-guest-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rohan & Aditi"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Phone number */}
            <div>
              <label className="text-[11px] font-cinzel tracking-wider text-amber-300 flex items-center gap-1 mb-1">
                <Phone className="w-3 h-3 text-amber-400" />
                Phone Number
              </label>
              <input
                id="rsvp-guest-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Number of guests */}
            {attending && (
              <div>
                <label className="text-[11px] font-cinzel tracking-wider text-amber-300 flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-amber-400" />
                  Number of Guests
                </label>
                <select
                  id="rsvp-guest-count"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5+ Family</option>
                </select>
              </div>
            )}

            {/* Message for couple */}
            <div>
              <label className="text-[11px] font-cinzel tracking-wider text-amber-300 flex items-center gap-1 mb-1">
                <MessageSquare className="w-3 h-3 text-amber-400" />
                A message for the couple (optional)
              </label>
              <textarea
                id="rsvp-guest-message"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Warm wishes, blessings, song requests..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            {/* Submit Button - Exactly like video "SEND RSVP" */}
            <button
              id="send-rsvp-submit-btn"
              type="submit"
              className="mt-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 font-cinzel font-bold text-xs tracking-widest uppercase shadow-xl hover:shadow-amber-400/40 transform active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              SEND RSVP
            </button>
          </form>
        )}
      </div>

      {/* Footer - Matching video "with love, Pulkit & Shreya" */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-xs font-script text-2xl text-amber-300 flex items-center justify-center gap-2">
          <span>with love,</span>
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>{config.groomName} &amp; {config.brideName}</span>
        </p>
      </div>
    </section>
  );
};
