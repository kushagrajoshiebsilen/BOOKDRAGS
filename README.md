# BookHaven — The Gothic Library

An immersive, cinematic Gothic library experience for book discovery and recommendations. Browse 540+ books across 20 themed shelves, navigate with animated librarian transitions, and chat with Master Keith — an AI-powered Head Librarian — to find your next read.

---

## Features

- 🏛️ **Panoramic Gothic Library** — scrollable 200vw canvas with West & East wings
- 📚 **540+ Books** across 20 genres (Self-Help, Hindu Scriptures, Fantasy, Horror, Business, Philosophy, and more)
- 🤖 **AI Librarian (Master Keith)** — powered by Groq (LLaMA 3) for natural-language book and shelf navigation
- 🎬 **Cinematic Transitions** — librarian movement videos between shelves
- 🔖 **Bookmark System** — save books with glowing shelf indicators
- 🔍 **Search** — full-text search across all 540+ books

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| AI | Groq API (LLaMA 3.3 70B / LLaMA 3.1 8B) |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Catalogue | JSON (`books_cache.json`) |
| Deployment | Render.com (`render.yaml`) / Vercel (`vercel.json`) |

---

## Project Structure

```
book recommendation/
│
├── app.py                    ← Flask backend (ALL routes, Groq AI, catalogue)
├── enrich_500_books.py       ← Genre config + librarian commentary generator
├── books_cache.json          ← Authoritative catalogue (540+ books, 20 genres)
│
├── templates/
│   └── index.html            ← Main application HTML
│
├── static/
│   ├── css/style.css         ← All application CSS
│   ├── js/app.js             ← All application JavaScript
│   └── assets/               ← Images (5) + Videos (2)
│
├── scripts/                  ← One-off data generation scripts (not part of runtime)
│   ├── build_full_540_books.py
│   ├── generate_books.py
│   ├── add_hindu_scriptures_shelf.py
│   ├── add_self_development_shelf.py
│   ├── enrich_covers.py
│   ├── update_all_book_covers.py
│   ├── seed_cache.py
│   └── books_cache_seed.json
│
├── archive/
│   └── react-prototype/      ← Earlier React/Vite frontend (archived, not in use)
│
├── requirements.txt          ← Python dependencies
├── render.yaml               ← Render.com deployment
├── vercel.json               ← Vercel deployment
├── start_site.bat            ← Windows quick-start script
├── .env                      ← Secret config (NOT committed to Git)
├── .env.example              ← Variable names only (safe to commit)
├── .gitignore
└── README.md
```

---

## Installation & Running

### 1. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

Create a `.env` file (copy from `.env.example`):

```
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com).

### 3. Run the server

```bash
python app.py
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for AI librarian (LLaMA 3) |
| `PORT` | No | Server port (default: 3000) |

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the main library UI |
| `GET` | `/api/genres` | All 20 genre/shelf definitions |
| `GET` | `/api/books` | All 540+ books |
| `GET` | `/api/books/<genre_id>` | Books for a specific shelf |
| `GET` | `/api/search?q=<query>` | Full-text book search |
| `POST` | `/api/chat` | AI librarian chat (Groq) |
| `GET` | `/api/librarian/greet` | Librarian greeting |
| `GET` | `/api/librarian/comment/<book_id>` | Commentary on a specific book |
| `GET` | `/api/recommendations/<book_id>` | Similar book recommendations |

---

## Deployment

### Render.com
Push to GitHub. Render uses `render.yaml` automatically — no extra config needed.

### Vercel
Push to GitHub. Vercel uses `vercel.json` — set `GROQ_API_KEY` in Vercel environment settings.

---

## Notes

- The `scripts/` folder contains one-off Python scripts used to build the catalogue. They are not part of the runtime.
- The `archive/react-prototype/` folder is an earlier React/Vite frontend that was superseded by the current Flask/Vanilla implementation.
