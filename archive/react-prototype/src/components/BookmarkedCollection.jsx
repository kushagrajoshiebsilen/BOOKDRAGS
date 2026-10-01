import React from 'react';
import { motion } from 'framer-motion';
import { useBookStore } from '../store/useBookStore';
import { BookCard } from './BookCard';
import { ArrowLeft, Bookmark, Sparkles, ExternalLink } from 'lucide-react';

export const BookmarkedCollection = () => {
  const { 
    books, 
    userBookStates, 
    setScreen, 
    openBookModal 
  } = useBookStore();

  const bookmarkedIds = Object.keys(userBookStates).filter(id => userBookStates[id]?.isBookmarked);
  const bookmarkedBooks = books.filter(b => bookmarkedIds.includes(b.id));

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#0d0805]">
      {/* Background Image 3 (Angled Bookshelf & Desk) */}
      <div className="fixed inset-0 z-0">
        <img
          src="/assets/shelf-angle.png"
          alt="Curator Desk Shelf"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805] via-transparent to-[#0d0805]/95 pointer-events-none" />
      </div>

      {/* Header Nav */}
      <header className="relative z-20 w-full p-4 sm:p-6 max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => setScreen('main-library')}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#d4a24c] bg-[#1a120b]/90 backdrop-blur-md text-[#d4a24c] hover:bg-[#4a2f1c] hover:text-[#ffcc70] transition-all shadow-lg font-gothic text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO MAIN LIBRARY</span>
        </button>

        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-[#ffb347] fill-current" />
          <h1 className="font-gothic text-lg sm:text-xl text-[#d4a24c] tracking-widest">SAVED GOTHIC COLLECTION</h1>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col">
        {/* Banner */}
        <div className="mb-8 p-6 bg-[#1a120b]/90 border-2 border-[#d4a24c] rounded-lg backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#d4a24c]" />
            <span className="font-gothic text-xs text-[#d4a24c] uppercase tracking-widest">
              Scholar's Personal Ledger
            </span>
          </div>
          <h2 className="font-gothic text-3xl text-[#f0e6d2]">
            Bookmarked Manuscripts ({bookmarkedBooks.length})
          </h2>
          <p className="font-subheading text-sm text-[#e8dcc4]/80 mt-1 italic">
            Your saved collection of dark academia, classics, and cosmic lore manuscripts.
          </p>
        </div>

        {/* Books Grid */}
        {bookmarkedBooks.length === 0 ? (
          <div className="py-20 text-center text-[#e8dcc4]/60 font-subheading">
            <Bookmark className="w-12 h-12 text-[#d4a24c]/40 mx-auto mb-3" />
            <p className="text-xl italic">No manuscripts currently saved to your collection.</p>
            <p className="text-xs text-[#d4a24c] mt-2">Inspect any genre shelf and tap the ribbon icon to bookmark books.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarkedBooks.map((book) => (
              <BookCard key={book.id} book={book} onSelect={openBookModal} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full p-4 bg-[#0d0805]/95 border-t border-[#3d2817] text-center text-xs font-subheading text-[#e8dcc4]/60">
        <span>Saved Gothic Manuscripts • {bookmarkedBooks.length} Total</span>
      </footer>
    </div>
  );
};
