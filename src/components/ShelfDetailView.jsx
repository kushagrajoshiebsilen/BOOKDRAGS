import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookStore } from '../store/useBookStore';
import { BookCard } from './BookCard';
import { ArrowLeft, BookOpen, Search, Filter, Bookmark, Sparkles } from 'lucide-react';

export const ShelfDetailView = () => {
  const { 
    selectedGenreId, 
    genres, 
    books, 
    setScreen, 
    openBookModal, 
    setSearchOpen,
    userBookStates 
  } = useBookStore();

  const [filterBookmarkOnly, setFilterBookmarkOnly] = useState(false);

  const genre = genres.find(g => g.id === selectedGenreId) || genres[0];
  const genreBooks = books.filter(b => b.genre === genre.id);

  const displayedBooks = filterBookmarkOnly
    ? genreBooks.filter(b => userBookStates[b.id]?.isBookmarked)
    : genreBooks;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#0d0805]">
      {/* Background Image 3 (Angled Bookshelf Wall & Librarian Desk) */}
      <div className="fixed inset-0 z-0">
        <img
          src="/assets/shelf-angle.png"
          alt="Angled Bookshelf Alcove"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805] via-transparent to-[#0d0805]/95 pointer-events-none" />
      </div>

      {/* Header Nav */}
      <header className="relative z-20 w-full p-4 sm:p-6 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setScreen('main-library')}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c] bg-[#1a120b]/90 backdrop-blur-md text-[#d4a24c] hover:bg-[#4a2f1c] hover:text-[#ffcc70] transition-all shadow-lg font-gothic text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO MAIN HALL</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c]/60 bg-[#1a120b]/90 backdrop-blur-md text-[#f0e6d2] hover:bg-[#4a2f1c] transition-all shadow-lg font-subheading text-xs uppercase"
          >
            <Search className="w-4 h-4 text-[#d4a24c]" />
            <span className="hidden sm:inline">Search Library (/)</span>
          </button>

          <button
            onClick={() => setScreen('reading-room')}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c] bg-[#3d2817]/90 backdrop-blur-md text-[#ffcc70] hover:bg-[#6b4423] transition-all shadow-lg font-gothic text-xs"
          >
            <BookOpen className="w-4 h-4 text-[#d4a24c]" />
            <span className="hidden sm:inline">READING ROOM</span>
          </button>
        </div>
      </header>

      {/* Main Genre Banner & Book Grid */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col">
        {/* Genre Header Banner */}
        <div className="mb-8 p-6 bg-[#1a120b]/90 border-2 border-[#d4a24c] rounded-lg backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#d4a24c]" />
              <span className="font-gothic text-xs text-[#d4a24c] uppercase tracking-widest">
                Gothic Wing: {genre.shelfPositionId.toUpperCase()}
              </span>
            </div>
            <h2 className="font-gothic text-3xl sm:text-4xl text-[#f0e6d2]">
              {genre.name}
            </h2>
            <p className="font-subheading text-sm text-[#e8dcc4]/80 mt-1 italic max-w-2xl">
              {genre.description}
            </p>
          </div>

          {/* Bookmark Filter Toggle */}
          <button
            onClick={() => setFilterBookmarkOnly(!filterBookmarkOnly)}
            className={`px-4 py-2 rounded-lg border font-subheading text-xs flex items-center space-x-2 transition-all ${
              filterBookmarkOnly
                ? 'bg-[#ffb347] text-[#1a120b] border-[#ffcc70] font-bold shadow-[0_0_15px_rgba(255,179,71,0.6)]'
                : 'bg-[#2b1d12] text-[#e8dcc4] border-[#4a2f1c] hover:border-[#d4a24c]'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{filterBookmarkOnly ? "Showing Bookmarked Only" : "Filter Bookmarked"}</span>
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedBooks.map((book) => (
            <BookCard key={book.id} book={book} onSelect={openBookModal} />
          ))}
        </div>

        {displayedBooks.length === 0 && (
          <div className="py-16 text-center text-[#e8dcc4]/60 font-subheading">
            <p className="text-xl italic">No bookmarked manuscripts found in this alcove.</p>
            <p className="text-xs text-[#d4a24c] mt-2">Toggle the bookmark filter to view all books in {genre.name}.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full p-4 bg-[#0d0805]/95 border-t border-[#3d2817] text-center text-xs font-subheading text-[#e8dcc4]/60">
        <span>Inspecting {genre.name} • {genreBooks.length} Manuscripts cataloged</span>
      </footer>
    </div>
  );
};
