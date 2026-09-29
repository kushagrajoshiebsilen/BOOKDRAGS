# BookHaven — Gothic Library Book Recommendation App 📚🏰

**BookHaven** is an immersive, interactive Gothic Library web application designed as a college project. It powers **540+ curated books** across **20 distinct library shelves**, complemented by an interactive virtual librarian (**Master Keith**), intelligent book recommendations, real-time search, and a rich visual aesthetic.

---

## ✨ Features

- 🏰 **Interactive Gothic Library Experience**: Atmospheric visual design with interactive book shelves, ambient soundscapes, and smooth modal inspections.
- 📚 **540+ Curated Books across 20 Shelves**: Covers Self-Development, Wealth & Business, Indian Classics, Epic Fantasy, Sci-Fi, Philosophy, Psychology, History, and more.
- 👨‍🏫 **Librarian Commentary & Reactions**: Personalized commentary from **Master Keith**, the virtual librarian, for any book or shelf action.
- 🎯 **Smart Content-Based Recommendations**: Fast, intelligent recommendation algorithm based on genre matching, author affinity, and ratings.
- 🔍 **Instant Search Engine**: Real-time multi-field search supporting titles, authors, genres, and descriptions.
- ⚡ **One-Click Desktop Launcher**: Launch the entire application with a single click using `start_site.bat` on port `3000`.

---

## 🛠️ Tech Stack & Architecture

- **Backend Framework**: Python (Flask)
- **Frontend**: HTML5, Modern Vanilla CSS3, JavaScript (ES6+)
- **Data Engine**: Optimized JSON cache (`books_cache.json`) loading 540+ enriched titles into memory
- **Server Port**: `3000` (`http://127.0.0.1:3000/`)

---

## 🚀 Quick Start & Installation

### Prerequisites

Ensure you have **Python 3.8+** installed on your system.

### 1. Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 2. Launch the Application

#### Option A: One-Click Launcher (Windows)
Simply double-click **`start_site.bat`** in the project folder. It will start the server and open `http://127.0.0.1:3000/` automatically in your default browser.

#### Option B: Terminal Command
Run the Python app directly from your terminal:

```bash
py app.py
```

Then open your browser and navigate to:
```
http://127.0.0.1:3000/
```

---

## 📡 API Endpoints

The Flask server provides clean JSON APIs for frontend consumption:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the main single-page application |
| `GET` | `/api/genres` | Retrieves all 20 shelf / genre definitions and layout metadata |
| `GET` | `/api/books` | Returns all 540+ books across all shelves |
| `GET` | `/api/books/<genre_id>` | Returns books filtered by specific shelf/genre ID |
| `GET` | `/api/librarian/greet` | Returns a friendly greeting from Master Keith |
| `GET` | `/api/librarian/comment/<book_id>` | Generates customized librarian commentary for a book |
| `GET` | `/api/recommendations/<book_id>` | Returns content-based recommendations for a given book |
| `GET` | `/api/search?q=<query>` | Searches books across title, author, description, and genre |

---

## 📂 Project Structure

```
.
├── app.py                      # Core Flask web server & API routes
├── start_site.bat              # One-click desktop launcher (Port 3000)
├── requirements.txt            # Python dependencies (Flask)
├── books_cache.json            # 540+ Enriched book dataset cache
├── enrich_500_books.py         # Shelf definitions & librarian generators
├── templates/
│   └── index.html              # Main application template
├── static/                     # CSS, JavaScript, background images & videos
└── README.md                   # Project documentation
```

---

## 👤 Author

Developed with ❤️ for College Project submission.
- **GitHub Repository**: [kushagrajoshiebsilen/BOOKDRAGS](https://github.com/kushagrajoshiebsilen/BOOKDRAGS)
