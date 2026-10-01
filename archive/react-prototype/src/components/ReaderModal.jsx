import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Bookmark, Volume2, VolumeX, Type, Feather, Sparkles } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';
import { playPageTurnSound, playQuillSound } from '../utils/audio';

export const ReaderModal = () => {
  const { 
    activeReaderBookId, 
    closeReader, 
    books, 
    userBookStates, 
    updateProgress, 
    toggleBookmark,
    soundEnabled 
  } = useBookStore();

  const [fontSize, setFontSize] = useState(18); // px
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');

  if (!activeReaderBookId) return null;

  const book = books.find(b => b.id === activeReaderBookId);
  if (!book) return null;

  const userState = userBookStates[book.id] || {
    progress: 10,
    isBookmarked: false
  };

  const handleNextPage = () => {
    const nextProg = Math.min(100, userState.progress + 15);
    updateProgress(book.id, nextProg);
    if (soundEnabled) playPageTurnSound();
  };

  const handlePrevPage = () => {
    const prevProg = Math.max(0, userState.progress - 15);
    updateProgress(book.id, prevProg);
    if (soundEnabled) playPageTurnSound();
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    updateProgress(book.id, val);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md">
        {/* Parchment Book Reader Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl h-[92vh] bg-[#f0e6d2] text-[#1a120b] border-8 border-[#3d2817] rounded-lg shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden"
        >
          {/* Ornate Gold Filigree Corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#d4a24c] pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#d4a24c] pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#d4a24c] pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#d4a24c] pointer-events-none" />

          {/* Reader Top Bar */}
          <header className="px-6 py-3 bg-[#2b1d12] text-[#e8dcc4] border-b border-[#4a2f1c] flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="font-gothic text-lg text-[#d4a24c] tracking-widest line-clamp-1">{book.title}</span>
              <span className="text-xs font-subheading text-[#e8dcc4]/60 hidden md:inline">by {book.author}</span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Font Size Adjuster */}
              <div className="flex items-center space-x-1 bg-[#1a120b] px-2 py-1 rounded border border-[#4a2f1c] text-xs">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))} 
                  className="px-1 hover:text-[#ffcc70]"
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <Type className="w-3.5 h-3.5 text-[#d4a24c]" />
                <button 
                  onClick={() => setFontSize(Math.min(26, fontSize + 2))} 
                  className="px-1 hover:text-[#ffcc70]"
                  title="Increase Font Size"
                >
                  A+
                </button>
              </div>

              {/* Bookmark Toggle */}
              <button
                onClick={() => toggleBookmark(book.id)}
                className={`p-1.5 rounded transition-all ${
                  userState.isBookmarked
                    ? 'text-[#ffb347] bg-[#4a2f1c]'
                    : 'text-[#e8dcc4]/60 hover:text-[#d4a24c]'
                }`}
                title="Bookmark Page"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              {/* Quill Notes Toggle */}
              <button
                onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                className={`p-1.5 rounded transition-all ${
                  showNotesDrawer ? 'text-[#ffcc70] bg-[#4a2f1c]' : 'text-[#e8dcc4]/60 hover:text-[#d4a24c]'
                }`}
                title="Quill Notes Drawer"
              >
                <Feather className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={closeReader}
                className="p-1 rounded text-[#e8dcc4]/60 hover:text-[#ffcc70] hover:bg-[#4a2f1c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Reader Parchment Page Area */}
          <div className="relative flex-1 p-6 md:p-12 overflow-y-auto bg-parchment-texture flex flex-col justify-between">
            {/* Center Book Page Spread */}
            <div className="max-w-3xl mx-auto w-full space-y-6 text-[#1a120b] font-body leading-relaxed select-text" style={{ fontSize: `${fontSize}px` }}>
              <div className="text-center pb-4 border-b border-[#d4a24c]/30">
                <span className="font-gothic text-xs text-[#6b4423] tracking-widest uppercase block mb-1">
                  Chapter {Math.ceil((userState.progress / 100) * 12) || 1}
                </span>
                <h3 className="font-gothic text-2xl text-[#3d2817]">
                  {book.title}
                </h3>
              </div>

              {/* Drop Cap Excerpt Paragraph */}
              <p className="first-letter:font-gothic first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#4a2f1c]">
                {book.sampleExcerpt || book.description}
              </p>

              <p className="text-[#2b1d12] opacity-90">
                Silence enveloped the vaulted library chamber. Outside, the autumn wind howled through ancient gargoyles, while inside, the flickering flame cast dancing shadows across rows of leather-bound folios. Every page turned echoed like a quiet confession in the hall of ages.
              </p>

              <p className="text-[#2b1d12] opacity-90">
                "To seek knowledge in this hall," whispered the archival records, "is to converse directly with minds long reduced to dust, yet whose passions burn as fiercely today as when the quill first touched parchment."
              </p>

              {/* Decorative Section Separator */}
              <div className="py-4 text-center font-gothic text-[#d4a24c]">
                ♦ ❦ ♦
              </div>
            </div>

            {/* Quill Notes Drawer Overlay */}
            {showNotesDrawer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 right-4 left-4 md:left-auto md:w-96 p-4 bg-[#1a120b] border-2 border-[#d4a24c] rounded-lg shadow-2xl text-[#f0e6d2] z-30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Feather className="w-4 h-4 text-[#d4a24c]" />
                    <span className="font-gothic text-xs text-[#d4a24c] tracking-widest uppercase">Scholar's Quill Ledger</span>
                  </div>
                  <button onClick={() => setShowNotesDrawer(false)} className="text-xs text-[#e8dcc4]/60 hover:text-white">Close</button>
                </div>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Record your gothic thoughts, quotes, or marginalia..."
                  className="w-full h-28 p-2 rounded bg-[#0d0805] border border-[#4a2f1c] text-xs font-body text-[#e8dcc4] focus:outline-none focus:border-[#d4a24c] resize-none"
                />
              </motion.div>
            )}
          </div>

          {/* Reader Footer Controls */}
          <footer className="px-6 py-3 bg-[#2b1d12] text-[#e8dcc4] border-t border-[#4a2f1c] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full md:w-auto justify-between">
              <button
                onClick={handlePrevPage}
                disabled={userState.progress <= 0}
                className="px-4 py-1.5 rounded bg-[#4a2f1c] hover:bg-[#6b4423] disabled:opacity-40 text-[#ffcc70] font-gothic text-xs flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV PAGE</span>
              </button>

              <span className="font-subheading text-xs text-[#d4a24c]">
                Progress: {userState.progress}%
              </span>

              <button
                onClick={handleNextPage}
                disabled={userState.progress >= 100}
                className="px-4 py-1.5 rounded bg-[#4a2f1c] hover:bg-[#6b4423] disabled:opacity-40 text-[#ffcc70] font-gothic text-xs flex items-center space-x-1"
              >
                <span>NEXT PAGE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="w-full md:w-64 flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="100"
                value={userState.progress}
                onChange={handleSliderChange}
                className="w-full accent-[#d4a24c] cursor-pointer"
              />
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
