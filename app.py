"""
BookHaven - Gothic Library Book Recommendation App
A Python Flask web application for college project.
Powers 540+ books across 20 distinct library shelves with friendly Librarian commentary & recommendations.
"""

from flask import Flask, render_template, jsonify, request
import json
import os
import random

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

BOOKS_CACHE_FILE = os.path.join(os.path.dirname(__file__), "books_cache.json")

# Import 20 shelves configuration & response generators
try:
    import importlib
    import enrich_500_books
    GENRES_CONFIG = enrich_500_books.GENRES_CONFIG
    def generate_librarian_comment(book, gname):
        return enrich_500_books.generate_librarian_comment(book, gname)
    def generate_action_response(book, action):
        return enrich_500_books.generate_action_response(book, action)
except ImportError:
    GENRES_CONFIG = []
    def generate_librarian_comment(book, gname):
        return f"A notable book in our {gname} collection: {book.get('title')}."
    def generate_action_response(book, action):
        return f"Updated '{book.get('title')}'."

def get_genres_config():
    """Dynamically reload and return latest GENRES_CONFIG."""
    try:
        import enrich_500_books
        importlib.reload(enrich_500_books)
        return enrich_500_books.GENRES_CONFIG
    except Exception:
        return GENRES_CONFIG


def load_books_cache():
    """Load cached books from JSON file."""
    if os.path.exists(BOOKS_CACHE_FILE):
        with open(BOOKS_CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def get_all_books_flat():
    """Return all books as a flat list."""
    cache = load_books_cache()
    all_books = []
    for books in cache.values():
        all_books.extend(books)
    return all_books


def find_book_by_id(book_id):
    """Find a specific book across all shelves."""
    cache = load_books_cache()
    for books in cache.values():
        for b in books:
            if b.get("id") == book_id:
                return b
    return None


# â”€â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

@app.route("/")
def index():
    """Main single-page app route."""
    return render_template("index.html")


@app.route("/api/genres")
def api_genres():
    """Return all 20 shelf / genre definitions with positioning metadata."""
    return jsonify(GENRES_CONFIG)


@app.route("/api/books/<genre_id>")
def api_books(genre_id):
    """Fetch books for a specific genre/shelf."""
    cache = load_books_cache()
    books = cache.get(genre_id, [])
    if not books:
        genre = next((g for g in GENRES_CONFIG if g["id"] == genre_id), None)
        if not genre:
            return jsonify({"error": "Shelf not found"}), 404
    return jsonify(books)


@app.route("/api/books")
def api_all_books():
    """Fetch all 540+ books across all 20 genres."""
    return jsonify(get_all_books_flat())


@app.route("/api/librarian/greet")
def api_librarian_greet():
    """Friendly greeting endpoint for Master Keith."""
    greetings = [
        "Hi there! What would you like to read today? What interests you: self-help, wealth and business, Indian classics, fiction, or philosophy?",
        "Hello! Looking for something inspiring today? Feel free to click any shelf or ask me for a recommendation!",
        "Welcome! We have over 540 great books here. Whether you want to improve your habits, explore business, or read a classic story, just click a shelf to start!",
        "Hi there! Take your time wandering the shelves. If any title catches your eye, click on it and I will gladly share my thoughts on it!"
    ]
    # First greeting is always friendly and welcoming as requested
    is_initial = request.args.get("initial", "false").lower() == "true"
    chosen = greetings[0] if is_initial else random.choice(greetings)
    return jsonify({
        "librarian": "Master Keith",
        "greeting": chosen
    })


@app.route("/api/librarian/comment/<book_id>")
def api_librarian_comment(book_id):
    """Python endpoint returning customized, easy-to-understand commentary for a specific book."""
    book = find_book_by_id(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    genre_name = book.get("genre", "archives").replace("-", " ").title()
    for g in GENRES_CONFIG:
        if g["id"] == book.get("genre"):
            genre_name = g["name"]
            break

    comment = generate_librarian_comment(book, genre_name)
    return jsonify({
        "librarian": "Master Keith",
        "bookId": book_id,
        "title": book.get("title"),
        "author": book.get("author"),
        "comment": comment
    })


@app.route("/api/librarian/action")
def api_librarian_action():
    """Personalized Librarian response when a user adds a book to the desk or bookmarks it."""
    book_id = request.args.get("book_id", "")
    action = request.args.get("action", "reading")  # 'reading' or 'bookmark'
    book = find_book_by_id(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    response_text = generate_action_response(book, action)
    return jsonify({
        "librarian": "Master Keith",
        "bookId": book_id,
        "action": action,
        "title": book.get("title"),
        "message": response_text
    })


@app.route("/api/recommendations/<book_id>")
def api_recommendations(book_id):
    """Python content-based recommendation logic."""
    target = find_book_by_id(book_id)
    if not target:
        return jsonify([])

    all_books = get_all_books_flat()
    candidates = [b for b in all_books if b["id"] != book_id]

    def score(b):
        s = 0
        if b.get("genre") == target.get("genre"):
            s += 50
        if b.get("author") == target.get("author"):
            s += 40
        try:
            diff = abs(float(b.get("rating", 4.5)) - float(target.get("rating", 4.5)))
            s += max(0, 10 - diff * 10)
        except Exception:
            pass
        return s

    candidates.sort(key=score, reverse=True)
    return jsonify(candidates[:4])


@app.route("/api/search")
def api_search():
    """Search books by query string."""
    query = request.args.get("q", "").lower().strip()
    if not query:
        return jsonify([])

    all_books = get_all_books_flat()
    results = [
        b for b in all_books
        if query in b.get("title", "").lower()
        or query in b.get("author", "").lower()
        or query in b.get("description", "").lower()
        or query in b.get("genre", "").lower()
    ]
    return jsonify(results[:40])


import re

def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None
    try:
        from groq import Groq
        return Groq(api_key=api_key)
    except Exception as e:
        print("Groq client init error:", e)
        return None

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r'[^a-z0-9\s]', '', text.lower()).strip()

def find_exact_or_strong_book_match(query_text):
    norm_query = normalize_text(query_text)
    if not norm_query:
        return None
    
    all_books = get_all_books_flat()
    
    # 1. Exact title match
    for b in all_books:
        norm_title = normalize_text(b.get("title", ""))
        if norm_query == norm_title:
            return b
            
    # 2. Check scripture keywords directly
    scripture_keywords = {
        "rigveda": "hs-001",
        "samaveda": "hs-002",
        "yajurveda": "hs-003",
        "atharvaveda": "hs-004",
        "vedas": "hs-001",
        "veda": "hs-001",
        "upanishads": "hs-006",
        "upanishad": "hs-006",
        "bhagavad gita": "hs-005",
        "gita": "hs-005",
        "ramayana": "hs-007",
        "mahabharata": "hs-008",
        "bhagavatam": "hs-009",
        "shiva purana": "hs-010",
        "vishnu purana": "hs-011",
        "durga saptashati": "hs-012",
        "devi mahatmyam": "hs-012",
        "yoga sutras": "hs-013",
        "ashtavakra gita": "hs-014",
        "yoga vasistha": "hs-015",
        "chanakya": "hs-016",
        "garuda purana": "hs-018"
    }

    for kw, target_id in scripture_keywords.items():
        if kw in norm_query:
            found = find_book_by_id(target_id)
            if found:
                return found

    # 3. Check if title is inside query (e.g. "I want Atomic Habits")
    for b in all_books:
        norm_title = normalize_text(b.get("title", ""))
        if len(norm_title) > 3 and norm_title in norm_query:
            return b

    # 4. Check author match inside query
    for b in all_books:
        norm_author = normalize_text(b.get("author", ""))
        if len(norm_author) > 3 and norm_author in norm_query:
            return b

    return None


GENRE_TOPIC_MAP = {
    # Self-Development & Growth
    "self development": "self-development",
    "self-development": "self-development",
    "self improvement": "self-development",
    "self-improvement": "self-development",
    "personal development": "self-development",
    "personal growth": "self-development",
    "discipline": "self-development",
    "mindset": "self-development",
    "mastery": "self-development",
    "goggins": "self-development",
    "motivation": "self-development",
    "productivity": "self-development",

    # Self-Help & Habits
    "habits": "self-help",
    "habit": "self-help",
    "atomic habits": "self-help",
    "ikigai": "self-help",
    "self help": "self-help",
    "self-help": "self-help",

    # Money & Business
    "money": "business-finance",
    "wealth": "business-finance",
    "finance": "business-finance",
    "business": "business-finance",
    "investing": "business-finance",
    "rich dad": "business-finance",
    "psychology of money": "business-finance",
    "stocks": "business-finance",

    # Hindu Scriptures & Epics
    "hindu": "hindu-scriptures",
    "vedas": "hindu-scriptures",
    "veda": "hindu-scriptures",
    "rigveda": "hindu-scriptures",
    "samaveda": "hindu-scriptures",
    "yajurveda": "hindu-scriptures",
    "atharvaveda": "hindu-scriptures",
    "gita": "hindu-scriptures",
    "bhagavad gita": "hindu-scriptures",
    "upanishad": "hindu-scriptures",
    "upanishads": "hindu-scriptures",
    "scriptures": "hindu-scriptures",
    "scripture": "hindu-scriptures",
    "scruptures": "hindu-scriptures",
    "scrupture": "hindu-scriptures",
    "sanatana": "hindu-scriptures",
    "purana": "hindu-scriptures",
    "puranas": "hindu-scriptures",
    "ramayana": "hindu-scriptures",
    "mahabharata": "hindu-scriptures",

    # Horror & Gothic
    "scary": "horror-gothic",
    "horror": "horror-gothic",
    "ghost": "horror-gothic",
    "ghosts": "horror-gothic",
    "spooky": "horror-gothic",
    "dread": "horror-gothic",
    "dracula": "horror-gothic",

    # Fantasy
    "fantasy": "fantasy",
    "magic": "fantasy",
    "dragons": "fantasy",
    "dragon": "fantasy",
    "wizards": "fantasy",
    "lord of the rings": "fantasy",

    # Tech & Coding
    "coding": "technology",
    "programming": "technology",
    "python": "technology",
    "code": "technology",
    "software": "technology",
    "tech": "technology",
    "algorithm": "technology",
    "algorithms": "technology",

    # Psychology
    "psychology": "psychology",
    "human behavior": "psychology",
    "mind": "psychology",
    "brain": "psychology",

    # Philosophy & Stoicism
    "philosophy": "philosophy",
    "stoic": "philosophy",
    "stoicism": "philosophy",
    "marcus aurelius": "philosophy",
    "seneca": "philosophy",
    "plato": "philosophy",

    # History
    "history": "history-chronicles",
    "empires": "history-chronicles",
    "chronicles": "history-chronicles",

    # Science
    "science": "science",
    "space": "science",
    "cosmos": "science",
    "universe": "science",
    "astrophysics": "science",

    # Mystery & Thriller
    "mystery": "crime-thriller",
    "crime": "crime-thriller",
    "detective": "crime-thriller",
    "sherlock": "crime-thriller",
    "thriller": "crime-thriller",

    # Indian Literature
    "indian": "indian-literature",
    "malgudi": "indian-literature",
    "rk narayan": "indian-literature",

    # Dystopian
    "dystopian": "dystopian",
    "1984": "dystopian",
    "orwell": "dystopian",

    # Biography
    "biography": "biography",
    "autobiography": "biography",
    "steve jobs": "biography",

    # Health & Wellness
    "health": "health-wellness",
    "wellness": "health-wellness",
    "sleep": "health-wellness",
    "longevity": "health-wellness",

    # Poetry
    "poetry": "poetry-ghazals",
    "ghazals": "poetry-ghazals",
    "ghazal": "poetry-ghazals",
    "poems": "poetry-ghazals",

    # Romance
    "romance": "romance-drama",
    "love": "romance-drama",

    # Young Adult
    "young adult": "young-adult",
    "harry potter": "young-adult",
    "percy jackson": "young-adult",

    # World Classics
    "classics": "classics",
    "dostoevsky": "classics",
    "tolstoy": "classics",

    # Defence & Military
    "defence": "self-development",
    "defense": "self-development",
    "military": "self-development",
    "navy seal": "self-development",
    "war": "history-chronicles"
}

GENRE_COMPLIMENTS = {
    "business-finance": "A great choice! Building wealth, mastering money, and understanding business is one of life's finest pursuits. Allow me to lead you to our Money & Business shelf.",
    "self-development": "An excellent choice! Mastering your mind, discipline, and personal growth will build unstoppable strength. Follow me to our Self-Development shelf.",
    "self-help": "A wonderful choice! Building great daily habits and discovering your purpose is a noble journey. Step right this way to our Self-Help shelf.",
    "hindu-scriptures": "A divine choice! The ancient 4 Vedas, Bhagavad Gita, Upanishads, and sacred epics hold supreme eternal wisdom. Follow me to the Sacred Scriptures collection.",
    "ancient-wisdom": "A profound choice! The ancient seers and strategists leave us timeless guidance. Allow me to guide your steps to the Vedic & Ancient Epics shelf.",
    "psychology": "A fascinating choice! Unraveling the mysteries of human thought, behavior, and the mind is truly enlightening. Follow me to the Psychology shelf.",
    "philosophy": "A noble choice! The Stoics and philosophers teach us calm resilience and peace amidst life's storms. Step right this way to the Philosophy shelf.",
    "history-chronicles": "A brilliant choice! Understanding the chronicles of empires, civilizations, and great events illuminates our future. Follow me to the History shelf.",
    "science": "A stellar choice! Exploring astrophysics, evolution, and the mysteries of the cosmos expands the human spirit. Follow me to the Science shelf.",
    "technology": "A smart choice! Mastering code, algorithms, and software is the magic of our modern era. Follow me to the Technology shelf.",
    "crime-thriller": "A thrilling choice! Intrigue, dark enigmas, and brilliant detective sleuths await in the shadows. Follow me to the Mystery & Thriller shelf.",
    "horror-gothic": "A spine-chilling choice! Atmospheric dread, classic vampires, and cosmic horror rest within these folios. Step right this way to the Gothic Horror shelf.",
    "fantasy": "A magical choice! Realms of dragons, wizards, high magic, and epic quests await you. Follow me to the High Fantasy shelf.",
    "dystopian": "A captivating choice! Exploring dark futures and cautionary tales opens our eyes. Follow me to the Dystopian shelf.",
    "biography": "An inspiring choice! Learning from the extraordinary lives and achievements of great legends is a rich endeavor. Follow me to the Biography shelf.",
    "classics": "A timeless choice! The immortal masterworks of world literature will enrich your intellect. Follow me to the World Classics shelf.",
    "health-wellness": "A vital choice! Nurturing your body, breath, sleep, and longevity is essential for a peaceful life. Follow me to the Wellness shelf.",
    "romance-drama": "A touching choice! Deep emotion, passion, and human relationships shine in these pages. Follow me to the Romance shelf.",
    "poetry-ghazals": "A poetic choice! Beautiful verses, soul-stirring ghazals, and romantic stanzas await your heart. Follow me to the Poetry shelf.",
    "indian-literature": "A magnificent choice! India's rich storytelling and cultural masterworks come alive here. Follow me to the Indian Literature shelf.",
    "young-adult": "An adventurous choice! Stories of courage, youth, and epic journeys await. Follow me to the Coming of Age shelf."
}

def get_genre_compliment(genre_id, genre_name):
    return GENRE_COMPLIMENTS.get(
        genre_id,
        f"A great choice! Books of {genre_name} hold deep wisdom and inspiration. Allow me to lead you to their shelf."
    )

@app.route("/api/chat", methods=["POST"])
def api_chat():
    """AI-powered Head Librarian chat endpoint using Groq (llama-3.1-8b-instant)."""
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    
    if not message:
        return jsonify({
            "status": "unclear",
            "intent": "unknown",
            "bookId": None,
            "genreId": None,
            "shelfId": None,
            "shelfTier": "mid",
            "reply": "Speak your mind, traveler. What tome or subject do you seek in our library?"
        })

    norm_msg = normalize_text(message)

    # 0. Check for conversational greetings
    GREETINGS = [
        "hi", "hello", "hey", "namaste", "greetings", "good morning", "good evening", "good afternoon",
        "who are you", "how are you", "hello librarian", "hi librarian", "hey there", "hi there"
    ]
    if norm_msg in GREETINGS or any(norm_msg == g or norm_msg.startswith(g + " ") for g in GREETINGS):
        has_topic = any(kw in norm_msg for kw in GENRE_TOPIC_MAP.keys())
        if not has_topic:
            return jsonify({
                "status": "greeting",
                "intent": "greeting",
                "bookId": None,
                "genreId": None,
                "shelfId": None,
                "shelfTier": "mid",
                "reply": "Greetings, traveler of the written word. I am Master Keith, custodian of these ancient archives. What subject, sacred wisdom, or folio do you seek today?"
            })

    # 1. Check for "saved books" / "bookmarked books" intent
    if any(k in norm_msg for k in ["saved book", "saved folios", "bookmarked book", "my bookmarks", "my saved"]):
        return jsonify({
            "status": "matched",
            "intent": "saved_books",
            "bookId": None,
            "genreId": None,
            "shelfId": None,
            "shelfTier": "mid",
            "reply": "Ah, your personal collection of saved folios. Allow me to lead you to them."
        })

    # 2. Check for exact or strong book match first
    matched_book = find_exact_or_strong_book_match(message)
    is_info_q = any(t in norm_msg for t in ["who wrote", "tell me about", "author of", "summary of", "what is", "synopsis of"])

    if matched_book:
        genre_id = matched_book.get("genre")
        genre_obj = next((g for g in GENRES_CONFIG if g["id"] == genre_id), None)
        genre_name = genre_obj["name"] if genre_obj else genre_id.replace("-", " ").title()
        shelf_tier = genre_obj.get("shelfTier", "mid") if genre_obj else "mid"
        
        if is_info_q:
            author = matched_book.get("author", "Unknown Author")
            title = matched_book.get("title")
            desc = matched_book.get("description", "")
            if len(desc) > 180:
                desc = desc[:177] + "..."
            return jsonify({
                "status": "answer",
                "intent": "book_information",
                "bookId": matched_book["id"],
                "genreId": genre_id,
                "shelfId": genre_id,
                "shelfTier": shelf_tier,
                "reply": f"'{title}' was penned by {author}. In our {genre_name} archives: {desc}"
            })
        else:
            return jsonify({
                "status": "matched",
                "intent": "book",
                "bookId": matched_book["id"],
                "genreId": genre_id,
                "shelfId": genre_id,
                "shelfTier": shelf_tier,
                "reply": f"A great choice! '{matched_book.get('title')}' is an outstanding manuscript in our collection. Allow me to lead you to its shelf."
            })

    # 3. Check direct genre and topic matches locally before calling AI
    for topic_kw, target_genre_id in GENRE_TOPIC_MAP.items():
        if topic_kw in norm_msg:
            g_obj = next((g for g in GENRES_CONFIG if g["id"] == target_genre_id), None)
            if g_obj:
                compliment = get_genre_compliment(g_obj["id"], g_obj["name"])
                return jsonify({
                    "status": "matched",
                    "intent": "genre",
                    "bookId": None,
                    "genreId": g_obj["id"],
                    "shelfId": g_obj["id"],
                    "shelfTier": g_obj.get("shelfTier", "mid"),
                    "reply": compliment
                })

    for g in GENRES_CONFIG:
        g_name_norm = normalize_text(g["name"])
        g_id_norm = normalize_text(g["id"])
        if g_id_norm in norm_msg or (len(g_name_norm) > 3 and g_name_norm in norm_msg):
            compliment = get_genre_compliment(g["id"], g["name"])
            return jsonify({
                "status": "matched",
                "intent": "genre",
                "bookId": None,
                "genreId": g["id"],
                "shelfId": g["id"],
                "shelfTier": g.get("shelfTier", "mid"),
                "reply": compliment
            })

    # 4. Groq Natural-Language Classification
    groq_client = get_groq_client()
    if not groq_client:
        return jsonify({
            "status": "unclear",
            "intent": "unknown",
            "bookId": None,
            "genreId": None,
            "shelfId": None,
            "shelfTier": "mid",
            "reply": "The shelves are quiet tonight. (Please configure the GROQ_API_KEY environment variable on the server)."
        })

    available_genres = [
        {"id": g["id"], "name": g["name"], "category": g.get("category", ""), "description": g.get("description", "")}
        for g in GENRES_CONFIG
    ]

    all_books = get_all_books_flat()
    words = [w for w in norm_msg.split() if len(w) > 2]
    relevant_books = []
    for b in all_books:
        searchable = normalize_text(f"{b.get('title')} {b.get('author')} {b.get('genre')} {b.get('description')}")
        score = sum(1 for w in words if w in searchable)
        if score > 0:
            relevant_books.append((score, b))
    relevant_books.sort(key=lambda x: x[0], reverse=True)
    top_candidate_books = [
        {"id": b["id"], "title": b["title"], "author": b["author"], "genre": b["genre"]}
        for _, b in relevant_books[:12]
    ]

    system_prompt = f"""You are Master Keith, the elderly, knowledgeable Head Librarian of a mysterious Gothic library.
Your task is to analyze the visitor's request and determine their intent.

AVAILABLE REAL GENRES IN LIBRARY:
{json.dumps(available_genres, indent=2)}

TOP CANDIDATE REAL BOOKS IN LIBRARY:
{json.dumps(top_candidate_books, indent=2)}

RULES:
1. You MUST NOT invent any non-existent books, genres, authors, or IDs. Use ONLY real IDs from the lists above.
2. If the user asks for a specific topic (e.g. habits, discipline, growth, money, coding, scary, fantasy, philosophy, Indian stories), map to the best matching genreId or candidate bookId.
3. Keep your reply short (1-2 atmospheric, polite Gothic sentences), elderly and knowledgeable in tone.
4. Return ONLY a valid, raw JSON object (NO markdown backticks, NO extra text) matching this EXACT schema:
{{
  "status": "matched" | "answer" | "unclear",
  "intent": "book" | "genre" | "book_information" | "saved_books" | "unknown",
  "bookId": "<exact matching book id from candidate list, or null>",
  "genreId": "<exact matching genre id from available genres, or null>",
  "shelfId": "<exact matching genre id from available genres, or null>",
  "reply": "<short atmospheric librarian reply>"
}}
If no reasonable match exists, set status to "unclear", intent to "unknown", bookId/genreId/shelfId to null, and write a polite Gothic librarian response.
"""

    try:
        models_to_try = ["llama-3.3-70b-versatile", "llama3-8b-8192", "llama-3.1-8b-instant"]
        completion = None
        last_err = None
        for m in models_to_try:
            try:
                completion = groq_client.chat.completions.create(
                    model=m,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    temperature=0.3,
                    max_tokens=300
                )
                if completion:
                    break
            except Exception as e:
                last_err = e
                continue

        if not completion:
            raise last_err or Exception("All Groq models failed")

        raw_reply = (completion.choices[0].message.content or "").strip()

        # Guard: model returned empty output (Groq content-filter or empty generation)
        if not raw_reply:
            raise ValueError("Groq model returned an empty response (model output error).")

        if raw_reply.startswith("```"):
            raw_reply = re.sub(r'^```(?:json)?\n?', '', raw_reply)
            raw_reply = re.sub(r'\n?```$', '', raw_reply).strip()

        # Guard: still empty after stripping markdown fences
        if not raw_reply:
            raise ValueError("Groq model returned only markdown fences with no content.")

        parsed = json.loads(raw_reply)

        book_id = parsed.get("bookId")
        genre_id = parsed.get("genreId") or parsed.get("shelfId")
        
        valid_book = find_book_by_id(book_id) if book_id else None
        if valid_book:
            book_id = valid_book["id"]
            genre_id = valid_book["genre"]
        else:
            book_id = None

        valid_genre = next((g for g in GENRES_CONFIG if g["id"] == genre_id), None) if genre_id else None
        if valid_genre:
            genre_id = valid_genre["id"]
        else:
            genre_id = None

        shelf_tier = valid_genre.get("shelfTier", "mid") if valid_genre else "mid"

        status = parsed.get("status", "unclear")
        intent = parsed.get("intent", "unknown")
        reply = parsed.get("reply") or "I hear your voice echoing in these halls, but I could not place the folio you seek."

        if not valid_book and not valid_genre and status == "matched":
            status = "unclear"
            intent = "unknown"

        if status == "unclear" or not reply:
            reply = f"Ah, a subject we do not currently preserve in our archives. I have recorded your request for '{message}' in our library ledger, and we shall endeavor to acquire such folios soon."

        return jsonify({
            "status": status,
            "intent": intent,
            "bookId": book_id,
            "genreId": genre_id,
            "shelfId": genre_id,
            "shelfTier": shelf_tier,
            "reply": reply
        })

    except Exception as e:
        print("Groq API error:", e)
        return jsonify({
            "status": "unclear",
            "intent": "unknown",
            "bookId": None,
            "genreId": None,
            "shelfId": None,
            "shelfTier": "mid",
            "reply": f"Ah, a subject we do not currently preserve in our archives. I have recorded your request for '{message}' in our library ledger, and we shall endeavor to acquire such folios soon."
        })


# â”€â”€â”€ Run â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if __name__ == "__main__":
    print("BookHaven Gothic Library - Starting server...")
    cache = load_books_cache()
    total = sum(len(v) for v in cache.values())
    print(f"Loaded {total} books across {len(cache)} shelves into memory.")
    port = int(os.environ.get("PORT", 3000))
    print(f"Server ready! Open http://127.0.0.1:{port}")
    app.run(debug=True, host="0.0.0.0", port=port)
