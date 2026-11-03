import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { GalleryPhoto, InvitationConfig } from '../types';
import { isKeralaTheme, isMuslimTheme } from '../data/weddingPresets';

interface SceneGallery3DProps {
  photos: GalleryPhoto[];
  config?: InvitationConfig;
}

export const SceneGallery3D: React.FC<SceneGallery3DProps> = ({ photos, config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isKerala = config ? isKeralaTheme(config) : false;
  const isMuslim = config ? isMuslimTheme(config) : false;

  const activePhotos = config?.galleryPhotos && config.galleryPhotos.length > 0 ? config.galleryPhotos : photos;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePhotos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activePhotos.length) % activePhotos.length);
  };

  const currentPhoto = activePhotos[currentIndex] || activePhotos[0];

  return (
    <section
      className="relative w-full min-h-[640px] h-full flex flex-col items-center justify-between p-6 overflow-hidden select-none text-neutral-800"
      style={{
        backgroundColor: isMuslim ? '#051E14' : isKerala ? '#F6F8F5' : '#FAF6F0',
      }}
    >
      {/* Background motif */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: isMuslim
            ? `radial-gradient(#F59E0B 1px, transparent 1px)`
            : isKerala
            ? `radial-gradient(#064E3B 1px, transparent 1px)`
            : `radial-gradient(#997300 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 text-center pt-2">
        <div
          className="flex items-center justify-center gap-1.5 text-xs font-cinzel tracking-widest uppercase mb-1"
          style={{ color: isMuslim ? '#FBBF24' : isKerala ? '#064E3B' : '#92400E' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: isMuslim ? '#F59E0B' : isKerala ? '#059669' : '#D97706' }} />
          <span>{isMuslim ? '3D NIKAH & WALIMA CHRONICLES' : config?.theme?.badge || (isKerala ? 'KERALA VIVAHA CHRONICLES' : 'IN FRAME')}</span>
          <Sparkles className="w-3.5 h-3.5" style={{ color: isMuslim ? '#F59E0B' : isKerala ? '#059669' : '#D97706' }} />
        </div>
        <h2
          className="text-3xl sm:text-4xl font-script tracking-wide"
          style={{ color: isMuslim ? '#FFFDF7' : isKerala ? '#0C2518' : '#262626' }}
        >
          {isMuslim ? 'Sacred Nikah & Mehndi Gallery' : isKerala ? 'Sacred Vivaha Gallery' : 'Our gallery'}
        </h2>
        <p
          className="text-xs font-body mt-0.5"
          style={{ color: isMuslim ? '#A7F3D0' : '#737373' }}
        >
          {isMuslim
            ? '3D Pixar-style visuals of Nikah Sanctuary, Mehndi Palace, Nikahnama & Aarsi Mushaf'
            : config?.theme?.subtitle || (isKerala ? '3D Kasavu & temple moments woven in gold and jasmine' : 'Captured memories woven through time')}
        </p>
      </div>

      {/* Center 3D Stacked Card Deck */}
      <div className="relative z-10 w-full max-w-xs aspect-[4/5] my-auto perspective-1000 flex items-center justify-center">
        {/* Background ghost tilt cards for authentic 3D depth */}
        <div
          className="absolute w-[92%] h-[92%] rounded-2xl shadow-md -rotate-6 border"
          style={{
            backgroundColor: isMuslim ? '#062D1F' : '#FEF3C7',
            borderColor: isMuslim ? '#059669' : '#FDE68A',
          }}
        />
        <div
          className="absolute w-[95%] h-[95%] rounded-2xl shadow-lg rotate-3 border"
          style={{
            backgroundColor: isMuslim ? '#093626' : '#FFFBEB',
            borderColor: isMuslim ? '#F59E0B' : '#FDE68A',
          }}
        />

        {/* Active Animated 3D Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotateY: 25, y: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -25, y: -15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative w-full h-full p-3.5 rounded-2xl shadow-[0_15px_35px_rgba(212,175,55,0.3)] border-2 flex flex-col justify-between group"
            style={{
              backgroundColor: isMuslim ? '#0D3828' : '#FFFFFF',
              borderColor: config?.theme?.borderGold || '#FBBF24',
            }}
          >
            {/* Sparkle Glint on Card Frame */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-300 animate-sparkle" />

            {/* Image Container with glossy polaroid finish */}
            <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-neutral-900 shadow-inner group">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                className="w-full h-full object-cover brightness-[1.03] contrast-[1.06] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-amber-200 font-cinzel font-semibold flex items-center gap-1 shadow-sm">
                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                {currentIndex + 1} / {activePhotos.length}
              </div>
            </div>

            {/* Polaroid Bottom Caption */}
            <div className="pt-3 pb-1 text-center">
              <p
                className="font-classic text-sm font-bold italic"
                style={{ color: isMuslim ? '#FFFDF7' : '#171717' }}
              >
                &ldquo;{currentPhoto.caption}&rdquo;
              </p>
              {currentPhoto.date && (
                <p
                  className="text-[10px] font-cinzel tracking-widest uppercase font-semibold mt-0.5"
                  style={{ color: isMuslim ? '#FBBF24' : '#92400E' }}
                >
                  {currentPhoto.date}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls & Pagination */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-4">
        <div className="flex items-center gap-4">
          <button
            id="gallery-prev-button"
            onClick={handlePrev}
            aria-label="Previous photo"
            type="button"
            className="w-9 h-9 rounded-full border border-amber-300 shadow-md flex items-center justify-center transition-transform active:scale-95"
            style={{
              backgroundColor: isMuslim ? '#062D1F' : '#FFFFFF',
              color: isMuslim ? '#FBBF24' : '#374151',
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {activePhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-500'
                    : isMuslim
                    ? 'w-2 bg-emerald-800 hover:bg-emerald-700'
                    : 'w-2 bg-amber-200 hover:bg-amber-300'
                }`}
              />
            ))}
          </div>

          <button
            id="gallery-next-button"
            onClick={handleNext}
            aria-label="Next photo"
            type="button"
            className="w-9 h-9 rounded-full border border-amber-300 shadow-md flex items-center justify-center transition-transform active:scale-95"
            style={{
              backgroundColor: isMuslim ? '#062D1F' : '#FFFFFF',
              color: isMuslim ? '#FBBF24' : '#374151',
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p
          className="text-[11px] font-cinzel tracking-widest uppercase"
          style={{ color: isMuslim ? '#6EE7B7' : '#A3A3A3' }}
        >
          &gt; SWIPE THROUGH &lt;
        </p>
      </div>
    </section>
  );
};
