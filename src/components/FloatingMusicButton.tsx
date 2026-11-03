import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { weddingAudio } from '../utils/audioSynth';

interface FloatingMusicButtonProps {
  musicPreset?: 'shehnai' | 'flute' | 'sitar' | 'romantic';
}

export const FloatingMusicButton: React.FC<FloatingMusicButtonProps> = ({ musicPreset = 'shehnai' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const instrumentLabel =
    musicPreset === 'flute'
      ? 'Flute'
      : musicPreset === 'sitar'
      ? 'Sitar'
      : musicPreset === 'romantic'
      ? 'Melody'
      : 'Shehnai';

  const handleToggle = () => {
    const newState = weddingAudio.toggleMusic();
    setIsPlaying(newState);
    setShowHint(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
      {showHint && !isPlaying && (
        <span className="hidden sm:inline-block bg-neutral-900/80 backdrop-blur-sm text-amber-200 text-xs px-2.5 py-1 rounded-full font-cinzel animate-pulse shadow-md border border-amber-500/30">
          Tap for {instrumentLabel} Music 🎵
        </span>
      )}

      <button
        id="wedding-music-toggle-btn"
        onClick={handleToggle}
        aria-label="Toggle Wedding Music"
        type="button"
        className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border transition-all duration-300 ${
          isPlaying
            ? 'bg-amber-700 text-amber-100 border-amber-300 scale-105 shadow-amber-900/30'
            : 'bg-white/80 backdrop-blur-md text-neutral-800 border-neutral-300 hover:bg-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Music className="w-5 h-5 animate-spin-slow text-amber-200" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </>
        ) : (
          <VolumeX className="w-4 h-4 text-neutral-600" />
        )}
      </button>
    </div>
  );
};
