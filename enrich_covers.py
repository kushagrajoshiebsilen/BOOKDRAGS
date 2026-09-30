"""
Progressive multi-threaded enrichment for books_cache.json with real Open Library book covers.
"""
import json
import urllib.parse
import urllib.request
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

GENRE_FALLBACK_COVERS = {
    "hindu-scriptures": "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500&auto=format&fit=crop&q=80",
    "self-help": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
    "self-development": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=80",
    "business-finance": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80",
    "indian-literature": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=80",
    "ancient-wisdom": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=80",
    "psychology": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=80",
    "philosophy": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=80",
    "history-chronicles": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=500&auto=format&fit=crop&q=80",
    "science": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80",
    "technology": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
    "crime-thriller": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    "horror-gothic": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=80",
    "mythology": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    "fantasy": "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=500&auto=format&fit=crop&q=80",
    "dystopian": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80",
    "biography": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80",
    "classics": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80",
    "health-wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80",
    "romance-drama": "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500&auto=format&fit=crop&q=80",
    "poetry-ghazals": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&auto=format&fit=crop&q=80",
    "young-adult": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=80"
}

DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80"

lock = threading.Lock()

def fetch_cover_for_book(book, genre_id):
    title = book.get("title", "")
    author = book.get("author", "")
    clean_title = title.split(":")[0].split("(")[0].strip()
    q = urllib.parse.quote(f"{clean_title} {author}".strip())
    url = f"https://openlibrary.org/search.json?q={q}&limit=1"
    
    fallback_cover = GENRE_FALLBACK_COVERS.get(genre_id, DEFAULT_FALLBACK)
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "BookHavenApp/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            docs = data.get("docs", [])
            if docs and "cover_i" in docs[0]:
                cover_id = docs[0]["cover_i"]
                book["coverUrl"] = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                return True
    except Exception:
        pass

    book["coverUrl"] = fallback_cover
    return False

def save_cache(cache):
    with lock:
        with open("books_cache.json", "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)

def main():
    print("Loading books_cache.json...")
    with open("books_cache.json", "r", encoding="utf-8") as f:
        cache = json.load(f)

    all_tasks = []
    for genre_id, books in cache.items():
        for book in books:
            all_tasks.append((book, genre_id))

    total = len(all_tasks)
    print(f"Fetching covers for {total} books with 15 parallel workers...")

    found = 0
    fallback = 0
    completed = 0

    with ThreadPoolExecutor(max_workers=15) as executor:
        futures = {executor.submit(fetch_cover_for_book, b, g): b for b, g in all_tasks}
        for future in as_completed(futures):
            completed += 1
            is_real = future.result()
            if is_real:
                found += 1
            else:
                fallback += 1
            if completed % 25 == 0 or completed == total:
                save_cache(cache)
                print(f"Progress: [{completed}/{total}] — Found real cover: {found}, Fallbacks: {fallback}")

    save_cache(cache)
    print("\n==========================================")
    print(f"SUCCESS! Updated covers for {total} books.")
    print(f"Real Open Library Covers: {found}")
    print(f"Genre High-Res Fallbacks: {fallback}")
    print("==========================================")

if __name__ == "__main__":
    main()
