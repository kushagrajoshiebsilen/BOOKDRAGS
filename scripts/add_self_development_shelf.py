"""
Add 'self-development' (Self-Development & Personal Mastery) shelf with 27 famous books to books_cache.json.
"""
import json

self_dev_books = [
  {"id":"sd-001","title":"Can't Hurt Me: Master Your Mind and Defy the Odds","author":"David Goggins","description":"The incredible life story of David Goggins, demonstrating how mental toughness, hard work, and discipline can overcome any obstacle.","pageCount":364,"rating":4.8,"publishedYear":"2018","publisher":"Lioncrest"},
  {"id":"sd-002","title":"Never Finished: Unshackle Your Mind and Win the War Within","author":"David Goggins","description":"Goggins takes you inside his Mental Lab, revealing the strategies to evolve past your limits and conquer self-doubt.","pageCount":312,"rating":4.8,"publishedYear":"2022","publisher":"Lioncrest"},
  {"id":"sd-003","title":"12 Rules for Life: An Antidote to Chaos","author":"Jordan B. Peterson","description":"Renowned clinical psychologist Jordan Peterson provides 12 profound, practical principles for living a responsible and meaningful life.","pageCount":448,"rating":4.6,"publishedYear":"2018","publisher":"Random House Canada"},
  {"id":"sd-004","title":"Beyond Order: 12 More Rules for Life","author":"Jordan B. Peterson","description":"The companion guide balancing order and chaos, urging readers to reach out into uncharted territory and adapt to a changing world.","pageCount":432,"rating":4.5,"publishedYear":"2021","publisher":"Portfolio"},
  {"id":"sd-005","title":"The 48 Laws of Power","author":"Robert Greene","description":"The amoral, cunning, ruthless, and instructive handbook on the history of power, drawing from Machiavelli, Sun Tzu, and history's greatest figures.","pageCount":452,"rating":4.7,"publishedYear":"1998","publisher":"Viking Press"},
  {"id":"sd-006","title":"Mastery","author":"Robert Greene","description":"Unlocks the secrets of the world's greatest masters — from Da Vinci to Mozart — to show how you can achieve excellence in any craft.","pageCount":352,"rating":4.7,"publishedYear":"2012","publisher":"Viking"},
  {"id":"sd-007","title":"The Laws of Human Nature","author":"Robert Greene","description":"Decode human behavior, manage your emotions, develop empathy, and resist psychological manipulation from toxic people.","pageCount":624,"rating":4.7,"publishedYear":"2018","publisher":"Viking"},
  {"id":"sd-008","title":"The 5 Second Rule","author":"Mel Robbins","description":"Transform your life, work, and confidence with everyday courage. A simple counting trick to stop procrastinating and take immediate action.","pageCount":240,"rating":4.5,"publishedYear":"2017","publisher":"Savio Republic"},
  {"id":"sd-009","title":"Extreme Ownership: How U.S. Navy SEALs Lead and Win","author":"Jocko Willink & Leif Babin","description":"Two Navy SEAL officers share combat leadership principles that apply directly to business, leadership, and personal responsibility.","pageCount":320,"rating":4.8,"publishedYear":"2015","publisher":"St. Martin's Press"},
  {"id":"sd-010","title":"Discipline Equals Freedom: Field Manual","author":"Jocko Willink","description":"Practical philosophies on waking up early, working out, controlling impulses, and forging unbreakable self-discipline.","pageCount":208,"rating":4.7,"publishedYear":"2017","publisher":"St. Martin's Press"},
  {"id":"sd-011","title":"The Mountain Is You: Transforming Self-Sabotage Into Self-Mastery","author":"Brianna Wiest","description":"A bestselling guide explaining why we self-sabotage, when we do it, and how to step into our highest potential.","pageCount":248,"rating":4.7,"publishedYear":"2020","publisher":"Thought Catalog"},
  {"id":"sd-012","title":"101 Essays That Will Change the Way You Think","author":"Brianna Wiest","description":"Compelling essays on emotional intelligence, cognitive biases, overcoming negative self-talk, and personal healing.","pageCount":448,"rating":4.6,"publishedYear":"2016","publisher":"Thought Catalog"},
  {"id":"sd-013","title":"Show Your Work!: 10 Ways to Share Your Creativity","author":"Austin Kleon","description":"Generosity trumps genius. A handbook for how to get discovered by sharing your process and being open about your work.","pageCount":224,"rating":4.6,"publishedYear":"2014","publisher":"Workman Publishing"},
  {"id":"sd-014","title":"Steal Like an Artist","author":"Austin Kleon","description":"10 things nobody told you about being creative. A manifesto for creativity in the digital age.","pageCount":160,"rating":4.5,"publishedYear":"2012","publisher":"Workman Publishing"},
  {"id":"sd-015","title":"Daring Greatly","author":"Brené Brown","description":"How the courage to be vulnerable transforms the way we live, love, parent, and lead. Research-backed insights into authenticity.","pageCount":320,"rating":4.7,"publishedYear":"2012","publisher":"Gotham Books"},
  {"id":"sd-016","title":"The Gifts of Imperfection","author":"Brené Brown","description":"Let go of who you think you're supposed to be and embrace who you are. Cultivate wholehearted living and self-worth.","pageCount":160,"rating":4.7,"publishedYear":"2010","publisher":"Hazelden"},
  {"id":"sd-017","title":"No Excuses!: The Power of Self-Discipline","author":"Brian Tracy","description":"21 ways to achieve lasting personal, financial, and business success through the single most critical quality: self-discipline.","pageCount":304,"rating":4.5,"publishedYear":"2010","publisher":"Vanguard Press"},
  {"id":"sd-018","title":"Goals!: How to Get Everything You Want Faster","author":"Brian Tracy","description":"A proven 21-step process for setting and achieving any goal in career, finances, and personal life.","pageCount":304,"rating":4.6,"publishedYear":"2003","publisher":"Berrett-Koehler"},
  {"id":"sd-019","title":"Feel the Fear and Do It Anyway","author":"Susan Jeffers","description":"Dynamic techniques for turning fear, indecision, and anger into power, action, and unshakeable enthusiasm.","pageCount":240,"rating":4.5,"publishedYear":"1987","publisher":"Harcourt"},
  {"id":"sd-020","title":"Psycho-Cybernetics","author":"Maxwell Maltz","description":"A surgeon discovers the connection between self-image and success. The foundational classic of modern personal development.","pageCount":310,"rating":4.7,"publishedYear":"1960","publisher":"Prentice Hall"},
  {"id":"sd-021","title":"As a Man Thinketh","author":"James Allen","description":"A timeless essay asserting that our thoughts shape our character, health, circumstances, and destiny.","pageCount":80,"rating":4.6,"publishedYear":"1903","publisher":"Savoy Publishing"},
  {"id":"sd-022","title":"Make Your Bed: Little Things That Can Change Your Life","author":"Admiral William H. McRaven","description":"10 simple life lessons from Navy SEAL training about perseverance, overcoming failure, and giving people hope.","pageCount":144,"rating":4.6,"publishedYear":"2017","publisher":"Grand Central"},
  {"id":"sd-023","title":"The Daily Laws: 366 Meditations on Power and Mastery","author":"Robert Greene","description":"A daily devotional of wisdom drawn from Robert Greene's works on strategy, power, seduce, and human nature.","pageCount":464,"rating":4.7,"publishedYear":"2021","publisher":"Viking"},
  {"id":"sd-024","title":"Developing the Leader Within You","author":"John C. Maxwell","description":"Transformational principles for inspiring, motivating, and influencing others from the world's foremost leadership expert.","pageCount":224,"rating":4.6,"publishedYear":"1993","publisher":"Thomas Nelson"},
  {"id":"sd-025","title":"The Power of Discipline","author":"Daniel Walter","description":"How to build self-control, mental toughness, and resist instant gratification to achieve long-term mastery.","pageCount":164,"rating":4.4,"publishedYear":"2020","publisher":"Independent"},
  {"id":"sd-026","title":"Relentless: From Good to Great to Unstoppable","author":"Tim S. Grover","description":"The legendary trainer of Michael Jordan and Kobe Bryant reveals what it takes to dominate at the highest level of performance.","pageCount":272,"rating":4.7,"publishedYear":"2013","publisher":"Scribner"},
  {"id":"sd-027","title":"Winning: The Unforgiving Race to Greatness","author":"Tim S. Grover","description":"The brutal, honest truths about winning in sports, business, and life. There are no shortcuts on the path to greatness.","pageCount":256,"rating":4.6,"publishedYear":"2021","publisher":"Scribner"}
]

with open("books_cache.json", "r", encoding="utf-8") as f:
    cache = json.load(f)

for b in self_dev_books:
    b["genre"] = "self-development"
    b["coverUrl"] = f"https://books.google.com/books/content?id={b['id']}&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    title_clean = b["title"].replace(" ", "+")
    author_clean = b.get("author", "Author").split()[0]
    b["externalUrl"] = f"https://www.google.com/search?tbm=bks&q={title_clean}+{author_clean}"

cache["self-development"] = self_dev_books

with open("books_cache.json", "w", encoding="utf-8") as f:
    json.dump(cache, f, indent=2, ensure_ascii=False)

total = sum(len(v) for v in cache.values())
print(f"Added self-development shelf! Total shelves: {len(cache)}, Total books: {total}")
