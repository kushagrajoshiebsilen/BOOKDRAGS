"""
BookHaven - Gothic Library Book Recommendation App
A Python Flask web application for college project.
Powers 540+ books across 20 distinct library shelves with friendly Librarian commentary & recommendations.
"""

from flask import Flask, render_template, jsonify, request
import json
import os
import random

app = Flask(__name__)

BOOKS_CACHE_FILE = os.path.join(os.path.dirname(__file__), "books_cache.json")

# Import 20 shelves configuration & response generators
try:
    from enrich_500_books import GENRES_CONFIG, generate_librarian_comment, generate_action_response
except ImportError:
    GENRES_CONFIG = []
    def generate_librarian_comment(book, gname):
        return f"A notable book in our {gname} collection: {book.get('title')}."
    def generate_action_response(book, action):
        return f"Updated '{book.get('title')}'."


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
        "Hi there! What would you like to read today? What interests you â€” self-help, wealth and business, Indian classics, fiction, or philosophy?",
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


# â”€â”€â”€ Run â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if __name__ == "__main__":
    print("BookHaven Gothic Library - Starting server...")
    cache = load_books_cache()
    total = sum(len(v) for v in cache.values())
    print(f"Loaded {total} books across {len(cache)} shelves into memory.")
    print("Server ready! Open http://127.0.0.1:3000")
    app.run(debug=True, port=3000)
