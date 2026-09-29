import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, ExternalLink, Sparkles, ShoppingBag, BookOpen, CheckCircle } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';

export const BookModal = () => {
  const { 
    selectedBookId, 
    closeBookModal, 
    books, 
    userBookStates, 
    toggleBookmark,
    startReading,
    markFinished
  } = useBookStore();

  if (!selectedBookId) return null;

  const book = books.find(b => b.id === selectedBookId);
  if (!book) return null;

  const userState = userBookStates[book.id] || {
    status: 'unread',
    isBookmarked: false
  };

  const externalUrl = book.externalUrl || `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(book.title + " " + book.author)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="absolute inset-0" onClick={closeBookModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-10 w-full max-w-3xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#ffcc70]" />
              <span className="font-gothic text-xs text-[#ffcc70] tracking-widest uppercase">GOTHIC ARCHIVE RECORD</span>
            </div>
            <button
              onClick={closeBookModal}
              className="p-1 rounded-full text-[#e8dcc4]/60 hover:text-[#ffcc70] hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-h-[78vh] overflow-y-auto">
            {/* Cover Column */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {userState.isBookmarked && (
                  <div className="absolute top-2 right-2 text-[#ffcc70]">
                    <Bookmark className="w-6 h-6 fill-current animate-pulse" />
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4 w-full text-center">
                <span className={`inline-block px-3 py-1 rounded text-xs font-subheading uppercase tracking-wider border ${
                  userState.status === 'reading' 
                    ? 'bg-[#ffb347]/20 border-[#ffb347]/40 text-[#ffcc70]'
                    : userState.status === 'finished'
                    ? 'bg-[#d4a24c]/20 border-[#d4a24c]/40 text-[#d4a24c]'
                    : 'bg-white/5 border-white/10 text-[#e8dcc4]/70'
                }`}>
                  Status: {userState.status}
                </span>
              </div>
            </div>

            {/* Information & Action Column */}
            <div className="md:col-span-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <h2 className="font-gothic text-2xl md:text-3xl text-[#f0e6d2] leading-tight mb-1">
                  {book.title}
                </h2>
                <p className="font-subheading text-lg text-[#d4a24c] italic mb-4">
                  by {book.author}
                </p>

                <p className="text-sm text-[#e8dcc4] leading-relaxed font-body mb-6">
                  {book.description}
                </p>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-subheading text-[#e8dcc4]/80 mb-6">
                  <div><span className="text-[#ffcc70]">Genre:</span> {book.genre.replace('-', ' ')}</div>
                  <div><span className="text-[#ffcc70]">Length:</span> {book.pageCount || 300} Pages</div>
                  <div><span className="text-[#ffcc70]">Publisher:</span> {book.publisher || "Google Books"}</div>
                  <div><span className="text-[#ffcc70]">Rating:</span> ⭐ {book.rating || 4.8} / 5.0</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                {userState.status !== 'reading' && (
                  <button
                    onClick={() => startReading(book.id)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#ffcc70] border border-white/10 rounded-lg font-gothic text-xs tracking-wider flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#ffcc70]" />
                    <span>MARK CURRENTLY READING</span>
                  </button>
                )}

                {userState.status !== 'finished' && (
                  <button
                    onClick={() => markFinished(book.id)}
                    className="px-4 py-2.5 bg-black/40 hover:bg-white/10 text-[#e8dcc4] border border-white/10 rounded-lg font-subheading text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-[#ffcc70]" />
                    <span>MARK FINISHED</span>
                  </button>
                )}

                {/* Bookmark Toggle Button */}
                <button
                  onClick={() => toggleBookmark(book.id)}
                  className={`px-4 py-2.5 rounded-lg border font-subheading text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                    userState.isBookmarked
                      ? 'bg-[#ffb347] text-[#1a120b] border-transparent font-bold shadow-[0_0_15px_rgba(255,179,71,0.5)]'
                      : 'bg-black/40 text-[#e8dcc4] border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>{userState.isBookmarked ? "BOOKMARKED" : "BOOKMARK"}</span>
                </button>

                {/* External Link: Find / Buy Book */}
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[160px] px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#ffcc70] border border-white/10 rounded-lg font-gothic tracking-wider text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#ffcc70]" />
                  <span>FIND THIS BOOK</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#ffcc70]" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
