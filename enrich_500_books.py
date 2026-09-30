"""
Curated Configuration and Helpers for BookHaven's 20 Shelves and 540+ Books.
Provides friendly, easy-to-understand Librarian advice and personalized responses for every book.
"""

GENRES_CONFIG = [
    {
        "id": "hindu-scriptures",
        "name": "Hindu Scriptures & Sacred Epics",
        "category": "Sacred Epics & Scriptures",
        "shelfTier": "upper",
        "shelfColumn": 2,
        "description": "Sanatana Dharma's sacred library containing all 4 Vedas, Bhagavad Gita, Upanishads, Valmiki Ramayana, Vyasa Mahabharata, and Puranas.",
        "librarianGreeting": "Namaste seeker. Welcome to the Sacred Hindu Scriptures collection! Here rest the 4 eternal Vedas, the Srimad Bhagavad Gita, Upanishads, Valmiki Ramayana, Vyasa Mahabharata, and the Holy Puranas."
},
    {
        "id": "self-help",
        "name": "Self-Help & Habits",
        "category": "Personal Growth",
        "shelfTier": "upper",
        "shelfColumn": 1,
        "description": "Practical guides on building good habits, finding purpose, staying positive, and achieving goals.",
        "librarianGreeting": "Welcome to Self-Help! Here you'll find books on building great habits and finding your life purpose, like Ikigai and Atomic Habits."
    },
    {
        "id": "self-development",
        "name": "Self-Development & Mastery",
        "category": "Personal Growth",
        "shelfTier": "mid",
        "shelfColumn": 1,
        "description": "Master your mindset, discipline, leadership, and emotional toughness with David Goggins, Robert Greene, and Jordan Peterson.",
        "librarianGreeting": "Welcome to Self-Development! From David Goggins' mental toughness to Robert Greene's laws of power and mastery, these books build unstoppable discipline."
    },
    {
        "id": "business-finance",
        "name": "Money & Business",
        "category": "Finance & Wealth",
        "shelfTier": "mid",
        "shelfColumn": 1,
        "description": "Understand money, investing, building businesses, and financial independence.",
        "librarianGreeting": "Looking to master money? Here are top books on investing, wealth, and entrepreneurship like Rich Dad Poor Dad and Psychology of Money."
    },
    {
        "id": "indian-literature",
        "name": "Indian Masterpieces",
        "category": "Indian Classics",
        "shelfTier": "lower",
        "shelfColumn": 1,
        "description": "Celebrated stories and novels from India's greatest authors, capturing real life, culture, and history.",
        "librarianGreeting": "A wonderful collection of Indian literature! You'll find Malgudi Days, Train to Pakistan, The Guide, and more here."
    },
    {
        "id": "ancient-wisdom",
        "name": "Vedic & Ancient Epics",
        "category": "Wisdom & Epics",
        "shelfTier": "upper",
        "shelfColumn": 2,
        "description": "Timeless wisdom from ancient India, including the Bhagavad Gita, Mahabharata, Ramayana, and Chanakya Neeti.",
        "librarianGreeting": "Timeless wisdom from ancient India. These pages hold the Bhagavad Gita, Mahabharata, and Chanakya's strategies."
    },
    {
        "id": "psychology",
        "name": "Mind & Human Behavior",
        "category": "Human Science",
        "shelfTier": "mid",
        "shelfColumn": 2,
        "description": "Discover how the human mind thinks, why we make decisions, and how to overcome mental hurdles.",
        "librarianGreeting": "Ever wonder how our minds make decisions? These books explore psychology, habits of thought, and emotional resilience."
    },
    {
        "id": "philosophy",
        "name": "Philosophy & Stoicism",
        "category": "Philosophy",
        "shelfTier": "lower",
        "shelfColumn": 2,
        "description": "Ancient and modern thinkers on how to live calmly, handle difficulties, and find peace of mind.",
        "librarianGreeting": "Looking for calmness and mental peace? Stoic thinkers like Marcus Aurelius and Seneca have timeless advice for you."
    },
    {
        "id": "history-chronicles",
        "name": "History & Chronicles",
        "category": "History",
        "shelfTier": "upper",
        "shelfColumn": 3,
        "description": "Fascinating histories of India, world empires, civilizations, and the big events that shaped our world.",
        "librarianGreeting": "History comes alive here! Discover Jawaharlal Nehru's Discovery of India, Ramachandra Guha's India After Gandhi, and more."
    },
    {
        "id": "science",
        "name": "Science & Space",
        "category": "Science",
        "shelfTier": "mid",
        "shelfColumn": 3,
        "description": "Exciting books on astrophysics, evolution, the universe, and the great discoveries of science.",
        "librarianGreeting": "Curious about the cosmos? Carl Sagan, Stephen Hawking, and modern scientists explain the secrets of our universe."
    },
    {
        "id": "technology",
        "name": "Python, Coding & Tech",
        "category": "Technology",
        "shelfTier": "lower",
        "shelfColumn": 3,
        "description": "The best programming guides, including Python fundamentals, clean coding, and how modern algorithms work.",
        "librarianGreeting": "For programmers and tech lovers! We have classic Python books like Fluent Python and Automate the Boring Stuff."
    },
    {
        "id": "crime-thriller",
        "name": "Mystery & Detectives",
        "category": "Thrillers",
        "shelfTier": "upper",
        "shelfColumn": 4,
        "description": "Sherlock Holmes, Satyajit Ray's Feluda, Byomkesh Bakshi, Agatha Christie, and gripping whodunits.",
        "librarianGreeting": "Ready to solve a mystery? From Sherlock Holmes to Feluda and Byomkesh Bakshi, these detective tales will keep you guessing."
    },
    {
        "id": "horror-gothic",
        "name": "Horror & Gothic",
        "category": "Dark Fiction",
        "shelfTier": "mid",
        "shelfColumn": 4,
        "description": "Spooky gothic classics and supernatural horror, featuring Frankenstein, Dracula, and ghost stories.",
        "librarianGreeting": "In the mood for some chills? You'll find spooky gothic classics here like Mary Shelley's Frankenstein and Dracula."
    },
    {
        "id": "mythology",
        "name": "Mythology & Legends",
        "category": "Myth & Magic",
        "shelfTier": "lower",
        "shelfColumn": 4,
        "description": "Amish Tripathi's Shiva Trilogy, Palace of Illusions, Greek myths, and tales of legendary gods and heroes.",
        "librarianGreeting": "Fascinating mythological stories! You'll love Amish Tripathi's Shiva Trilogy and Chitra Banerjee Divakaruni's Palace of Illusions."
    },
    {
        "id": "fantasy",
        "name": "Fantasy & Magic",
        "category": "Fantasy",
        "shelfTier": "upper",
        "shelfColumn": 5,
        "description": "Enter magical worlds filled with dragons, rings, epic quests, and heroic battles.",
        "librarianGreeting": "Love magical adventures? Step into Tolkien's Lord of the Rings, George R.R. Martin, and Brandon Sanderson's worlds."
    },
    {
        "id": "dystopian",
        "name": "Dystopian Sci-Fi",
        "category": "Sci-Fi",
        "shelfTier": "mid",
        "shelfColumn": 5,
        "description": "Thought-provoking stories about the future, technology, and society, like 1984 and Brave New World.",
        "librarianGreeting": "Eye-opening stories about the future. George Orwell's 1984 and Aldous Huxley's Brave New World are essential reading."
    },
    {
        "id": "biography",
        "name": "Biographies & Memoirs",
        "category": "Real Lives",
        "shelfTier": "lower",
        "shelfColumn": 5,
        "description": "The real life stories of extraordinary leaders, scientists, and visionaries who made history.",
        "librarianGreeting": "Real stories of inspiring people! Read Dr. APJ Abdul Kalam's Wings of Fire, Steve Jobs' life, and Nelson Mandela's journey."
    },
    {
        "id": "classics",
        "name": "World Classics",
        "category": "Classics",
        "shelfTier": "upper",
        "shelfColumn": 6,
        "description": "The most famous novels in world history — Dostoevsky, Tolstoy, Jane Austen, and Charles Dickens.",
        "librarianGreeting": "Timeless world classics! Dostoevsky's Crime and Punishment, Tolstoy's War and Peace, and Jane Austen await you."
    },
    {
        "id": "health-wellness",
        "name": "Health & Wellbeing",
        "category": "Health",
        "shelfTier": "mid",
        "shelfColumn": 6,
        "description": "Practical guides to better sleep, healthy breathing, nutrition, and daily vitality.",
        "librarianGreeting": "Want to boost your energy and health? These books show the science behind great sleep, proper breathing, and daily wellness."
    },
    {
        "id": "romance-drama",
        "name": "Romance & Drama",
        "category": "Romance",
        "shelfTier": "lower",
        "shelfColumn": 6,
        "description": "Heartfelt stories of love, emotional journeys, modern relationships, and unforgettable drama.",
        "librarianGreeting": "Heartwarming and emotional stories of romance and relationships, from Pride and Prejudice to modern favorites."
    },
    {
        "id": "poetry-ghazals",
        "name": "Poetry & Ghazals",
        "category": "Poetry",
        "shelfTier": "mid",
        "shelfColumn": 7,
        "description": "Soul-stirring poetry from Rabindranath Tagore, Mirza Ghalib, Harivansh Rai Bachchan, and Rumi.",
        "librarianGreeting": "Beautiful verses and ghazals! Enjoy Rabindranath Tagore's Gitanjali, Mirza Ghalib's poetry, and Harivansh Rai Bachchan's Madhushala."
    },
    {
        "id": "young-adult",
        "name": "Adventures & YA",
        "category": "Adventure",
        "shelfTier": "lower",
        "shelfColumn": 7,
        "description": "Exciting coming-of-age adventures, Percy Jackson, Ruskin Bond stories, and youthful quests.",
        "librarianGreeting": "Fun, exciting stories for all ages! Check out Percy Jackson adventures and Ruskin Bond's lovely stories of the Indian hills."
    }
]


def generate_librarian_comment(book, genre_name):
    """Generate clear, friendly, and helpful book recommendations in plain English."""
    title = book.get("title", "")
    author = book.get("author", "")
    t_lower = title.lower()

    if "ikigai" in t_lower:
        return "Ikigai is a wonderful, gentle book about the Japanese secret to a long, happy life. It teaches you how to find joy in your daily routine and wake up with a clear purpose every morning."
    elif "rich dad poor dad" in t_lower:
        return "Rich Dad Poor Dad is an eye-opening classic on personal finance. Robert Kiyosaki explains the difference between assets and liabilities in simple words that will completely change how you view money."
    elif "psychology of money" in t_lower:
        return "The Psychology of Money by Morgan Housel is easily one of the best books on wealth. It shows that being good with money isn't about being a math genius — it's all about your daily behavior and patience."
    elif "atomic habits" in t_lower:
        return "Atomic Habits by James Clear is a game-changer. It shows you how making tiny 1% improvements every single day can lead to massive positive changes in your life and career."
    elif "wings of fire" in t_lower:
        return "Wings of Fire is the deeply inspiring autobiography of Dr. A.P.J. Abdul Kalam. His journey from a humble village in Rameswaram to leading India's space program and becoming President will give you immense courage."
    elif "immortals of meluha" in t_lower or "shiva trilogy" in t_lower:
        return "Amish Tripathi's Shiva Trilogy brings Lord Shiva to life as a mortal hero who rises to become the Mahadev. It's packed with thrilling battles, philosophy, and Indian mythology."
    elif "bhagavad gita" in t_lower or "gita" in t_lower:
        return "The Bhagavad Gita is a timeless guide for life. Whenever you feel confused or stressed, Lord Krishna's conversation with Arjuna offers clear advice on doing your duty without anxiety."
    elif "malgudi days" in t_lower:
        return "Malgudi Days by R.K. Narayan is pure delight. It's filled with short, humorous, and heartwarming stories of Swami and everyday life in a fictional South Indian town."
    elif "palace of illusions" in t_lower:
        return "The Palace of Illusions tells the epic story of the Mahabharata from Panchaali's (Draupadi's) point of view. It is emotional, beautifully written, and deeply touching."
    elif "chanakya" in t_lower:
        return "Chanakya Neeti contains the sharp life lessons and strategies of India's greatest royal advisor, Chanakya. It teaches you how to read people and lead wisely."
    elif "subconscious mind" in t_lower:
        return "The Power of Your Subconscious Mind by Joseph Murphy shows how maintaining positive beliefs and visualization can help you overcome fear and reach your goals."
    elif "monk who sold his ferrari" in t_lower:
        return "Robin Sharma's The Monk Who Sold His Ferrari is a fable about a successful lawyer who burns out and finds true inner peace and happiness in the Himalayas."
    elif "frankenstein" in t_lower:
        return "Mary Shelley's Frankenstein is the famous gothic tale of a scientist who creates life, only to realize the devastating consequences of ambition without responsibility."
    elif "dracula" in t_lower:
        return "Bram Stoker's Dracula is the legendary vampire classic that started it all. Atmospheric, suspenseful, and full of eerie gothic chills."
    elif "beloved" in t_lower:
        return "Beloved by Toni Morrison is a deeply moving, Pulitzer Prize-winning masterpiece about memory, trauma, and family love. It is one of the most powerful books ever written."
    elif "sherlock holmes" in t_lower:
        return "Arthur Conan Doyle's Sherlock Holmes stories are the gold standard of detective fiction. Watching Holmes solve seemingly impossible crimes with pure deduction is always a treat."
    elif "autobiography of a yogi" in t_lower:
        return "Autobiography of a Yogi by Paramahansa Yogananda is a spiritual classic that has inspired millions worldwide, including Steve Jobs, with its warm stories of saints and self-realization."
    elif "sapiens" in t_lower:
        return "Sapiens by Yuval Noah Harari is a fascinating look at human history — how an insignificant ape became the master of planet Earth through the power of storytelling and cooperation."
    elif "clean code" in t_lower:
        return "Clean Code is a must-read for any programmer. It teaches you how to write readable, elegant software that your teammates will love working on."
    elif "fluent python" in t_lower or "automate the boring" in t_lower:
        return "A fantastic guide for Python developers! It teaches you practical, idiomatic Python so you can write clean code and automate everyday tasks easily."
    elif "gitanjali" in t_lower:
        return "Rabindranath Tagore's Gitanjali won the Nobel Prize for its breathtaking spiritual poems about love, nature, and communion with the divine."
    elif "can't hurt me" in t_lower or "cant hurt me" in t_lower:
        return "David Goggins' Can't Hurt Me is an incredible book on mental resilience. It shows that when your mind tells you you're completely exhausted, you're really only at 40% of your true capability."
    elif "12 rules for life" in t_lower:
        return "Jordan Peterson's 12 Rules for Life is a deeply practical guide to bringing order out of chaos, taking personal responsibility, and treating yourself like someone you're responsible for helping."
    elif "48 laws of power" in t_lower:
        return "Robert Greene's 48 Laws of Power is a gripping, ruthless historical analysis of power, leadership, and human nature throughout centuries of kings, generals, and politicians."
    elif "extreme ownership" in t_lower:
        return "Jocko Willink and Leif Babin translate combat battlefield lessons from Navy SEALs into everyday leadership: check your ego, take 100% responsibility, and never make excuses."
    elif "mountain is you" in t_lower:
        return "Brianna Wiest's The Mountain Is You is an eye-opening book on overcoming self-sabotage and learning how to step into your highest potential."
    elif "1984" in t_lower:
        return "George Orwell's 1984 is a classic warning about privacy, freedom of thought, and government surveillance that feels more relevant today than ever."
    else:
        return f"'{title}' by {author} is a highly rated book in our {genre_name} collection. It's well loved by readers for its engaging storytelling and practical insights."


def generate_action_response(book, action):
    """Personalized Librarian response when a user adds a book to the desk or bookmarks it."""
    title = book.get("title", "this book")
    author = book.get("author", "the author")
    t_lower = title.lower()

    if action == "reading":
        if "ikigai" in t_lower:
            return "Awesome choice! I've placed 'Ikigai' on your reading table. You're going to love learning the secrets to a long, happy life and finding your reason to jump out of bed every morning!"
        elif "rich dad poor dad" in t_lower:
            return "Great pick! I've set 'Rich Dad Poor Dad' on your reading table. It will give you a completely fresh, practical mindset on building assets and achieving financial independence."
        elif "can't hurt me" in t_lower or "cant hurt me" in t_lower:
            return "I've placed David Goggins' 'Can't Hurt Me' on your reading table! Get ready to shatter your mental limits."
        elif "12 rules for life" in t_lower:
            return "I've set Jordan Peterson's '12 Rules for Life' on your reading table! Stand up straight with your shoulders back and enjoy reading it."
        elif "48 laws of power" in t_lower:
            return "I've placed 'The 48 Laws of Power' on your reading table. Keep your wits sharp — Robert Greene's historical insights are captivating!"
        elif "extreme ownership" in t_lower:
            return "I've set 'Extreme Ownership' on your reading table! Discipline equals freedom."
        elif "mountain is you" in t_lower:
            return "I've placed 'The Mountain Is You' on your table. You're going to love its lessons on overcoming self-sabotage."
        elif "psychology of money" in t_lower:
            return "I've placed 'The Psychology of Money' on your reading desk! Morgan Housel's stories will give you a calm, smart perspective on wealth."
        elif "atomic habits" in t_lower:
            return "I've set 'Atomic Habits' on your desk! Focus on making small 1% improvements every day while reading this."
        elif "wings of fire" in t_lower:
            return "I've placed Dr. APJ Abdul Kalam's 'Wings of Fire' right on your reading desk. His journey from Rameswaram to the presidency is bound to inspire you deeply."
        elif "immortals of meluha" in t_lower or "shiva trilogy" in t_lower:
            return "I've placed 'The Immortals of Meluha' on your desk! Get ready for an epic journey through ancient India with Lord Shiva."
        elif "bhagavad gita" in t_lower or "gita" in t_lower:
            return "I've placed the 'Bhagavad Gita' on your table. A wonderful guide to read whenever you want clarity and inner strength."
        elif "malgudi days" in t_lower:
            return "I've placed R.K. Narayan's 'Malgudi Days' on your desk! Enjoy the heartwarming and funny adventures of simple village life."
        elif "palace of illusions" in t_lower:
            return "I've placed 'The Palace of Illusions' on your table. You will love seeing the Mahabharata through Panchaali's eyes."
        elif "beloved" in t_lower:
            return "I've placed 'Beloved' by Toni Morrison on your reading table. It's a poignant, powerful story that you will remember for years to come."
        elif "frankenstein" in t_lower:
            return "I've placed 'Frankenstein' on your reading table. Keep the candlelight close — Mary Shelley's gothic tale is captivatingly dark!"
        elif "dracula" in t_lower:
            return "I've placed 'Dracula' on your table. Settle in for the ultimate classic vampire adventure!"
        elif "python" in t_lower:
            return f"I've placed '{title}' on your desk! Perfect choice for sharpening your Python programming skills."
        else:
            return f"I've placed '{title}' by {author} on your reading table! Take your time and enjoy reading it."

    elif action == "bookmark":
        if "ikigai" in t_lower:
            return "Bookmarked 'Ikigai'! It's saved safely in your manuscript stack whenever you want to revisit its longevity and purpose secrets."
        elif "rich dad poor dad" in t_lower:
            return "Saved 'Rich Dad Poor Dad' to your bookmarks! A must-have guide to keep handy for your financial journey."
        elif "can't hurt me" in t_lower or "cant hurt me" in t_lower:
            return "Bookmarked 'Can't Hurt Me'! A phenomenal manual of mental toughness saved to your collection."
        elif "12 rules for life" in t_lower:
            return "Saved '12 Rules for Life' to your bookmarks! A wonderful philosophy guide for personal growth."
        elif "48 laws of power" in t_lower:
            return "Bookmarked 'The 48 Laws of Power'! An indispensable handbook on strategy and human psychology."
        elif "extreme ownership" in t_lower:
            return "Bookmarked 'Extreme Ownership'! Navy SEAL leadership principles saved for your reference."
        elif "wings of fire" in t_lower:
            return "Bookmarked 'Wings of Fire'! A wonderful source of courage and motivation to keep in your personal collection."
        elif "atomic habits" in t_lower:
            return "Bookmarked 'Atomic Habits'! Whenever you want to reset your daily routines, you can easily open it from your saved stack."
        elif "beloved" in t_lower:
            return "Bookmarked 'Beloved'! A Pulitzer Prize-winning classic saved to your reading list."
        else:
            return f"Bookmarked '{title}'! It's saved in your manuscript stack whenever you're ready to read it."

    return f"Logged '{title}' in your archives."
