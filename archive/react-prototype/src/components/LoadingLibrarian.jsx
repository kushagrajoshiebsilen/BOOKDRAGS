import React from 'react';
import { BookOpen } from 'lucide-react';

export const LoadingLibrarian = ({ text = "The librarian searches the shelves…" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#d4a24c] border-t-transparent animate-spin flex items-center justify-center shadow-[0_0_15px_rgba(212,162,76,0.3)]">
          <BookOpen className="w-8 h-8 text-[#d4a24c] animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-[#d4a24c]/10 rounded-full filter blur-md -z-10 animate-candle-flicker" />
      </div>
      <p className="font-gothic text-xl text-[#d4a24c] tracking-widest uppercase mb-2">{text}</p>
      <p className="font-subheading text-[#e8dcc4]/70 text-sm italic">Flipping through dusty ledgers in the dark...</p>
    </div>
  );
};
