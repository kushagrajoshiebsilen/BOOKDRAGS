import React from 'react';
import { useBookStore } from '../store/useBookStore';
import { ArrowLeft } from 'lucide-react';

export const TableTopView = () => {
  const { 
    books, 
    userBookStates, 
    setScreen, 
    openBookModal 
  } = useBookStore();

  // Active reading book
  const readingBookIds = Object.keys(userBookStates).filter(id => userBookStates[id]?.status === 'reading');
  const readingBooks = books.filter(b => readingBookIds.includes(b.id));
  const activeBook = readingBooks[0] || books[0];

  return (
    <div className="relative min-h-screen h-screen w-full overflow-hidden bg-[#0d0805] select-none flex flex-col justify-between">
      {/* Background Image: 5_room_inside_table_top.png (Full Bleed) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/5_room_inside_table_top.png"
          alt="Desk Table Top Close-Up"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Header Navigation with 'Back to Reading Room' button */}
      <header className="relative z-20 w-full p-4 sm:p-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => setScreen('reading-room')}
          className="px-4 py-2 rounded-md border border-white/10 bg-black/40 backdrop-blur-md text-[#d4a24c] hover:bg-white/10 transition-all font-gothic text-xs tracking-wider flex items-center space-x-2 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO READING ROOM</span>
        </button>
      </header>

      {/* Main Stage: 100% Invisible Click Area directly over the open book on the table photo */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        
        {/* Invisible Click Region aligned over the open antique book lying on the desk - NO FLOATING BOX */}
        <div 
          onClick={() => openBookModal(activeBook.id)}
          className="absolute left-[18%] top-[18%] sm:left-[22%] sm:top-[20%] w-[64%] sm:w-[56%] h-[68%] sm:h-[64%] z-20 cursor-pointer group"
          title="Click the open book to inspect tome details"
        >
          {/* Subtle brightness boost on hover over open book artwork - NO FLOATING CARD OR TEXT BOX */}
          <div className="w-full h-full rounded-3xl group-hover:bg-white/5 transition-all duration-300" />
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-20 w-full py-2.5 px-4 bg-black/50 border-t border-white/10 text-center text-xs font-subheading text-[#e8dcc4]/60">
        <span>Click the open book on the table to view tome details</span>
      </footer>
    </div>
  );
};
