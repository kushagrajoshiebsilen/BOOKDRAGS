/**
 * BookHaven Gothic Library — Client-Side Controller & State
 * Powered by Python Flask backend with 540+ books across 20 shelves.
 */

// ═══════════════════════════════════════════════════════════
// STATE MANAGEMENT (localStorage)
// ═══════════════════════════════════════════════════════════
const STORAGE_KEY = "bookhaven_state_v6";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) { return {}; }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getBookState(bookId) {
  const state = loadState();
  return state[bookId] || { status: "unread", isBookmarked: false };
}

function setBookState(bookId, updates) {
  const state = loadState();
  state[bookId] = { ...getBookState(bookId), ...updates, savedAt: Date.now() };
  saveState(state);
}

function toggleBookmark(bookId) {
  const bs = getBookState(bookId);
  setBookState(bookId, { isBookmarked: !bs.isBookmarked });
}

function startReading(bookId) {
  // Clear any existing currently-reading status so only one book is on the table
  const state = loadState();
  Object.keys(state).forEach(id => {
    if (state[id].status === "reading") state[id].status = "unread";
  });
  state[bookId] = { ...getBookState(bookId), status: "reading" };
  saveState(state);
}

function markFinished(bookId) {
  setBookState(bookId, { status: "finished" });
}

function getBookmarkedIds() {
  const state = loadState();
  return Object.keys(state).filter(id => state[id].isBookmarked);
}
function getFinishedIds() {
  const state = loadState();
  return Object.keys(state).filter(id => state[id].status === "finished");
}
function getReadingIds() {
  const state = loadState();
  return Object.keys(state).filter(id => state[id].status === "reading");
}

// ═══════════════════════════════════════════════════════════
// GLOBAL CACHE & DATA
// ═══════════════════════════════════════════════════════════
let allBooksCache = [];
const GENRES_DATA = [];

async function fetchAllBooks() {
  try {
    const res = await fetch("/api/books");
    allBooksCache = await res.json();
    return allBooksCache;
  } catch (e) {
    console.error("Error fetching all books:", e);
    return [];
  }
}

async function fetchBooksForGenre(genreId) {
  try {
    const res = await fetch(`/api/books/${genreId}`);
    const books = await res.json();
    books.forEach(b => {
      if (!allBooksCache.find(x => x.id === b.id)) allBooksCache.push(b);
    });
    return books;
  } catch (e) {
    console.error("Fetch error for genre:", e);
    return allBooksCache.filter(b => b.genre === genreId);
  }
}

async function searchBooks(query) {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return await res.json();
  } catch (e) { return []; }
}

function findBookById(bookId) {
  return allBooksCache.find(b => b.id === bookId);
}

// ═══════════════════════════════════════════════════════════
// SCREEN NAVIGATION
// ═══════════════════════════════════════════════════════════
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add("active", "screen-fade-in");
    setTimeout(() => screen.classList.remove("screen-fade-in"), 500);
  }

  // If entering Tabletop screen (Step 2), update preview banner
  if (screenId === "tabletop-screen") {
    updateTabletopPreview();
  }
}

function updateTabletopPreview() {
  const readingIds = getReadingIds();
  const nameEl = document.getElementById("tabletop-book-name");
  if (!nameEl) return;

  if (readingIds.length > 0) {
    const b = findBookById(readingIds[0]);
    if (b) {
      nameEl.textContent = `"${b.title}" by ${b.author}`;
      return;
    }
  }
  if (allBooksCache.length > 0) {
    const fallback = allBooksCache[0];
    nameEl.textContent = `"${fallback.title}" by ${fallback.author}`;
  } else {
    nameEl.textContent = "None selected (browse shelves to choose)";
  }
}

function openActiveBookModal() {
  const readingIds = getReadingIds();
  if (readingIds.length > 0) {
    const book = findBookById(readingIds[0]);
    if (book) { openBookModal(book.id); return; }
  }
  if (allBooksCache.length > 0) {
    openBookModal(allBooksCache[0].id);
  }
}

// ═══════════════════════════════════════════════════════════
// SCREEN 1: DOOR (Video)
// ═══════════════════════════════════════════════════════════
let doorPlaying = false;

function initDoorScreen() {
  const quotes = [
    "Speak the title you seek, traveler... or wander silently through the ancient aisles.",
    "Knowledge here is heavy as iron. Over 540 folios rest within. Step forward if you possess the courage.",
    "Few step past these iron doors after twilight. Step carefully, for forgotten voices echo within."
  ];
  const quoteEl = document.getElementById("gatekeeper-quote");
  if (quoteEl) quoteEl.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;

  const video = document.getElementById("door-video");
  if (video) {
    video.addEventListener("ended", () => showScreen("library-screen"));
  }
}

function openDoor() {
  if (doorPlaying) return;
  doorPlaying = true;

  const video = document.getElementById("door-video");
  const dialogue = document.getElementById("door-dialogue");
  const prompt = document.getElementById("door-prompt");

  if (dialogue) dialogue.style.opacity = "0";
  if (prompt) prompt.style.opacity = "0";

  if (video) {
    video.currentTime = 0;
    video.play().catch(e => console.warn("Video play error:", e));
  }
}

// ═══════════════════════════════════════════════════════════
// SCREEN 2: MAIN LIBRARY & MASTER KEITH (LIBRARIAN)
// ═══════════════════════════════════════════════════════════
async function initLibraryScreen() {
  try {
    const res = await fetch("/api/genres");
    const genres = await res.json();
    GENRES_DATA.length = 0;
    GENRES_DATA.push(...genres);
    renderShelfPills(genres);
  } catch (e) {
    console.error("Failed to load genres:", e);
  }

  // Fetch initial Librarian greeting from Python backend
  await fetchNewLibrarianGreeting(true);
}

async function fetchNewLibrarianGreeting(initial = false) {
  try {
    const res = await fetch(`/api/librarian/greet${initial ? "?initial=true" : ""}`);
    const data = await res.json();
    setLibrarianText(data.greeting);
  } catch (e) {
    setLibrarianText("Hi there! What would you like to read today? What interests you: self-help, wealth and business, Indian classics, fiction, or philosophy?");
  }
}

let isLibrarianChatMode = false;

function openLibrarianChat() {
  isLibrarianChatMode = true;
  const bubble = document.getElementById("librarian-bubble");
  const normalBody = document.getElementById("librarian-normal-body");
  const chatBody = document.getElementById("librarian-chat-body");
  const beacon = document.getElementById("librarian-beacon");
  const chatSub = document.getElementById("librarian-chat-sub");
  const refreshBtn = document.getElementById("librarian-refresh-btn");

  if (beacon) beacon.style.display = "none";
  if (bubble) {
    bubble.style.display = "block";
    bubble.classList.remove("mode-normal");
    bubble.classList.add("mode-chat");
  }
  if (normalBody) normalBody.style.display = "none";
  if (chatBody) chatBody.style.display = "flex";
  if (chatSub) chatSub.style.display = "inline";
  if (refreshBtn) refreshBtn.style.display = "none";

  const input = document.getElementById("chat-input");
  if (input) {
    input.disabled = false;
    setTimeout(() => input.focus(), 80);
  }
}
window.openLibrarianChat = openLibrarianChat;

function closeLibrarianChat() {
  isLibrarianChatMode = false;
  const bubble = document.getElementById("librarian-bubble");
  const normalBody = document.getElementById("librarian-normal-body");
  const chatBody = document.getElementById("librarian-chat-body");
  const chatSub = document.getElementById("librarian-chat-sub");
  const refreshBtn = document.getElementById("librarian-refresh-btn");

  if (bubble) {
    bubble.classList.remove("mode-chat");
    bubble.classList.add("mode-normal");
  }
  if (chatBody) chatBody.style.display = "none";
  if (normalBody) normalBody.style.display = "block";
  if (chatSub) chatSub.style.display = "none";
  if (refreshBtn) refreshBtn.style.display = "inline";
}
window.closeLibrarianChat = closeLibrarianChat;

function handleLibrarianClose() {
  if (isLibrarianChatMode) {
    closeLibrarianChat();
  } else {
    closeLibrarianBubble();
  }
}
window.handleLibrarianClose = handleLibrarianClose;

function closeLibrarianBubble() {
  const bubble = document.getElementById("librarian-bubble");
  const beacon = document.getElementById("librarian-beacon");
  if (bubble) bubble.style.display = "none";
  if (beacon) beacon.style.display = "flex";
}
window.closeLibrarianBubble = closeLibrarianBubble;

function quickChatInquiry(queryText) {
  const input = document.getElementById("chat-input");
  if (input) {
    input.value = queryText;
    sendChatMessage();
  }
}
window.quickChatInquiry = quickChatInquiry;

function openOrCycleLibrarian() {
  openLibrarianChat();
}
window.openOrCycleLibrarian = openOrCycleLibrarian;

function setLibrarianText(text) {
  const bubble = document.getElementById("librarian-bubble");
  const beacon = document.getElementById("librarian-beacon");
  const textEl = document.getElementById("librarian-text");

  // In normal mode, ensure bubble is visible and beacon is hidden
  if (!isLibrarianChatMode && bubble) {
    bubble.style.display = "block";
    if (beacon) beacon.style.display = "none";
  }
  if (textEl) {
    textEl.style.opacity = "0";
    setTimeout(() => {
      textEl.textContent = `"${text}"`;
      textEl.style.opacity = "1";
    }, 150);
  }
  if (bubble) {
    bubble.classList.remove("librarian-pulse");
    void bubble.offsetWidth;
    bubble.classList.add("librarian-pulse");
  }
}

function renderShelfPills(genres) {
  const container = document.getElementById("shelf-pills-container");
  if (!container) return;
  container.innerHTML = "";
  const state = loadState();

  genres.forEach(g => {
    // count how many bookmarked books are in this genre
    const bmCount = allBooksCache.filter(b => b.genre === g.id && state[b.id]?.isBookmarked).length;

    const card = document.createElement("div");
    card.className = "shelf-pill-card";
    card.onclick = () => {
      toggleShelfBrowser();
      openGenreDrawer(g.id);
    };
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span class="spc-title">${g.name}</span>
        ${bmCount > 0 ? `<span class="spc-bm-count">🔖 ${bmCount}</span>` : ""}
      </div>
      <div class="spc-category">${g.category || "Archive"} • 27 Folios</div>
    `;
    container.appendChild(card);
  });
}

function toggleShelfBrowser() {
  const bar = document.getElementById("shelf-browser-bar");
  if (bar) bar.classList.toggle("active");
}

function updateCardBookmarkDisplay(bookId, isBookmarked) {
  const card = document.getElementById(`shelf-card-${bookId}`);
  if (card) {
    if (isBookmarked) {
      card.classList.add("bookmarked");
      if (!card.querySelector(".card-bookmark-badge")) {
        const badge = document.createElement("span");
        badge.className = "card-bookmark-badge";
        badge.textContent = "🔖 BOOKMARKED";
        card.insertBefore(badge, card.firstChild);
      }
    } else {
      card.classList.remove("bookmarked");
      const badge = card.querySelector(".card-bookmark-badge");
      if (badge) badge.remove();
    }
  }
  // refresh shelf pills badge count & glowing shelf hotspots
  renderShelfPills(GENRES_DATA);
  updateShelfGlows();
}

function updateShelfGlows() {
  const bmIds = getBookmarkedIds();
  const bookmarkedGenres = new Set();
  
  allBooksCache.forEach(b => {
    if (bmIds.includes(b.id)) {
      bookmarkedGenres.add(b.genre);
    }
  });

  document.querySelectorAll(".hotspot[data-genre-id]").forEach(el => {
    const genreId = el.getAttribute("data-genre-id");
    if (bookmarkedGenres.has(genreId)) {
      el.classList.add("shelf-glowing");
    } else {
      el.classList.remove("shelf-glowing");
    }
  });
}

// ═══════════════════════════════════════════════════════════
// AI CHAT & LIBRARIAN MOVEMENT CONTROLLER
// ═══════════════════════════════════════════════════════════
let isLibrarianMoving = false;

async function playLibrarianMovement(shelfTier = "mid", onComplete = null) {
  if (isLibrarianMoving) {
    if (onComplete) onComplete();
    return;
  }
  isLibrarianMoving = true;

  const overlay = document.getElementById("movement-video-overlay");
  const video = document.getElementById("movement-video");
  if (!overlay || !video) {
    isLibrarianMoving = false;
    if (onComplete) onComplete();
    return;
  }

  video.onended = null;
  video.onerror = null;

  if (!video.src || !video.src.includes("going_on_upper_shelf.mp4")) {
    video.src = "/static/assets/going_on_upper_shelf.mp4";
  }

  video.currentTime = 0;

  let hasFadedIn = false;
  const showVideoOverlay = () => {
    if (!hasFadedIn) {
      hasFadedIn = true;
      overlay.style.display = "block";
      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
      });
    }
  };

  const handleEnded = () => {
    video.pause();
    // 1. Hold final frame for ~300ms
    setTimeout(() => {
      // 2. Cross-fade duration ~400ms
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
        isLibrarianMoving = false;
        if (onComplete) onComplete();
      }, 400);
    }, 300);
  };

  video.onended = handleEnded;
  video.onerror = (e) => {
    console.warn("Video playback error:", e);
    overlay.style.display = "none";
    isLibrarianMoving = false;
    if (onComplete) onComplete();
  };

  // Wait until actual video frames are rendering to prevent any black screen flash
  const onTimeUpdate = () => {
    if (video.currentTime > 0.05) {
      video.removeEventListener("timeupdate", onTimeUpdate);
      showVideoOverlay();
    }
  };
  video.addEventListener("timeupdate", onTimeUpdate);

  try {
    await video.play();
  } catch (e) {
    console.warn("Play error:", e);
    video.removeEventListener("timeupdate", onTimeUpdate);
    overlay.style.display = "none";
    isLibrarianMoving = false;
    if (onComplete) onComplete();
  }
}

let isChatSending = false;

async function sendChatMessage() {
  if (isChatSending) return;

  const inputEl = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send-btn");
  const btnText = document.getElementById("chat-btn-text");
  const spinner = document.getElementById("chat-spinner");
  const historyContainer = document.getElementById("chat-history");

  if (!inputEl) return;
  const message = inputEl.value.trim();
  if (!message) return;

  isChatSending = true;
  inputEl.disabled = true;
  if (sendBtn) sendBtn.disabled = true;
  if (btnText) btnText.style.display = "none";
  if (spinner) spinner.style.display = "inline-block";

  // Append user message bubble
  const userBubble = document.createElement("div");
  userBubble.className = "chat-msg chat-msg-user";
  userBubble.textContent = message;
  historyContainer.appendChild(userBubble);
  historyContainer.scrollTop = historyContainer.scrollHeight;

  inputEl.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message })
    });

    const data = await res.json();

    // Append librarian response bubble
    const libBubble = document.createElement("div");
    libBubble.className = "chat-msg chat-msg-librarian";
    libBubble.textContent = `"${data.reply || 'Speak your mind, traveler.'}"`;
    historyContainer.appendChild(libBubble);
    historyContainer.scrollTop = historyContainer.scrollHeight;

    // Update Head Librarian speech bubble
    setLibrarianText(data.reply);

    // If request matches a shelf, book, or saved collection
    if (data.status === "matched") {
      if (data.intent === "saved_books") {
        setTimeout(() => {
          openSavedFolios();
        }, 1800);
      } else if (data.genreId || data.shelfId) {
        const targetGenreId = data.genreId || data.shelfId;
        const targetBookId = data.bookId;
        const shelfTier = data.shelfTier || "mid";

        // Give 2 seconds for the user to read Master Keith's response in chat before moving
        setTimeout(() => {
          playLibrarianMovement(shelfTier, async () => {
            await openGenreDrawer(targetGenreId);
            if (targetBookId) {
              openBookModal(targetBookId);
            }
          });
        }, 2000);
      }
    }

  } catch (err) {
    console.error("Chat API error:", err);
    const errBubble = document.createElement("div");
    errBubble.className = "chat-msg chat-msg-librarian";
    errBubble.textContent = '"The shelves are unusually quiet tonight. Please try again."';
    historyContainer.appendChild(errBubble);
    historyContainer.scrollTop = historyContainer.scrollHeight;
  } finally {
    isChatSending = false;
    inputEl.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    if (btnText) btnText.style.display = "inline";
    if (spinner) spinner.style.display = "none";
    inputEl.focus();
  }
}

// ═══════════════════════════════════════════════════════════
// HORIZONTAL WING SCROLLING & PANNING
// ═══════════════════════════════════════════════════════════
const EAST_WING_GENRES = [
  "crime-thriller", "horror-gothic", "mythology", "fantasy",
  "dystopian", "biography", "classics", "health-wellness",
  "romance-drama", "poetry-ghazals", "young-adult"
];

function scrollToWing(wing) {
  const container = document.getElementById("library-scroll-container");
  if (!container) return;

  if (wing === "east" || wing === 2 || (typeof wing === "string" && EAST_WING_GENRES.includes(wing))) {
    container.scrollTo({ left: window.innerWidth, behavior: "smooth" });
  } else {
    container.scrollTo({ left: 0, behavior: "smooth" });
  }
}
window.scrollToWing = scrollToWing;

function initLibraryDragScroll() {
  const container = document.getElementById("library-scroll-container");
  if (!container) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  container.addEventListener("mousedown", (e) => {
    if (e.target.closest(".hotspot") || e.target.closest(".librarian-pod") || e.target.closest("button") || e.target.closest("input") || e.target.closest("#shelf-drawer")) return;
    isDown = true;
    container.style.cursor = "grabbing";
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.style.cursor = "default";
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.style.cursor = "default";
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initLibraryDragScroll, 500);
});

// ═══════════════════════════════════════════════════════════
// SHELF CATALOGUE DRAWER (Right Docked: Leaves Librarian Visible!)
// ═══════════════════════════════════════════════════════════
async function openGenreDrawer(genreId) {
  scrollToWing(genreId);
  const genre = GENRES_DATA.find(g => g.id === genreId);
  if (!genre) return;

  // Master Keith speaks about this shelf on the left!
  const shelfGreeting = genre.librarianGreeting || `Ah, the ${genre.name} archives. Notable wisdom rests within these tomes.`;
  setLibrarianText(`Ah, the ${genre.name} collection! ${shelfGreeting}`);

  const books = await fetchBooksForGenre(genreId);
  const state = loadState();

  const drawer = document.getElementById("shelf-drawer");
  document.getElementById("shelf-drawer-title").textContent = genre.name;
  document.getElementById("shelf-drawer-desc").textContent = genre.description;
  document.getElementById("shelf-drawer-count").textContent = `${books.length} Folios Preserved`;
  document.getElementById("shelf-librarian-text").textContent = shelfGreeting;

  const grid = document.getElementById("shelf-books-grid");
function createGothicCoverDataUrl(title, author, genre = "ARCHIVES") {
  const iconMap = {
    "hindu-scriptures": "🕉️",
    "self-help": "✨",
    "self-development": "⚔️",
    "business-finance": "⚖️",
    "indian-literature": "🪔",
    "ancient-wisdom": "📜",
    "psychology": "🧠",
    "philosophy": "🦉",
    "history-chronicles": "🏛️",
    "science": "🌌",
    "technology": "💻",
    "crime-thriller": "🔍",
    "horror-gothic": "🕯️",
    "mythology": "🏛️",
    "fantasy": "🔮",
    "dystopian": "👁️",
    "biography": "🖋️",
    "classics": "📜",
    "health-wellness": "🌿",
    "romance-drama": "🌹",
    "poetry-ghazals": "🥀",
    "young-adult": "⚡"
  };

  const emblem = iconMap[genre] || "✦";
  const cleanTitle = (title || "Folio").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cleanAuthor = (author || "Anonymous").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const cleanGenre = (genre || "Archives").replace("-", " ").toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a1810"/>
        <stop offset="50%" stop-color="#170d08"/>
        <stop offset="100%" stop-color="#0d0704"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#d4a24c"/>
        <stop offset="50%" stop-color="#ffcc70"/>
        <stop offset="100%" stop-color="#b8860b"/>
      </linearGradient>
    </defs>
    <rect width="300" height="450" rx="8" fill="url(#bg)" stroke="#d4a24c" stroke-width="3"/>
    <rect x="12" y="12" width="276" height="426" rx="4" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="4 2"/>
    <rect x="18" y="18" width="264" height="414" fill="rgba(0,0,0,0.3)" stroke="rgba(212,162,76,0.3)" stroke-width="1"/>
    
    <text x="150" y="70" text-anchor="middle" font-size="28">${emblem}</text>
    <text x="150" y="100" text-anchor="middle" fill="#ffcc70" font-family="serif" font-size="10" letter-spacing="3">✦ ARCHIVE FOLIO ✦</text>

    <line x1="60" y1="120" x2="240" y2="120" stroke="url(#gold)" stroke-width="1"/>

    <text x="150" y="180" text-anchor="middle" fill="#f5ede0" font-family="Georgia, serif" font-weight="bold" font-size="16">
      <tspan x="150" dy="0">${cleanTitle.slice(0, 22)}</tspan>
      ${cleanTitle.length > 22 ? `<tspan x="150" dy="22">${cleanTitle.slice(22, 44)}</tspan>` : ''}
    </text>

    <line x1="100" y1="260" x2="200" y2="260" stroke="#d4a24c" stroke-width="1"/>

    <text x="150" y="300" text-anchor="middle" fill="#d4a24c" font-family="Georgia, serif" font-style="italic" font-size="13">by ${cleanAuthor.slice(0, 24)}</text>

    <text x="150" y="400" text-anchor="middle" fill="rgba(232,220,196,0.6)" font-family="sans-serif" font-size="9" letter-spacing="2">${cleanGenre}</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

  grid.innerHTML = "";

  books.forEach(book => {
    const bs = state[book.id];
    const isBookmarked = bs && bs.isBookmarked;

    const card = document.createElement("div");
    card.id = `shelf-card-${book.id}`;
    card.className = `book-card${isBookmarked ? " bookmarked" : ""}`;
    card.onclick = () => openBookModal(book.id);
    const fallbackSvg = createGothicCoverDataUrl(book.title, book.author, book.genre);
    card.innerHTML = `
      ${isBookmarked ? '<span class="card-bookmark-badge">🔖 BOOKMARKED</span>' : ''}
      <img src="${book.coverUrl || fallbackSvg}" alt="${book.title}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackSvg}';">
      <div class="info">
        <h4>${book.title}</h4>
        <p class="author">${book.author}</p>
        <p class="rating">⭐ ${book.rating || 4.7} • ${book.publishedYear || ""}</p>
      </div>
    `;
    grid.appendChild(card);
  });

  drawer.classList.add("active");
}

function closeGenreDrawer() {
  const drawer = document.getElementById("shelf-drawer");
  if (drawer) drawer.classList.remove("active");
}

// ═══════════════════════════════════════════════════════════
// BOOK DETAIL DRAWER & BESPOKE LIBRARIAN RESPONSE
// ═══════════════════════════════════════════════════════════
async function openBookModal(bookId) {
  let book = findBookById(bookId);

  // If not found in memory, try to find in cache
  if (!book && allBooksCache.length > 0) {
    book = allBooksCache.find(b => b.id === bookId);
  }

  // Fetch bespoke friendly commentary from Python backend
  let librarianComment = book ? (book.librarianComment || "") : "";
  try {
    const res = await fetch(`/api/librarian/comment/${bookId}`);
    if (res.ok) {
      const data = await res.json();
      librarianComment = data.comment;
    }
  } catch (e) {}

  if (!librarianComment) {
    librarianComment = `'${book?.title || "This folio"}' is a wonderful book in our archives. Enjoy reading it!`;
  }

  // Update Master Keith's speech bubble in the Library room!
  setLibrarianText(librarianComment);

  const bs = getBookState(bookId);

  // Populate title & author
  document.getElementById("modal-title").textContent = book ? book.title : "Manuscript";
  document.getElementById("modal-author").textContent = book ? `by ${book.author}` : "";
  document.getElementById("drawer-book-genre").textContent = book ? book.genre.replace("-", " ") : "Archives";

  // Setup Cover with Fallback
  const customCover = document.getElementById("modal-cover-custom");
  const imgCover = document.getElementById("modal-cover");
  document.getElementById("cbc-title").textContent = book?.title || "";
  document.getElementById("cbc-author").textContent = book?.author || "";
  document.getElementById("cbc-genre").textContent = (book?.genre || "ARCHIVES").replace("-", " ");

  if (book && book.coverUrl) {
    imgCover.src = book.coverUrl;
    imgCover.style.display = "block";
    customCover.style.display = "none";
    imgCover.onload = () => {
      imgCover.style.display = "block";
      customCover.style.display = "none";
    };
    imgCover.onerror = () => {
      imgCover.style.display = "none";
      customCover.style.display = "flex";
    };
  } else {
    // Show custom leather-bound gothic cover as fallback
    imgCover.style.display = "none";
    customCover.style.display = "flex";
  }

  document.getElementById("modal-desc").textContent = book ? book.description : "";
  document.getElementById("modal-genre").textContent = book ? book.genre.replace("-", " ") : "Archives";
  document.getElementById("modal-pages").textContent = `${book?.pageCount || 280} Pages`;
  document.getElementById("modal-publisher").textContent = book?.publisher || "Classic Archives";
  document.getElementById("modal-rating").textContent = `⭐ ${book?.rating || 4.8} / 5.0`;

  // Display Master Keith's recommendation in the drawer
  document.getElementById("modal-librarian-comment").textContent = librarianComment;

  // Hide action toast on new book open
  const toastEl = document.getElementById("book-action-toast");
  if (toastEl) toastEl.style.display = "none";

  const statusEl = document.getElementById("modal-status");
  statusEl.textContent = `Status: ${bs.status}`;
  statusEl.className = `status-badge ${bs.status}`;

  // Action buttons
  renderBookActionButtons(bookId);

  // Open right-docked drawer (Does NOT cover the screen or the librarian!)
  document.getElementById("book-drawer").classList.add("active");
}

function renderBookActionButtons(bookId) {
  const book = findBookById(bookId);
  const bs = getBookState(bookId);
  const actionsRow = document.getElementById("modal-actions");
  actionsRow.innerHTML = "";

  // 1. PLACE ON READING DESK
  if (bs.status !== "reading") {
    const btn = document.createElement("button");
    btn.className = "btn-action";
    btn.innerHTML = `📖 PLACE ON READING DESK`;
    btn.onclick = async () => {
      startReading(bookId);
      // Fetch personalized response from Python
      try {
        const res = await fetch(`/api/librarian/action?action=reading&book_id=${bookId}`);
        const data = await res.json();
        setLibrarianText(data.message);
        showActionToast(data.message);
      } catch (e) {
        const msg = `I've placed '${book?.title || "this book"}' on your reading desk!`;
        setLibrarianText(msg);
        showActionToast(msg);
      }
      renderBookActionButtons(bookId);
      const statusEl = document.getElementById("modal-status");
      statusEl.textContent = "Status: reading";
      statusEl.className = "status-badge reading";
    };
    actionsRow.appendChild(btn);
  }

  // 2. MARK FINISHED
  if (bs.status !== "finished") {
    const btn = document.createElement("button");
    btn.className = "btn-action";
    btn.innerHTML = `✓ MARK FINISHED`;
    btn.onclick = () => {
      markFinished(bookId);
      const msg = `Awesome! I have marked '${book?.title || "this book"}' as finished in your archives.`;
      setLibrarianText(msg);
      showActionToast(msg);
      renderBookActionButtons(bookId);
      const statusEl = document.getElementById("modal-status");
      statusEl.textContent = "Status: finished";
      statusEl.className = "status-badge finished";
    };
    actionsRow.appendChild(btn);
  }

  // 3. BOOKMARK FOLIO
  const bmBtn = document.createElement("button");
  bmBtn.className = `btn-action${bs.isBookmarked ? " bookmarked-active" : ""}`;
  bmBtn.innerHTML = `🔖 ${bs.isBookmarked ? "BOOKMARKED" : "BOOKMARK FOLIO"}`;
  bmBtn.onclick = async () => {
    toggleBookmark(bookId);
    const updatedState = getBookState(bookId);
    if (updatedState.isBookmarked) {
      try {
        const res = await fetch(`/api/librarian/action?action=bookmark&book_id=${bookId}`);
        const data = await res.json();
        setLibrarianText(data.message);
        showActionToast(data.message);
      } catch (e) {
        const msg = `Bookmarked '${book?.title || "this book"}'! It's saved safely in your manuscript stack.`;
        setLibrarianText(msg);
        showActionToast(msg);
      }
    } else {
      const msg = `Removed '${book?.title || "this book"}' from your bookmarks.`;
      setLibrarianText(msg);
      showActionToast(msg);
    }
    renderBookActionButtons(bookId);
    updateCardBookmarkDisplay(bookId, updatedState.isBookmarked);
  };
  actionsRow.appendChild(bmBtn);

  // 4. FIND THIS BOOK
  const extUrl = book?.externalUrl || `https://www.google.com/search?tbm=bks&q=${encodeURIComponent((book?.title || "") + " " + (book?.author || ""))}`;
  const link = document.createElement("a");
  link.className = "btn-action";
  link.href = extUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.innerHTML = `🔍 FIND THIS BOOK ↗`;
  actionsRow.appendChild(link);
}

function showActionToast(message) {
  const toast = document.getElementById("book-action-toast");
  const textEl = document.getElementById("book-action-toast-text");
  if (toast && textEl) {
    textEl.textContent = message;
    toast.style.display = "flex";
  }
}

function closeBookDrawer() {
  const drawer = document.getElementById("book-drawer");
  if (drawer) drawer.classList.remove("active");
}

function closeBookModal() {
  closeBookDrawer();
}

// ═══════════════════════════════════════════════════════════
// SEARCH OVERLAY
// ═══════════════════════════════════════════════════════════
function openSearch() {
  document.getElementById("search-overlay").classList.add("active");
  const input = document.getElementById("search-input");
  input.value = "";
  input.focus();
  document.getElementById("search-results").innerHTML = "";
}

function closeSearch() {
  document.getElementById("search-overlay").classList.remove("active");
}

let searchDebounceTimer = null;
function handleSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(async () => {
    const query = document.getElementById("search-input").value.trim();
    const container = document.getElementById("search-results");
    if (!query) { container.innerHTML = ""; return; }

    const results = await searchBooks(query);
    const state = loadState();
    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:rgba(232,220,196,0.5);padding:30px;font-style:italic;grid-column:1/-1;">No folios matched your inquiry across 540 manuscripts.</p>`;
      return;
    }

    results.forEach(book => {
      const isBookmarked = state[book.id]?.isBookmarked;
      const card = document.createElement("div");
      card.className = `book-card${isBookmarked ? " bookmarked" : ""}`;
      card.onclick = () => { closeSearch(); openBookModal(book.id); };
      card.innerHTML = `
        <img src="${book.coverUrl}" alt="${book.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'">
        <div class="info">
          <h4>${book.title}</h4>
          <p class="author">${book.author}</p>
          <p class="rating">⭐ ${book.rating || 4.7} • ${book.genre.replace("-", " ")}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }, 200);
}

// ═══════════════════════════════════════════════════════════
// SAVED FOLIOS OVERLAY (Reading Room Book Pile & Rack)
// ═══════════════════════════════════════════════════════════
async function openSavedFolios() {
  if (allBooksCache.length === 0) {
    await fetchAllBooks();
  }

  const bmIds = getBookmarkedIds();
  const finIds = getFinishedIds();
  const bmBooks = bmIds.map(id => findBookById(id)).filter(Boolean);
  const finBooks = finIds.map(id => findBookById(id)).filter(Boolean);

  const bmGrid = document.getElementById("saved-bookmarked-grid");
  const finGrid = document.getElementById("saved-finished-grid");
  const bmCount = document.getElementById("saved-bm-count");
  const finCount = document.getElementById("saved-fin-count");

  bmCount.textContent = `(${bmBooks.length})`;
  finCount.textContent = `(${finBooks.length})`;

  bmGrid.innerHTML = "";
  finGrid.innerHTML = "";

  if (bmBooks.length === 0) {
    bmGrid.innerHTML = `<p style="color:rgba(232,220,196,0.5);font-style:italic;font-size:0.75rem;grid-column:1/-1;">No manuscripts bookmarked yet. Explore shelves and bookmark folios to save them to your table stack!</p>`;
  } else {
    bmBooks.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card bookmarked";
      card.onclick = () => { closeSavedFolios(); openBookModal(book.id); };
      card.innerHTML = `
        <img src="${book.coverUrl}" alt="${book.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'">
        <div class="info">
          <h4>${book.title}</h4>
          <p class="author">${book.author}</p>
        </div>
      `;
      bmGrid.appendChild(card);
    });
  }

  if (finBooks.length === 0) {
    finGrid.innerHTML = `<p style="color:rgba(232,220,196,0.5);font-style:italic;font-size:0.75rem;grid-column:1/-1;">No completed manuscripts logged yet.</p>`;
  } else {
    finBooks.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.onclick = () => { closeSavedFolios(); openBookModal(book.id); };
      card.innerHTML = `
        <img src="${book.coverUrl}" alt="${book.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'">
        <div class="info">
          <h4>${book.title}</h4>
          <p class="author">${book.author}</p>
        </div>
      `;
      finGrid.appendChild(card);
    });
  }

  document.getElementById("saved-folios-overlay").classList.add("active");
}

function closeSavedFolios() {
  document.getElementById("saved-folios-overlay").classList.remove("active");
}

// ═══════════════════════════════════════════════════════════
// DUST PARTICLES
// ═══════════════════════════════════════════════════════════
function spawnDust() {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("div");
    p.className = "dust-particle";
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}vw;
      top: ${60 + Math.random() * 40}vh;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    document.body.appendChild(p);
  }
}

// ═══════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    openSearch();
  }
  if (e.key === "Escape") {
    closeSearch();
    closeGenreDrawer();
    closeBookModal();
    closeSavedFolios();
    const bar = document.getElementById("shelf-browser-bar");
    if (bar) bar.classList.remove("active");
  }
});

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  spawnDust();
  initDoorScreen();
  await initLibraryScreen();
  await fetchAllBooks();
  updateShelfGlows();
});
