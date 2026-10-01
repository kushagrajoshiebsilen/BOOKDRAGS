import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Sparkles, Loader2 } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';

export const GenreListOverlay = () => {
  const { 
    selectedGenreId, 
    closeGenreOverlay, 
    genres, 
    books, 
    userBookStates, 
    openBookModal,
    fetchGenreLiveBooks,
    isFetchingApi 
  } = useBookStore();

  useEffect(() => {
    if (selectedGenreId) {
      fetchGenreLiveBooks(selectedGenreId);
    }
  }, [selectedGenreId, fetchGenreLiveBooks]);

  if (!selectedGenreId) return null;

  const genre = genres.find(g => g.id === selectedGenreId) || { name: 'Gothic Archive', description: 'Real published tomes' };
  const genreBooks = books.filter(b => b.genre === selectedGenreId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
        <div className="absolute inset-0" onClick={closeGenreOverlay} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-10 w-full max-w-4xl bg-black/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 bg-black/40 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#ffcc70]" />
                <span className="font-gothic text-xs text-[#ffcc70] tracking-widest uppercase">SHELF CATALOGUE</span>
              </div>
              <h2 className="font-gothic text-2xl sm:text-3xl text-[#f0e6d2]">
                {genre.name}
              </h2>
            </div>

            <button
              onClick={closeGenreOverlay}
              className="p-2 rounded-full border border-white/10 bg-black/40 text-[#e8dcc4] hover:text-[#ffcc70] hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader info */}
          <div className="px-6 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs font-subheading text-[#e8dcc4]/80">
            <span className="italic">{genre.description}</span>
            {isFetchingApi && (
              <span className="flex items-center space-x-1.5 text-[#ffcc70]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching live Google Books API...</span>
              </span>
            )}
          </div>

          {/* Real Books Grid */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 flex-1">
            {genreBooks.map((book) => {
              const uState = userBookStates[book.id];
              const isBookmarked = uState?.isBookmarked;

              return (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -4 }}
                  onClick={() => openBookModal(book.id)}
                  className={`group cursor-pointer p-3.5 rounded-xl bg-black/40 border transition-all duration-300 flex flex-col justify-between ${
                    isBookmarked
                      ? 'border-[#ffcc70]/60 shadow-[0_0_20px_rgba(255,204,112,0.3)] animate-pulse'
                      : 'border-white/10 hover:border-white/20 hover:bg-black/60'
                  }`}
                >
                  <div className="flex space-x-3.5">
                    <div className="relative w-16 h-24 shrink-0 rounded overflow-hidden border border-white/10 shadow-md">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isBookmarked && (
                        <div className="absolute top-0 right-1 text-[#ffcc70]">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-gothic text-sm text-[#f0e6d2] group-hover:text-[#ffcc70] line-clamp-2 leading-tight">
                          {book.title}
                        </h4>
                        <p className="font-subheading text-xs text-[#d4a24c] italic mt-1 truncate">
                          {book.author}
                        </p>
                      </div>

                      <span className="text-[10px] font-subheading text-[#e8dcc4]/60 uppercase tracking-widest mt-2 block">
                        Tap for Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="p-3 bg-black/60 border-t border-white/10 text-center text-xs font-subheading text-[#e8dcc4]/60">
            <span>Verified published works via Google Books API</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
