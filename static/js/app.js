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
    setLibrarianText("Hi there! What would you like to read today? What interests you — self-help, wealth and business, Indian classics, fiction, or philosophy?");
  }
}

function closeLibrarianBubble() {
  const bubble = document.getElementById("librarian-bubble");
  if (bubble) bubble.style.display = "none";
}

function openOrCycleLibrarian() {
  const bubble = document.getElementById("librarian-bubble");
  if (bubble) bubble.style.display = "block";
  fetchNewLibrarianGreeting();
}

function setLibrarianText(text) {
  const bubble = document.getElementById("librarian-bubble");
  const textEl = document.getElementById("librarian-text");
  if (bubble) bubble.style.display = "block";
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
  // also refresh shelf pills badge count
  renderShelfPills(GENRES_DATA);
}

// ═══════════════════════════════════════════════════════════
// SHELF CATALOGUE DRAWER (Right Docked: Leaves Librarian Visible!)
// ═══════════════════════════════════════════════════════════
async function openGenreDrawer(genreId) {
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
  grid.innerHTML = "";

  books.forEach(book => {
    const bs = state[book.id];
    const isBookmarked = bs && bs.isBookmarked;

    const card = document.createElement("div");
    card.id = `shelf-card-${book.id}`;
    card.className = `book-card${isBookmarked ? " bookmarked" : ""}`;
    card.onclick = () => openBookModal(book.id);
    card.innerHTML = `
      ${isBookmarked ? '<span class="card-bookmark-badge">🔖 BOOKMARKED</span>' : ''}
      <img src="${book.coverUrl}" alt="${book.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120'">
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

  if (book && book.coverUrl && !book.coverUrl.includes("id=sh-") && !book.coverUrl.includes("id=bf-") && !book.coverUrl.includes("id=il-") && !book.coverUrl.includes("id=hg-")) {
    imgCover.src = book.coverUrl;
    imgCover.onload = () => {
      imgCover.style.display = "block";
      customCover.style.display = "none";
    };
    imgCover.onerror = () => {
      imgCover.style.display = "none";
      customCover.style.display = "flex";
    };
  } else {
    // Show our authentic custom leather-bound gothic book cover!
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
});
