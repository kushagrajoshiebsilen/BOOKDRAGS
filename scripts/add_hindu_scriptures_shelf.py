"""
Add dedicated 'hindu-scriptures' shelf containing all Vedas, Bhagavad Gita, Upanishads, Epics & Puranas to BookHaven.
"""
import json
import re

hindu_scriptures_books = [
  {
    "id": "hs-001",
    "title": "Rigveda: The Book of Eternal Hymns",
    "author": "Maharishi Veda Vyasa & Ancient Rishis",
    "description": "The oldest sacred text of Sanatana Dharma and human civilization. Contains 1,028 divine hymns dedicated to Agni, Indra, Varuna, and the Cosmic Cosmic Order (Rta).",
    "pageCount": 1120,
    "rating": 5.0,
    "publishedYear": "1500 BCE",
    "publisher": "Motilal Banarsidass",
    "librarianComment": "The Rigveda is the foundational pillar of ancient wisdom. Its 1,028 hymns capture the primal awe of creation, divine light, and the eternal laws governing the cosmos."
  },
  {
    "id": "hs-002",
    "title": "Samaveda: The Veda of Sacred Chants & Melodies",
    "author": "Maharishi Veda Vyasa",
    "description": "The Veda of sacred music and divine chanting. Sets the verses of the Rigveda to celestial musical notes, forming the origin of classical Indian music.",
    "pageCount": 540,
    "rating": 4.9,
    "publishedYear": "1200 BCE",
    "publisher": "Chowkhamba Sanskrit Series",
    "librarianComment": "Lord Krishna Himself states in the Bhagavad Gita: 'Among the Vedas, I am the Samaveda.' It elevates prayer into sublime celestial music."
  },
  {
    "id": "hs-003",
    "title": "Yajurveda: The Veda of Sacrificial Wisdom & Rituals",
    "author": "Maharishi Veda Vyasa (Shukla & Krishna Recensions)",
    "description": "The sacred guidebook for Vedic rituals, Yagyas, mantras, and meditative offerings. Divided into Shukla (White) and Krishna (Black) Yajurveda.",
    "pageCount": 850,
    "rating": 4.9,
    "publishedYear": "1100 BCE",
    "publisher": "Munshiram Manoharlal",
    "librarianComment": "The Yajurveda transforms outward ritual into inner spiritual sacrifice, containing the sacred Isha Upanishad and Shatapatha Brahmana."
  },
  {
    "id": "hs-004",
    "title": "Atharvaveda: The Veda of Healing, Charms & Everyday Life",
    "author": "Rishi Atharvan & Rishi Angiras",
    "description": "The Veda of daily living, Ayurvedic medicine, protection mantras, statecraft, and profound cosmological hymns including the Prithvi Sukta.",
    "pageCount": 920,
    "rating": 4.9,
    "publishedYear": "1000 BCE",
    "publisher": "Eastern Book Linkers",
    "librarianComment": "Atharvaveda connects high spiritual metaphysics with practical wellness, medicine, and deep reverence for Mother Earth in the Prithvi Sukta."
  },
  {
    "id": "hs-005",
    "title": "Srimad Bhagavad Gita: The Song of God",
    "author": "Sri Krishna & Maharishi Veda Vyasa",
    "description": "The 700-verse divine dialogue between Bhagavan Sri Krishna and Arjuna on the battlefield of Kurukshetra, illuminating Karma Yoga, Bhakti Yoga, and Jnana Yoga.",
    "pageCount": 420,
    "rating": 5.0,
    "publishedYear": "3000 BCE",
    "publisher": "Gita Press Gorakhpur",
    "librarianComment": "The Bhagavad Gita is the essence of all Upanishadic wisdom. In just 18 chapters, Sri Krishna reveals how to live without fear, master your mind, and achieve supreme liberation."
  },
  {
    "id": "hs-006",
    "title": "The Principal Upanishads",
    "author": "Ancient Vedic Seers (Ed. Dr. S. Radhakrishnan)",
    "description": "The 108 philosophical treatises revealing the ultimate non-dual reality (Brahman) and the inner divine Self (Atman). Features Isha, Kena, Katha, Chandogya, and Brihadaranyaka.",
    "pageCount": 958,
    "rating": 5.0,
    "publishedYear": "800 BCE",
    "publisher": "HarperCollins / Motilal Banarsidass",
    "librarianComment": "The Upanishads contain the sublime Mahavakyas: 'Tat Tvam Asi' (That Thou Art) and 'Aham Brahmasmi'. They represent the peak of human philosophical inquiry."
  },
  {
    "id": "hs-007",
    "title": "The Valmiki Ramayana",
    "author": "Maharishi Valmiki",
    "description": "The immortal Adi Kavya epic detailing the noble life, righteousness (Dharma), and heroic saga of Bhagavan Sri Rama, Devi Sita, and Shri Hanuman.",
    "pageCount": 1450,
    "rating": 5.0,
    "publishedYear": "5000 BCE",
    "publisher": "Gita Press Gorakhpur",
    "librarianComment": "Valmiki's Ramayana is the heartbeat of Indian culture. It illustrates Maryada (righteous boundaries), filial devotion, and the ultimate victory of truth over evil."
  },
  {
    "id": "hs-008",
    "title": "The Mahabharata (18 Parvas Complete)",
    "author": "Maharishi Veda Vyasa",
    "description": "The world's greatest epic comprising 100,000 verses. Explores righteousness, duty, royal conflict, philosophy, and destiny through the Kuru dynasty.",
    "pageCount": 3200,
    "rating": 5.0,
    "publishedYear": "3000 BCE",
    "publisher": "Bhandarkar Oriental Research Institute",
    "librarianComment": "It is rightly said: 'What is found here may be found elsewhere, but what is not found here is nowhere else.' A masterwork on human nature and cosmic order."
  },
  {
    "id": "hs-009",
    "title": "Srimad Bhagavatam (Bhagavata Purana)",
    "author": "Maharishi Veda Vyasa",
    "description": "The crown jewel of Puranic literature detailing the 24 Avatara divine incarnations of Lord Vishnu, the lilas of Sri Krishna, and devotion (Bhakti).",
    "pageCount": 1800,
    "rating": 5.0,
    "publishedYear": "1000 BCE",
    "publisher": "Gita Press Gorakhpur",
    "librarianComment": "Srimad Bhagavatam is pure nectar for the spiritual seeker. It transforms philosophical abstraction into profound emotional devotion and divine ecstasy."
  },
  {
    "id": "hs-010",
    "title": "The Shiva Purana",
    "author": "Maharishi Veda Vyasa",
    "description": "The sacred purana celebrating the cosmic dance, meditation, origins, Jyotirlingas, and grace of Bhagavan Shiva and Goddess Parvati.",
    "pageCount": 1100,
    "rating": 4.9,
    "publishedYear": "800 BCE",
    "publisher": "Motilal Banarsidass",
    "librarianComment": "The Shiva Purana explores Mahadeva as both the unmanifest transcendent void and the compassionate Lord of Mount Kailash."
  },
  {
    "id": "hs-011",
    "title": "The Vishnu Purana",
    "author": "Rishi Parashara & Veda Vyasa",
    "description": "One of the most authentic Puranas describing the creation of the cosmos, the Manvantaras, the genealogies of kings, and the preserver Lord Vishnu.",
    "pageCount": 780,
    "rating": 4.9,
    "publishedYear": "500 BCE",
    "publisher": "Punthi Pustak",
    "librarianComment": "Rishi Parashara's exposition is prized by scholars for its detailed cosmology, time cycles (Yugas), and vivid narrative structure."
  },
  {
    "id": "hs-012",
    "title": "Devi Mahatmyam & Markandeya Purana",
    "author": "Maharishi Markandeya",
    "description": "The sacred 700 verses (Durga Saptashati) depicting the victory of Supreme Goddess Durga over Mahishasura, symbolizing the destruction of ego.",
    "pageCount": 650,
    "rating": 5.0,
    "publishedYear": "400 CE",
    "publisher": "Sri Ramakrishna Math",
    "librarianComment": "Devi Mahatmyam is the core scripture of Shaktism, exalting the Divine Mother as the supreme cosmic energy (Parashakti) protecting all creation."
  },
  {
    "id": "hs-013",
    "title": "Yoga Sutras of Patanjali",
    "author": "Maharishi Patanjali",
    "description": "The 196 aphorisms outlining Ashtanga Yoga (8 limbs of yoga), mind control, Samadhi, and spiritual liberation.",
    "pageCount": 240,
    "rating": 4.9,
    "publishedYear": "400 CE",
    "publisher": "Advaita Ashrama",
    "librarianComment": "Patanjali defines yoga as 'Yogas Chitta Vritti Nirodha' — the stilling of the fluctuations of the mind. A scientific manual for consciousness."
  },
  {
    "id": "hs-014",
    "title": "The Ashtavakra Gita",
    "author": "Sage Ashtavakra & King Janaka",
    "description": "The uncompromising Advaita Vedanta text revealing immediate enlightenment, self-realization, and detachment from worldly illusions.",
    "pageCount": 180,
    "rating": 4.9,
    "publishedYear": "500 BCE",
    "publisher": "Sri Ramakrishna Math",
    "librarianComment": "Ashtavakra Gita speaks directly to pure awareness. It removes all mental concepts, urging you to realize right now that you are free."
  },
  {
    "id": "hs-015",
    "title": "The Yoga Vasistha",
    "author": "Sage Vasistha & Sri Rama",
    "description": "A profound philosophical dialogue where Sage Vasistha instructs young Prince Rama on the illusory nature of the world, Maya, and enlightenment.",
    "pageCount": 1400,
    "rating": 5.0,
    "publishedYear": "600 CE",
    "publisher": "SUNY Press / Motilal Banarsidass",
    "librarianComment": "Yoga Vasistha is filled with captivating allegories and deep metaphysical insights on mind, space, time, and supreme realization."
  },
  {
    "id": "hs-016",
    "title": "Chanakya Neeti & Arthashastra",
    "author": "Acharya Chanakya (Kautilya)",
    "description": "The ancient treatise on statecraft, diplomacy, political strategy, economics, ethics, and leadership by the mentor of Chandragupta Maurya.",
    "pageCount": 450,
    "rating": 4.8,
    "publishedYear": "300 BCE",
    "publisher": "Jaico Publishing House",
    "librarianComment": "Chanakya's maxims remain sharp and practical to this day. A classic guide on governance, shrewd strategy, and personal wisdom."
  },
  {
    "id": "hs-017",
    "title": "Manusmriti & The Dharma Shastras",
    "author": "Maharishi Manu",
    "description": "Ancient legal and ethical treatise examining duty, governance, social organization, and righteousness across cosmic ages.",
    "pageCount": 520,
    "rating": 4.5,
    "publishedYear": "200 BCE",
    "publisher": "Clarendon Press / Oxford",
    "librarianComment": "An important historical code of law and societal ethics from ancient India, reflecting the intricate social ideals of its era."
  },
  {
    "id": "hs-018",
    "title": "The Garuda Purana",
    "author": "Maharishi Veda Vyasa",
    "description": "The sacred Purana detailing the soul's journey after death, Karma, reincarnation, funeral rites (Preta Kalpa), and liberation.",
    "pageCount": 480,
    "rating": 4.7,
    "publishedYear": "700 CE",
    "publisher": "Motilal Banarsidass",
    "librarianComment": "Garuda Purana answers the eternal questions about life, death, karmic consequences, and how the soul transitions between realms."
  },
  {
    "id": "hs-019",
    "title": "The Skanda Purana",
    "author": "Maharishi Veda Vyasa",
    "description": "The largest Purana celebrating Lord Murugan (Kartikeya), Kashi, Kedarnath, Rameswaram, and the sacred geography of India.",
    "pageCount": 1600,
    "rating": 4.8,
    "publishedYear": "800 CE",
    "publisher": "Motilal Banarsidass",
    "librarianComment": "A grand pilgrimage through India's holy places, rich in stories of Lord Murugan, Shiva's temples, and spiritual penance."
  },
  {
    "id": "hs-020",
    "title": "The Agni Purana",
    "author": "Maharishi Veda Vyasa",
    "description": "An encyclopedic Purana delivered by Agni Dev, covering architecture, temple arts, medicine, warfare, grammar, and devotion.",
    "pageCount": 890,
    "rating": 4.8,
    "publishedYear": "800 CE",
    "publisher": "Chowkhamba",
    "librarianComment": "Agni Purana is a vast compendium of ancient Indian science, martial strategy, architecture, and spiritual rituals."
  },
  {
    "id": "hs-021",
    "title": "Narada Bhakti Sutras",
    "author": "Devarshi Narada",
    "description": "84 exquisite aphorisms on the nature of supreme divine love (Parabhakti), self-surrender, and spiritual devotion.",
    "pageCount": 140,
    "rating": 4.9,
    "publishedYear": "600 CE",
    "publisher": "Sri Ramakrishna Math",
    "librarianComment": "Devarshi Narada describes true devotion as love that asks for nothing in return — constant, joyful, and completely transforming."
  },
  {
    "id": "hs-022",
    "title": "Ramcharitmanas",
    "author": "Goswami Tulsidas",
    "description": "The beloved Awadhi poetic retelling of Rama's life, renowned for its devotional sweetness, Chaupais, and Hanuman Chalisa.",
    "pageCount": 1050,
    "rating": 5.0,
    "publishedYear": "1574 CE",
    "publisher": "Gita Press Gorakhpur",
    "librarianComment": "Tulsidas brought the divine story of Sri Rama into the hearts and homes of millions through sweet, poetic devotion."
  },
  {
    "id": "hs-023",
    "title": "The Brahma Sutras",
    "author": "Maharishi Veda Vyasa (Ed. Adi Shankara)",
    "description": "455 concise sutras synthesizing Upanishadic teachings into a logical framework of Vedantic truth.",
    "pageCount": 840,
    "rating": 4.9,
    "publishedYear": "400 BCE",
    "publisher": "Advaita Ashrama",
    "librarianComment": "The Brahma Sutras, together with the Upanishads and Bhagavad Gita, form the Prasthanatrayi — the triple foundation of Hindu philosophy."
  },
  {
    "id": "hs-024",
    "title": "The Avadhuta Gita",
    "author": "Sage Dattatreya",
    "description": "Song of the Free. The fiery non-dual proclamation of Dattatreya declaring the unconditioned unity of all existence.",
    "pageCount": 160,
    "rating": 4.9,
    "publishedYear": "800 CE",
    "publisher": "Sri Ramakrishna Math",
    "librarianComment": "Dattatreya sings of pure freedom beyond birth, death, caste, or dogma. Essential reading for seekers of Non-Dual Truth."
  },
  {
    "id": "hs-025",
    "title": "Thirukkural",
    "author": "Thiruvalluvar",
    "description": "1,330 Tamil couplets organized into Aram (Virtue), Porul (Wealth), and Inbam (Love), recognized universally as a secular moral masterwork.",
    "pageCount": 380,
    "rating": 4.9,
    "publishedYear": "300 BCE",
    "publisher": "International Institute of Tamil Studies",
    "librarianComment": "Thirukkural provides practical ethical guidance for kings, householders, and spiritual seekers alike, transcending sectarian boundaries."
  },
  {
    "id": "hs-026",
    "title": "Lalita Sahasranama & Saundarya Lahari",
    "author": "Sage Agastya / Adi Shankara",
    "description": "1,000 sacred names and mystical hymns praising the Supreme Mother Goddess Lalita Tripurasundari and Kundalini Shakti.",
    "pageCount": 320,
    "rating": 5.0,
    "publishedYear": "700 CE",
    "publisher": "Sri Ramakrishna Math",
    "librarianComment": "A sublime poetic and tantric masterpiece celebrating the Mother Goddess as the creative power of supreme consciousness."
  },
  {
    "id": "hs-027",
    "title": "The Agama Shastras & Mahanirvana Tantra",
    "author": "Ancient Tantric Seers",
    "description": "Foundational texts governing temple construction, Yantra geometry, Mantra initiation, and holistic worship in Shaiva, Shakta, and Vaishnava traditions.",
    "pageCount": 750,
    "rating": 4.8,
    "publishedYear": "800 CE",
    "publisher": "Ganesh & Co.",
    "librarianComment": "The Agamas provide the exact architectural, ritual, and esoteric instructions for consecrating sacred temples and deity icons."
  }
]

# 1. Update books_cache.json
with open("books_cache.json", "r", encoding="utf-8") as f:
    cache = json.load(f)

for b in hindu_scriptures_books:
    b["genre"] = "hindu-scriptures"
    b["coverUrl"] = f"https://books.google.com/books/content?id={b['id']}&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    title_clean = b["title"].replace(" ", "+")
    author_clean = b.get("author", "Author").split()[0]
    b["externalUrl"] = f"https://www.google.com/search?tbm=bks&q={title_clean}+{author_clean}"

cache["hindu-scriptures"] = hindu_scriptures_books

with open("books_cache.json", "w", encoding="utf-8") as f:
    json.dump(cache, f, indent=2, ensure_ascii=False)

total_books = sum(len(v) for v in cache.values())
print(f"Updated books_cache.json with hindu-scriptures! Total shelves: {len(cache)}, Total books: {total_books}")

# 2. Update GENRES_CONFIG in enrich_500_books.py if not already present
with open("enrich_500_books.py", "r", encoding="utf-8") as f:
    code = f.read()

new_genre_def = {
    "id": "hindu-scriptures",
    "name": "Hindu Scriptures & Sacred Epics",
    "category": "Sacred Epics & Scriptures",
    "shelfTier": "upper",
    "shelfColumn": 2,
    "description": "Sanatana Dharma's sacred library containing all 4 Vedas, Bhagavad Gita, Upanishads, Valmiki Ramayana, Vyasa Mahabharata, and Puranas.",
    "librarianGreeting": "Namaste seeker. Welcome to the Sacred Hindu Scriptures collection! Here rest the 4 eternal Vedas, the Srimad Bhagavad Gita, Upanishads, Valmiki Ramayana, Vyasa Mahabharata, and the Holy Puranas."
}

if '"id": "hindu-scriptures"' not in code:
    # Append to GENRES_CONFIG array in code
    insert_str = json.dumps(new_genre_def, indent=8) + ",\n"
    code = code.replace("GENRES_CONFIG = [\n", "GENRES_CONFIG = [\n    " + insert_str)
    with open("enrich_500_books.py", "w", encoding="utf-8") as f:
        f.write(code)
    print("Added hindu-scriptures to GENRES_CONFIG in enrich_500_books.py!")
else:
    print("hindu-scriptures already present in enrich_500_books.py.")

