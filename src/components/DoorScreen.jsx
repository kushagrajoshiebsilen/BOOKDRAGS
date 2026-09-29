import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBookStore } from '../store/useBookStore';

const GUARD_QUOTES = [
  "Speak the title you seek, traveler... or wander silently through the ancient aisles.",
  "Knowledge here is heavy as iron. Step forward if you possess the courage to turn the key.",
  "Few step past these iron doors after twilight. Step carefully, for forgotten voices echo within."
];

export const DoorScreen = () => {
  const { setScreen } = useBookStore();
  const [currentQuote, setCurrentQuote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * GUARD_QUOTES.length);
    setCurrentQuote(GUARD_QUOTES[randomIndex]);
  }, []);

  const handleDoorClick = () => {
    if (isPlaying) return;
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => {
        console.warn("Video play error:", err);
      });
    }
  };

  const handleVideoEnded = () => {
    setScreen('main-library');
  };

  return (
    <div 
      onClick={handleDoorClick}
      className="relative min-h-screen h-screen w-full overflow-hidden bg-[#0d0805] cursor-pointer select-none"
    >
      {/* Full Bleed Door Video - Replaces 1_front_door.png and 2_front_door_open.png */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          src="/assets/front_door_video.mp4"
          preload="auto"
          playsInline
          muted
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Screen Elements: Borderless, Cinematic & Clean */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        
        {/* Gatekeeper Dialogue Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: isPlaying ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-[20%] sm:bottom-[23%] left-[4%] sm:left-[8%] md:left-[11%] w-[270px] sm:w-[310px] bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl"
        >
          <span className="font-gothic text-[11px] text-[#ffcc70] tracking-widest uppercase block mb-1">
            THE GATEKEEPER
          </span>

          <p className="font-subheading text-xs sm:text-sm text-[#f0e6d2] italic leading-relaxed drop-shadow">
            "{currentQuote}"
          </p>
        </motion.div>

        {/* Action Prompt Button */}
        <motion.div 
          animate={{ opacity: isPlaying ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center"
        >
          <button 
            onClick={handleDoorClick}
            className="px-8 py-3 bg-black/40 hover:bg-black/60 text-[#f0e6d2] hover:text-[#ffcc70] rounded-lg backdrop-blur-md font-gothic tracking-[0.2em] text-sm sm:text-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/10"
          >
            {isPlaying ? "UNSEALING THE DOORS..." : "PUSH OPEN THE IRON DOORS"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
