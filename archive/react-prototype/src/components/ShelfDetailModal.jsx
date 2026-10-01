import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookStore } from '../store/useBookStore';
import { BookCard } from './BookCard';
import { X, Bookmark, Sparkles, Filter } from 'lucide-react';

export const ShelfDetailModal = () => {
  const { 
    selectedGenreId, 
    closeGenreModal, 
    genres, 
    books, 
    openBookModal, 
    userBookStates 
  } = useBookStore();

  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState(false);

  if (!selectedGenreId) return null;

  const genre = genres.find(g => g.id === selectedGenreId) || genres[0];
  const genreBooks = books.filter(b => b.genre === genre.id);

  const displayedBooks = filterBookmarkOnly
    ? genreBooks.filter(b => userBookStates[b.id]?.isBookmarked)
    : genreBooks;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        {/* Backdrop click closes modal to reveal librarian & library wall */}
        <div className="absolute inset-0" onClick={closeGenreModal} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl bg-[#1a120b]/90 border-2 border-[#d4a24c] rounded-xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[88vh] backdrop-blur-md"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#2b1d12]/90 border-b border-[#4a2f1c]">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-[#d4a24c]" />
              <div>
                <span className="font-gothic text-xs text-[#d4a24c] uppercase tracking-widest block">
                  SHELF CATALOGUE • {genre.shelfPositionId.toUpperCase()}
                </span>
                <h2 className="font-gothic text-2xl sm:text-3xl text-[#f0e6d2] leading-tight">
                  {genre.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Bookmark Filter Button */}
              <button
                onClick={() => setFilterBookmarkOnly(!filterBookmarkOnly)}
                className={`px-3 py-1.5 rounded border text-xs font-subheading flex items-center space-x-1.5 transition-all ${
                  filterBookmarkOnly
                    ? 'bg-[#ffb347] text-[#1a120b] border-[#ffcc70] font-bold shadow-[0_0_12px_rgba(255,179,71,0.6)]'
                    : 'bg-[#0d0805] text-[#e8dcc4] border-[#4a2f1c] hover:border-[#d4a24c]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">{filterBookmarkOnly ? "Bookmarked Only" : "Filter Bookmarked"}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={closeGenreModal}
                className="p-1.5 rounded-full bg-[#0d0805] text-[#e8dcc4]/70 hover:text-[#ffcc70] hover:bg-[#4a2f1c] border border-[#4a2f1c] transition-all"
                title="Return to Main Hall view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Genre Description Bar */}
          <div className="px-6 py-2.5 bg-[#0d0805]/80 border-b border-[#3d2817] text-xs font-subheading text-[#e8dcc4]/80 flex justify-between items-center">
            <span className="italic">{genre.description}</span>
            <span className="text-[#d4a24c] font-gothic shrink-0 ml-4">{genreBooks.length} Manuscripts</span>
          </div>

          {/* Books Grid */}
          <div className="p-6 overflow-y-auto flex-1">
            {displayedBooks.length === 0 ? (
              <div className="py-16 text-center text-[#e8dcc4]/60 font-subheading">
                <p className="text-xl italic">No bookmarked manuscripts found in this alcove.</p>
                <p className="text-xs text-[#d4a24c] mt-2">Toggle the bookmark filter to view all books in {genre.name}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {displayedBooks.map((book) => (
                  <BookCard key={book.id} book={book} onSelect={openBookModal} />
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 bg-[#0d0805]/90 border-t border-[#3d2817] text-center text-[11px] font-subheading text-[#e8dcc4]/60">
            <span>Verified published works via Google Books API • Tap any tome for details & external buy links</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
