import { create } from 'zustand';
import { playQuillSound, playDoorOpenSound, toggleAmbientLibrarySound } from '../utils/audio';
import booksData from '../data/books.json';
import genresData from '../data/genres.json';

const LOCAL_STORAGE_KEY = 'bookhaven_user_state_v4';

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse saved state from localStorage", e);
  }
  return {
    "gb-frankenstein": { status: "reading", isBookmarked: true, savedAt: Date.now() },
    "gb-dracula": { status: "reading", isBookmarked: true, savedAt: Date.now() },
    "gb-picture-dorian-gray": { status: "finished", isBookmarked: true, savedAt: Date.now() }
  };
};

const saveStateToStorage = (userStates) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userStates));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
};

export const useBookStore = create((set, get) => ({
  // Seed Data
  books: booksData,
  genres: genresData,

  // User State
  userBookStates: loadSavedState(),

  // Navigation & UI State
  activeScreen: 'door', // 'door' | 'main-library' | 'reading-room' | 'bookmarked-collection'
  selectedGenreId: null, // When non-null, opens Shelf Catalogue Modal OVER the main library!
  selectedBookId: null,  // When non-null, opens Book Detail Modal
  isSearchOpen: false,
  soundEnabled: false,
  showHotspotGrid: false,

  // Door Animation State
  isDoorOpening: false,

  // Navigation Actions
  setScreen: (screen) => set({ activeScreen: screen }),

  fetchCatalog: async () => {
    try {
      const gRes = await fetch('/api/genres');
      if (gRes.ok) {
        const fetchedGenres = await gRes.json();
        set({ genres: fetchedGenres });
      }
      const bRes = await fetch('/api/books');
      if (bRes.ok) {
        const fetchedBooks = await bRes.json();
        set({ books: fetchedBooks });
      }
    } catch (e) {
      console.warn("Using default local data", e);
    }
  },

  enterLibrary: () => {
    set({ isDoorOpening: true });
    if (get().soundEnabled) playDoorOpenSound();
    setTimeout(() => {
      set({ activeScreen: 'main-library', isDoorOpening: false });
    }, 2800);
  },

  selectGenre: (genreId) => {
    set({ selectedGenreId: genreId });
  },

  closeGenreModal: () => {
    set({ selectedGenreId: null });
  },

  openBookModal: (bookId) => {
    set({ selectedBookId: bookId });
  },

  closeBookModal: () => {
    set({ selectedBookId: null });
  },

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  toggleSound: () => {
    const nextSound = !get().soundEnabled;
    const active = toggleAmbientLibrarySound(nextSound);
    set({ soundEnabled: active });
  },

  toggleHotspotGrid: () => {
    set({ showHotspotGrid: !get().showHotspotGrid });
  },

  // Reading Status & Bookmark Mutations
  startReading: (bookId) => {
    const states = { ...get().userBookStates };
    const current = states[bookId] || { status: 'unread', isBookmarked: false, savedAt: Date.now() };

    states[bookId] = {
      ...current,
      status: 'reading',
      savedAt: Date.now()
    };

    saveStateToStorage(states);
    set({ userBookStates: states });
    if (get().soundEnabled) playQuillSound();
  },

  markFinished: (bookId) => {
    const states = { ...get().userBookStates };
    const current = states[bookId] || { status: 'unread', isBookmarked: false, savedAt: Date.now() };

    states[bookId] = {
      ...current,
      status: 'finished',
      savedAt: Date.now()
    };

    saveStateToStorage(states);
    set({ userBookStates: states });
    if (get().soundEnabled) playQuillSound();
  },

  toggleBookmark: (bookId) => {
    const states = { ...get().userBookStates };
    const current = states[bookId] || { status: 'unread', isBookmarked: false, savedAt: Date.now() };

    states[bookId] = {
      ...current,
      isBookmarked: !current.isBookmarked,
      savedAt: Date.now()
    };

    saveStateToStorage(states);
    set({ userBookStates: states });
    if (get().soundEnabled) playQuillSound();
  },

  resetAllState: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({
      userBookStates: {
        "gb-frankenstein": { status: "reading", isBookmarked: true, savedAt: Date.now() },
        "gb-dracula": { status: "reading", isBookmarked: true, savedAt: Date.now() }
      }
    });
  }
}));
