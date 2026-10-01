import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ExternalLink, Sparkles } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';

export const BookCard = ({ book, onSelect }) => {
  const { userBookStates, toggleBookmark } = useBookStore();
  
  const userState = userBookStates[book.id] || {
    isBookmarked: false
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    toggleBookmark(book.id);
  };

  return (
    <motion.div
      onClick={() => onSelect(book.id)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative group cursor-pointer rounded-lg bg-[#1a120b] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.8)] ${
        userState.isBookmarked
          ? 'border-[#ffb347] animate-bookmark-pulse'
          : 'border-[#4a2f1c] hover:border-[#d4a24c]'
      }`}
    >
      {/* Top Right Bookmark Toggle */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={handleBookmarkClick}
          className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${
            userState.isBookmarked
              ? 'bg-[#ffb347] text-[#1a120b] border-[#ffcc70] shadow-[0_0_12px_rgba(255,179,71,0.8)]'
              : 'bg-[#0d0805]/70 text-[#e8dcc4]/60 border-[#4a2f1c] hover:text-[#d4a24c]'
          }`}
          title={userState.isBookmarked ? "Remove Bookmark" : "Bookmark this Tome"}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Book Cover Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-[#0d0805] border-b border-[#3d2817]">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] via-transparent to-black/30" />

        {/* Left Book Spine Gold Detail */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-[#3d2817] via-[#6b4423] to-[#1a120b] border-r border-[#d4a24c]/40" />

        {/* Pulsing Bookmark Ribbon Overlay */}
        {userState.isBookmarked && (
          <div className="absolute left-4 top-0 w-3 h-12 bg-gradient-to-b from-[#ffb347] to-[#d4a24c] shadow-[0_0_10px_#ffb347] clip-path-ribbon" />
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-[#1a120b]">
        <div>
          <h3 className="font-gothic text-base text-[#f0e6d2] group-hover:text-[#ffcc70] line-clamp-2 leading-tight transition-colors mb-1">
            {book.title}
          </h3>
          <p className="font-subheading text-xs text-[#d4a24c] italic mb-2">
            by {book.author}
          </p>
          <p className="text-xs text-[#e8dcc4]/70 line-clamp-2 leading-relaxed mb-3 font-body">
            {book.description}
          </p>
        </div>

        {/* Footer Link Preview */}
        <div className="pt-2 border-t border-[#3d2817] flex items-center justify-between text-[11px] text-[#e8dcc4]/60 font-subheading">
          <span>{book.publishedYear ? book.publishedYear : "Classic"}</span>
          <span className="flex items-center gap-1 text-[#d4a24c] group-hover:text-[#ffcc70]">
            <span>Inspect Tome</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};
