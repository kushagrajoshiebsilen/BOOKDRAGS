import React, { useState } from 'react';
import { useBookStore } from '../store/useBookStore';
import { ArrowLeft, Search } from 'lucide-react';
import { SavedFoliosOverlay } from './SavedFoliosOverlay';

export const ReadingRoom = () => {
  const { 
    setScreen, 
    setSearchOpen
  } = useBookStore();

  const [isSavedOverlayOpen, setIsSavedOverlayOpen] = useState(false);

  return (
    <div className="relative min-h-screen h-screen w-full overflow-hidden bg-[#0d0805] select-none flex flex-col justify-between">
      {/* Background Image: 4_inside_room.png (Full Bleed) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/4_inside_room.png"
          alt="Scholar Reading Room"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Header Nav (Corner Anchored, Ghost Style) */}
      <header className="relative z-20 w-full p-4 sm:p-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => setScreen('main-library')}
          className="px-4 py-2 rounded-md border border-white/10 bg-black/40 backdrop-blur-md text-[#d4a24c] hover:bg-white/10 transition-all font-gothic text-xs tracking-wider flex items-center space-x-2 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO MAIN LIBRARY</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded border border-white/10 bg-black/40 backdrop-blur-md text-[#d4a24c] hover:bg-white/10 transition-all font-subheading text-xs uppercase flex items-center space-x-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#d4a24c]" />
            <span className="hidden sm:inline">Search Archives</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 py-2">
        
        {/* Desk Hotspot: 100% Invisible Click Region directly over the study desk in 4_inside_room.png */}
        <div 
          onClick={() => setScreen('table-closeup')}
          className="absolute left-[20%] top-[48%] sm:left-[22%] sm:top-[50%] w-[48%] sm:w-[46%] h-[46%] sm:h-[44%] z-20 cursor-pointer group"
          title="Click study desk to approach table"
        >
          {/* Subtle brightness highlight on hover over desk artwork - NO FLOATING BOX */}
          <div className="w-full h-full rounded-2xl group-hover:bg-white/5 transition-all duration-300" />
        </div>

        {/* Pile of Books / Bookshelf Rack Hotspot: Invisible Click Region directly over the book pile on table pedestal and rack on the right */}
        <div
          onClick={() => setIsSavedOverlayOpen(true)}
          className="absolute right-[2%] top-[10%] w-[28%] sm:w-[26%] h-[82%] z-20 cursor-pointer group"
          title="Click pile of books or shelf rack to view bookmarked folios"
        >
          {/* Subtle brightness highlight on hover over book pile / shelf artwork */}
          <div className="w-full h-full rounded-2xl group-hover:bg-white/5 transition-all duration-300" />
        </div>
      </main>

      {/* Saved / Bookmarked Folios Overlay */}
      <SavedFoliosOverlay
        isOpen={isSavedOverlayOpen}
        onClose={() => setIsSavedOverlayOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="relative z-20 w-full py-2.5 px-4 bg-black/50 border-t border-white/10 text-center text-xs font-subheading text-[#e8dcc4]/60">
        <span>Click the desk to approach study table • Click book pile / shelf rack on right for saved folios</span>
      </footer>
    </div>
  );
};
