import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookStore } from '../store/useBookStore';
import { Search, Bookmark, BookOpen, ShieldAlert, Sparkles, Grid, Volume2, VolumeX, RotateCcw, MessageSquare, RefreshCw } from 'lucide-react';
import { ShelfDetailModal } from './ShelfDetailModal';

// Hotspot CSS Percentage Coordinates mapped directly onto Image 4 (shelf-wide.png)
const SHELF_HOTSPOTS = {
  'gothic-academia': { left: '5%', top: '14%', width: '20%', height: '35%' },
  'classics-philosophy': { left: '5%', top: '52%', width: '20%', height: '36%' },
  'mystery-occult': { left: '28%', top: '18%', width: '18%', height: '32%' },
  'fantasy-antiquity': { left: '28%', top: '54%', width: '18%', height: '34%' },
  'horror-cosmic': { left: '54%', top: '18%', width: '18%', height: '32%' },
  'historical-lore': { left: '54%', top: '54%', width: '18%', height: '34%' },
  'scifi-speculative': { left: '75%', top: '14%', width: '20%', height: '35%' },
  'poetry-romanticism': { left: '75%', top: '52%', width: '20%', height: '36%' }
};

const LIBRARIAN_WELCOMES = [
  "Welcome to the Gothic Archives, seeker. Touch any wing of the library to inspect its manuscripts.",
  "Ah, a visitor after dark. Select any shelf section to reveal the published works preserved within.",
  "Knowledge here is heavy as stone and deep as time. Speak your query or explore the quiet aisles."
];

export const MainLibrary = () => {
  const { 
    genres, 
    books, 
    userBookStates, 
    selectGenre, 
    setScreen, 
    setSearchOpen, 
    soundEnabled, 
    toggleSound,
    showHotspotGrid,
    toggleHotspotGrid,
    resetAllState 
  } = useBookStore();

  const [activeHoveredGenre, setActiveHoveredGenre] = useState(null);
  const [welcomeQuote, setWelcomeQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LIBRARIAN_WELCOMES.length);
    setWelcomeQuote(LIBRARIAN_WELCOMES[randomIndex]);
  }, []);

  const handleNextQuote = (e) => {
    e.stopPropagation();
    const nextIdx = (LIBRARIAN_WELCOMES.indexOf(welcomeQuote) + 1) % LIBRARIAN_WELCOMES.length;
    setWelcomeQuote(LIBRARIAN_WELCOMES[nextIdx]);
  };

  const bookmarkedCount = Object.values(userBookStates).filter(s => s.isBookmarked).length;
  const readingCount = Object.values(userBookStates).filter(s => s.status === 'reading').length;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0d0805]">
      {/* REAL BOOKSHELF BACKGROUND IMAGE (Image 4 - shelf-wide.png with Centered Librarian) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/shelf-wide.png"
          alt="Main Gothic Bookshelf Hall with Centered Librarian"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805] via-transparent to-[#0d0805]/85 pointer-events-none" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-30 w-full p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div 
            onClick={() => setScreen('door')}
            className="w-10 h-10 rounded-full border border-[#d4a24c]/60 bg-[#1a120b]/90 backdrop-blur-md flex items-center justify-center cursor-pointer hover:border-[#ffcc70] transition-colors shadow-lg"
            title="Return to Iron Doors"
          >
            <ShieldAlert className="w-5 h-5 text-[#d4a24c]" />
          </div>
          <div>
            <h1 className="font-gothic text-xl sm:text-2xl text-[#d4a24c] tracking-widest drop-shadow-md">BOOKHAVEN ARCHIVES</h1>
            <p className="font-subheading text-xs text-[#e8dcc4]/80 uppercase tracking-widest">Main Library Hall</p>
          </div>
        </div>

        {/* Action Controls Header Group */}
        <div className="flex items-center space-x-3">
          {/* Global Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c]/60 bg-[#1a120b]/90 backdrop-blur-md text-[#f0e6d2] hover:bg-[#4a2f1c] transition-all shadow-lg font-subheading text-xs uppercase"
          >
            <Search className="w-4 h-4 text-[#d4a24c]" />
            <span className="hidden sm:inline">Search (/)</span>
          </button>

          {/* Reading Room Button */}
          <button
            onClick={() => setScreen('reading-room')}
            className="relative flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c] bg-[#3d2817]/90 backdrop-blur-md text-[#ffcc70] hover:bg-[#6b4423] transition-all shadow-lg font-gothic text-xs"
          >
            <BookOpen className="w-4 h-4 text-[#d4a24c]" />
            <span>READING ROOM</span>
            {readingCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#ffb347] text-[#1a120b] font-bold text-[10px] flex items-center justify-center animate-pulse">
                {readingCount}
              </span>
            )}
          </button>

          {/* Saved Tomes Button */}
          <button
            onClick={() => setScreen('bookmarked-collection')}
            className="relative flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c]/60 bg-[#1a120b]/90 backdrop-blur-md text-[#f0e6d2] hover:bg-[#4a2f1c] transition-all shadow-lg font-gothic text-xs"
          >
            <Bookmark className="w-4 h-4 text-[#ffb347] fill-current" />
            <span className="hidden sm:inline">SAVED</span>
            {bookmarkedCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#ffb347] text-[#1a120b] font-bold text-[10px] flex items-center justify-center animate-pulse">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Hotspot Grid Debugger */}
          <button
            onClick={toggleHotspotGrid}
            className={`p-2 rounded-full border transition-all ${
              showHotspotGrid
                ? 'bg-[#d4a24c] text-[#1a120b] border-[#ffcc70]'
                : 'bg-[#1a120b]/90 text-[#d4a24c] border-[#d4a24c]/50 hover:bg-[#4a2f1c]'
            }`}
            title="Toggle Shelf Hotspot Grid Debugger"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full border border-[#d4a24c]/50 bg-[#1a120b]/90 backdrop-blur-md text-[#d4a24c] hover:bg-[#4a2f1c]"
            title={soundEnabled ? "Mute Library SFX" : "Enable Library SFX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ffcc70] animate-pulse" /> : <VolumeX className="w-4 h-4 text-[#e8dcc4]/50" />}
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 py-2 flex flex-col justify-between">
        
        {/* WELCOMING LIBRARIAN SPEECH BUBBLE ANCHORED ABOVE THE CENTERED LIBRARIAN FIGURE */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-30 self-center bg-[#1a120b]/75 border-2 border-[#d4a24c] p-3.5 sm:p-4 rounded-xl backdrop-blur-md max-w-lg shadow-[0_15px_40px_rgba(0,0,0,0.9)] text-center my-2 group"
        >
          <div className="flex items-center justify-between space-x-2 mb-1.5 border-b border-[#4a2f1c] pb-1">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#d4a24c]" />
              <span className="font-gothic text-xs text-[#d4a24c] uppercase tracking-widest">The Head Librarian Greets You:</span>
            </div>
            <button
              onClick={handleNextQuote}
              className="text-[#d4a24c] hover:text-[#ffcc70] p-0.5 rounded transition-colors"
              title="Next Dialogue"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <p className="font-subheading text-xs sm:text-sm text-[#f0e6d2] italic leading-snug">
            "{welcomeQuote}"
          </p>
        </motion.div>

        {/* Hotspots Container mapped onto Image 4 */}
        <div className="relative w-full h-[62vh] sm:h-[66vh] my-auto">
          {genres.map((genre) => {
            const coords = SHELF_HOTSPOTS[genre.id] || { left: '10%', top: '10%', width: '20%', height: '30%' };
            const genreBooks = books.filter(b => b.genre === genre.id);
            const bookmarkedInGenre = genreBooks.filter(b => userBookStates[b.id]?.isBookmarked).length;

            const isHovered = activeHoveredGenre === genre.id;

            return (
              <div
                key={genre.id}
                style={{
                  position: 'absolute',
                  left: coords.left,
                  top: coords.top,
                  width: coords.width,
                  height: coords.height
                }}
                onMouseEnter={() => setActiveHoveredGenre(genre.id)}
                onMouseLeave={() => setActiveHoveredGenre(null)}
                onClick={() => selectGenre(genre.id)}
                className={`cursor-pointer transition-all duration-300 rounded-lg ${
                  showHotspotGrid
                    ? 'border-2 border-dashed border-[#ffb347] bg-[#ffb347]/10'
                    : 'border border-transparent'
                }`}
              >
                <motion.div
                  className={`w-full h-full rounded-lg border-2 transition-all duration-300 flex flex-col justify-between p-3 ${
                    isHovered
                      ? 'border-[#ffcc70] bg-[#d4a24c]/20 shadow-[0_0_30px_rgba(255,204,112,0.5)] backdrop-blur-[2px]'
                      : 'border-transparent bg-transparent'
                  }`}
                  animate={{ scale: isHovered ? 1.02 : 1 }}
                >
                  {bookmarkedInGenre > 0 && (
                    <div className="self-end">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffb347] text-[#1a120b] shadow-[0_0_10px_#ffb347] flex items-center gap-1 animate-pulse">
                        <Bookmark className="w-3 h-3 fill-current" />
                        {bookmarkedInGenre}
                      </span>
                    </div>
                  )}

                  {showHotspotGrid && (
                    <span className="text-[10px] font-mono text-[#ffcc70] bg-black/80 px-1 rounded self-start">
                      {genre.name} ({coords.left}, {coords.top})
                    </span>
                  )}
                </motion.div>

                {/* Floating Tooltip Banner when hovering a shelf */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-40 -top-14 left-1/2 -translate-x-1/2 min-w-[220px] max-w-xs bg-[#1a120b]/95 border-2 border-[#d4a24c] p-3 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.95)] backdrop-blur-md pointer-events-none text-center"
                    >
                      <h4 className="font-gothic text-sm text-[#ffcc70] leading-tight mb-1">
                        {genre.name}
                      </h4>
                      <p className="text-[11px] text-[#e8dcc4]/80 font-subheading">
                        {genreBooks.length} Published Manuscripts • Click to Inspect
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* RENDER SHELF DETAIL MODAL OVER THE MAIN LIBRARY WALL (Librarian remains visible behind semi-transparent modal!) */}
      <ShelfDetailModal />

      {/* Footer */}
      <footer className="relative z-30 w-full p-4 bg-[#0d0805]/95 border-t border-[#3d2817] flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto text-xs font-subheading text-[#e8dcc4]/60">
        <div>
          <span>BookHaven Gothic Library • Published Manuscripts: {books.length} • Saved: {bookmarkedCount}</span>
        </div>
        <button
          onClick={resetAllState}
          className="flex items-center space-x-1 hover:text-[#d4a24c] transition-colors"
          title="Reset Saved Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Saved Data</span>
        </button>
      </footer>
    </div>
  );
};
