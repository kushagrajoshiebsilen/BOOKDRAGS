import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, CheckCircle, Sparkles } from 'lucide-react';
import { useBookStore } from '../store/useBookStore';

export const SavedFoliosOverlay = ({ isOpen, onClose }) => {
  const { 
    books, 
    userBookStates, 
    openBookModal 
  } = useBookStore();

  if (!isOpen) return null;

  const bookmarkedIds = Object.keys(userBookStates).filter(id => userBookStates[id]?.isBookmarked);
  const bookmarkedBooks = books.filter(b => bookmarkedIds.includes(b.id));

  const finishedIds = Object.keys(userBookStates).filter(id => userBookStates[id]?.status === 'finished');
  const finishedBooks = books.filter(b => finishedIds.includes(b.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-10 w-full max-w-3xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 bg-black/40 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#ffcc70]" />
              <h2 className="font-gothic text-xl sm:text-2xl text-[#f0e6d2]">
                Saved & Bookmarked Archives
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 bg-black/40 text-[#e8dcc4] hover:text-[#ffcc70] hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Bookmarked Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3 pb-1 border-b border-white/10">
                <Bookmark className="w-4 h-4 text-[#ffb347] fill-current" />
                <h3 className="font-gothic text-sm text-[#ffcc70] uppercase tracking-wider">
                  Bookmarked Manuscripts ({bookmarkedBooks.length})
                </h3>
              </div>

              {bookmarkedBooks.length === 0 ? (
                <p className="text-xs text-[#e8dcc4]/60 font-subheading italic py-2">
                  No manuscripts bookmarked yet. Tap the ribbon icon on any tome to bookmark it.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookmarkedBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        onClose();
                        openBookModal(book.id);
                      }}
                      className="group cursor-pointer p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex items-center space-x-3 transition-all"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-gothic text-xs text-[#f0e6d2] group-hover:text-[#ffcc70] truncate">
                          {book.title}
                        </h4>
                        <p className="font-subheading text-[11px] text-[#d4a24c] italic truncate">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Finished Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3 pb-1 border-b border-white/10">
                <CheckCircle className="w-4 h-4 text-[#d4a24c]" />
                <h3 className="font-gothic text-xs text-[#d4a24c] uppercase tracking-wider">
                  Finished Folios Archive ({finishedBooks.length})
                </h3>
              </div>

              {finishedBooks.length === 0 ? (
                <p className="text-xs text-[#e8dcc4]/60 font-subheading italic py-2">
                  No completed manuscripts logged yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {finishedBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        onClose();
                        openBookModal(book.id);
                      }}
                      className="group cursor-pointer p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex items-center space-x-3 transition-all"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-gothic text-xs text-[#f0e6d2] group-hover:text-[#ffcc70] truncate">
                          {book.title}
                        </h4>
                        <p className="font-subheading text-[11px] text-[#d4a24c] italic truncate">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
