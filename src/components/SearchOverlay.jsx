import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Bookmark, Filter, Sparkles } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';

export const SearchOverlay = () => {
  const { 
    isSearchOpen, 
    setSearchOpen, 
    books, 
    genres, 
    userBookStates, 
    openBookModal 
  } = useBookStore();

  const [query, setQuery] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');
  const [bookmarkOnlyFilter, setBookmarkOnlyFilter] = useState(false);

  // Global hotkey '/' to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter books logic
  const filteredBooks = books.filter(book => {
    const matchesQuery = 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.description.toLowerCase().includes(query.toLowerCase());

    const matchesGenre = selectedGenreFilter === 'all' || book.genre === selectedGenreFilter;

    const userState = userBookStates[book.id];
    const matchesBookmark = !bookmarkOnlyFilter || (userState && userState.isBookmarked);

    return matchesQuery && matchesGenre && matchesBookmark;
  });

  const handleSelectBook = (bookId) => {
    setSearchOpen(false);
    openBookModal(bookId);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative z-10 w-full max-w-4xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[82vh]"
        >
          {/* Search Input Header */}
          <div className="p-4 sm:p-5 bg-black/40 border-b border-white/10 flex items-center space-x-3">
            <Search className="w-6 h-6 text-[#ffcc70] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search library by title, author, or keywords..."
              className="w-full bg-transparent text-[#f0e6d2] placeholder-[#e8dcc4]/50 font-subheading text-lg focus:outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1.5 rounded-full text-[#e8dcc4]/60 hover:text-[#ffcc70] hover:bg-white/10 cursor-pointer transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-3 bg-black/30 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-subheading">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-[#ffcc70]" />
              <span className="text-[#ffcc70] uppercase tracking-wider">Genre:</span>
              <select
                value={selectedGenreFilter}
                onChange={(e) => setSelectedGenreFilter(e.target.value)}
                className="bg-black/60 text-[#e8dcc4] border border-white/10 rounded px-2.5 py-1 focus:outline-none focus:border-white/30"
              >
                <option value="all">All Library Shelves</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setBookmarkOnlyFilter(!bookmarkOnlyFilter)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all cursor-pointer ${
                bookmarkOnlyFilter
                  ? 'bg-[#ffb347] text-[#1a120b] border-transparent font-bold shadow-[0_0_10px_#ffb347]'
                  : 'bg-black/40 text-[#e8dcc4]/80 border-white/10 hover:bg-white/10'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Bookmarked Only</span>
            </button>
          </div>

          {/* Search Results List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            {filteredBooks.length === 0 ? (
              <div className="py-12 text-center text-[#e8dcc4]/60 font-subheading">
                <Sparkles className="w-8 h-8 text-[#ffcc70]/40 mx-auto mb-2" />
                <p className="text-lg italic">No published manuscripts matched your query.</p>
                <p className="text-xs mt-1 text-[#ffcc70]/70">Try searching for "Frankenstein", "Dracula", or "Lovecraft".</p>
              </div>
            ) : (
              filteredBooks.map((book) => {
                const uState = userBookStates[book.id];
                const isBookmarked = uState?.isBookmarked;

                return (
                  <div
                    key={book.id}
                    onClick={() => handleSelectBook(book.id)}
                    className={`group cursor-pointer p-3.5 rounded-xl bg-black/40 border transition-all flex items-center justify-between space-x-4 ${
                      isBookmarked 
                        ? 'border-[#ffcc70]/60 shadow-[0_0_15px_rgba(255,204,112,0.3)] animate-pulse'
                        : 'border-white/10 hover:border-white/20 hover:bg-black/60'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-gothic text-base text-[#f0e6d2] group-hover:text-[#ffcc70] truncate">
                          {book.title}
                        </h4>
                        <p className="font-subheading text-xs text-[#d4a24c] italic">
                          by {book.author}
                        </p>
                        <p className="text-xs text-[#e8dcc4]/60 line-clamp-1 mt-0.5 font-body">
                          {book.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      {isBookmarked && (
                        <Bookmark className="w-4 h-4 text-[#ffb347] fill-current" />
                      )}
                      <span className="font-gothic text-xs text-[#ffcc70] uppercase tracking-wider hidden sm:inline">
                        View Tome →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
