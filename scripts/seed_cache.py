"""Seed the books_cache.json from existing React books.json data."""
import json

with open("src/data/books.json", "r", encoding="utf-8") as f:
    books = json.load(f)

# Group by genre
cache = {}
for book in books:
    genre = book.get("genre", "unknown")
    if genre not in cache:
        cache[genre] = []
    
    # Normalize field names
    entry = {
        "id": book.get("id", ""),
        "title": book.get("title", "Untitled"),
        "author": book.get("author", "Unknown"),
        "genre": genre,
        "coverUrl": book.get("coverUrl", ""),
        "description": book.get("description", ""),
        "externalUrl": book.get("sourceUrl", book.get("externalUrl", "")),
        "pageCount": book.get("pageCount", 280),
        "publisher": book.get("publisher", "Google Books"),
        "rating": book.get("rating", 4.7),
        "publishedYear": str(book.get("publishedYear", "1888"))
    }
    cache[genre].append(entry)

with open("books_cache.json", "w", encoding="utf-8") as f:
    json.dump(cache, f, indent=2, ensure_ascii=False)

total = sum(len(v) for v in cache.values())
print(f"Seeded {total} books across {len(cache)} genres into books_cache.json")
