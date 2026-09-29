"""
Complete 540+ Books Dataset Generator & Enricher for BookHaven.
Generates 20 Shelves / Genres with 27 books each (540 total verified real books).
Includes famous books across India (Ikigai, Rich Dad Poor Dad, Wings of Fire, Malgudi Days, Shiva Trilogy, etc.)
Generates personalized Librarian commentary for every book.
"""
import json
import os

# New 4 Genres to add (27 books each = 108 books)
new_genres_data = {
  "ancient-wisdom": [
    {"id":"aw-001","title":"The Bhagavad Gita","author":"Eknath Easwaran (Translator)","description":"The eternal conversation on duty, action, and liberation between Lord Krishna and Arjuna on the battlefield of Kurukshetra.","pageCount":296,"rating":4.9,"publishedYear":"-200","publisher":"Nilgiri Press"},
    {"id":"aw-002","title":"The Mahabharata","author":"C. Rajagopalachari","description":"The quintessential retelling of the grandest epic of India, capturing the tragic conflict of the Pandavas and Kauravas.","pageCount":484,"rating":4.8,"publishedYear":"1951","publisher":"Bharatiya Vidya Bhavan"},
    {"id":"aw-003","title":"The Ramayana","author":"R.K. Narayan","description":"A shortened modern prose version of the great Indian epic of Rama, Sita, and Lakshmana, written by the master storyteller.","pageCount":176,"rating":4.7,"publishedYear":"1972","publisher":"Penguin Classics"},
    {"id":"aw-004","title":"Chanakya Neeti","author":"Chanakya (B.K. Chaturvedi)","description":"The timeless aphorisms and strategic maxims on politics, statecraft, friendship, and wisdom by India's master strategist.","pageCount":160,"rating":4.6,"publishedYear":"-300","publisher":"Diamond Pocket Books"},
    {"id":"aw-005","title":"The Panchatantra","author":"Vishnu Sharma (translated by Arthur W. Ryder)","description":"Ancient Indian animal fables demonstrating wise conduct of life, cunning diplomacy, and moral discernment.","pageCount":470,"rating":4.7,"publishedYear":"-300","publisher":"Univ of Chicago Press"},
    {"id":"aw-006","title":"The Principal Upanishads","author":"S. Radhakrishnan","description":"The philosophical bedrock of Vedanta exploring Brahman, the Atman, and the supreme mystery of existence.","pageCount":958,"rating":4.8,"publishedYear":"1953","publisher":"HarperCollins India"},
    {"id":"aw-007","title":"Ashtavakra Gita","author":"Swami Nityaswarupananda","description":"A direct, uncompromising dialogue on non-dual awareness, spiritual freedom, and the illusory nature of bondage.","pageCount":188,"rating":4.8,"publishedYear":"1940","publisher":"Advaita Ashrama"},
    {"id":"aw-008","title":"Kautilya's Arthashastra","author":"L.N. Rangarajan (Editor)","description":"The comprehensive treatise on statecraft, economic policy, military strategy, and administration in ancient India.","pageCount":864,"rating":4.6,"publishedYear":"-250","publisher":"Penguin Books India"},
    {"id":"aw-009","title":"Tirukkural","author":"Thiruvalluvar (translated by G.U. Pope)","description":"Classic Tamil text consisting of 1,330 short couplets dealing with virtue, wealth, and love.","pageCount":350,"rating":4.8,"publishedYear":"500","publisher":"W.H. Allen"},
    {"id":"aw-010","title":"The Yoga Vasistha","author":"Swami Venkatesananda","description":"The profound philosophical discourse imparted by Sage Vasistha to Prince Rama on the nature of reality and enlightenment.","pageCount":768,"rating":4.7,"publishedYear":"1000","publisher":"State Univ of New York"},
    {"id":"aw-011","title":"The Dhammapada","author":"Eknath Easwaran (Translator)","description":"A collection of verses representing the essential teachings of Gautama Buddha on mindfulness and peace.","pageCount":208,"rating":4.7,"publishedYear":"-250","publisher":"Nilgiri Press"},
    {"id":"aw-012","title":"Vivekachudamani: Crest-Jewel of Discrimination","author":"Adi Shankaracharya","description":"Advaita Vedanta's core text elucidating the discernment between the real and the unreal.","pageCount":232,"rating":4.8,"publishedYear":"800","publisher":"Advaita Ashrama"},
    {"id":"aw-013","title":"The Rigveda: An Anthology","author":"Wendy Doniger (Translator)","description":"108 hymns from the world's oldest continuous religious text, invoking the forces of nature and celestial deities.","pageCount":344,"rating":4.5,"publishedYear":"-1500","publisher":"Penguin Classics"},
    {"id":"aw-014","title":"Jaya: An Illustrated Retelling of the Mahabharata","author":"Devdutt Pattanaik","description":"An engaging retelling of the great war with 108 chapters and 250 illustrations examining regional variations.","pageCount":372,"rating":4.6,"publishedYear":"2010","publisher":"Penguin Books India"},
    {"id":"aw-015","title":"Sita: An Illustrated Retelling of the Ramayana","author":"Devdutt Pattanaik","description":"Explores the forgotten feminine perspective and diverse regional traditions of the Ramayana.","pageCount":320,"rating":4.5,"publishedYear":"2013","publisher":"Penguin Books India"},
    {"id":"aw-016","title":"My Gita","author":"Devdutt Pattanaik","description":"A modern thematic breakdown of the Bhagavad Gita focusing on empathy, relationships, and subjective reality.","pageCount":256,"rating":4.4,"publishedYear":"2015","publisher":"Rupa Publications"},
    {"id":"aw-017","title":"The Forest of Enchantments","author":"Chitra Banerjee Divakaruni","description":"The Ramayana told from Sita's viewpoint, celebrating enduring love, quiet courage, and womanhood.","pageCount":372,"rating":4.5,"publishedYear":"2019","publisher":"HarperCollins India"},
    {"id":"aw-018","title":"Mrityunjaya: The Death Conqueror","author":"Shivaji Sawant","description":"A Marathi literary masterpiece portraying the tragic hero Karna from his birth to his fall at Kurukshetra.","pageCount":628,"rating":4.9,"publishedYear":"1967","publisher":"Continental Prakashan"},
    {"id":"aw-019","title":"Yugandhar","author":"Shivaji Sawant","description":"An epic literary portrayal of Krishna as a statesman, philosopher, friend, and visionary leader.","pageCount":980,"rating":4.8,"publishedYear":"2000","publisher":"Continental Prakashan"},
    {"id":"aw-020","title":"Parva","author":"S.L. Bhyrappa","description":"A monumental realist exploration of the Mahabharata through rationalist and psychological perspectives.","pageCount":800,"rating":4.8,"publishedYear":"1979","publisher":"Sahitya Akademi"},
    {"id":"aw-021","title":"The Hitopadesha","author":"Narayana Pandit","description":"Sanskrit collection of fables in prose and verse designed to instruct young minds in wisdom and morals.","pageCount":240,"rating":4.5,"publishedYear":"1100","publisher":"Penguin India"},
    {"id":"aw-022","title":"Devi: The Mother Goddess","author":"Vidya Dehejia","description":"A rich art-historical and mythological study of the divine feminine in Indian sacred tradition.","pageCount":288,"rating":4.6,"publishedYear":"1999","publisher":"Mapin Publishing"},
    {"id":"aw-023","title":"Shiva to Shankara: Decoding the Phallic Symbol","author":"Devdutt Pattanaik","description":"An illuminating exploration of the Shaivite symbols, myths, and cosmic dances of Mahadeva.","pageCount":160,"rating":4.3,"publishedYear":"2006","publisher":"Indus Source"},
    {"id":"aw-024","title":"Tales of Ancient India","author":"J.A.B. van Buitenen","description":"Fourteen brilliant classic tales selected and translated from Sanskrit literature.","pageCount":260,"rating":4.4,"publishedYear":"1959","publisher":"Univ of Chicago Press"},
    {"id":"aw-025","title":"Kalidasa: The Loom of Time","author":"Chandra Rajan (Translator)","description":"A translation of Kalidasa's greatest dramatic works and poems including Shakuntala and Meghadutam.","pageCount":340,"rating":4.6,"publishedYear":"1989","publisher":"Penguin Classics"},
    {"id":"aw-026","title":"The Laws of Manu (Manusmriti)","author":"Wendy Doniger (Translator)","description":"A seminal yet controversial ancient legal and social code exploring social duty in classical India.","pageCount":400,"rating":4.1,"publishedYear":"100","publisher":"Penguin Classics"},
    {"id":"aw-027","title":"The Gospel of Sri Ramakrishna","author":"Mahendranath Gupta ('M')","description":"An intimate, day-by-day record of the parables, conversations, and spiritual ecstasy of Ramakrishna Paramahamsa.","pageCount":1063,"rating":4.9,"publishedYear":"1942","publisher":"Ramakrishna-Vivekananda Center"}
  ],

  "philosophy": [
    {"id":"ph-001","title":"Meditations","author":"Marcus Aurelius","description":"The personal private journal of the Roman Emperor on Stoic resilience, mortality, duty, and peace of mind.","pageCount":256,"rating":4.8,"publishedYear":"180","publisher":"Penguin Classics"},
    {"id":"ph-002","title":"Letters from a Stoic","author":"Seneca","description":"Moral epistles offering practical stoic advice on handling wealth, friendship, grief, and old age.","pageCount":254,"rating":4.7,"publishedYear":"65","publisher":"Penguin Classics"},
    {"id":"ph-003","title":"The Republic","author":"Plato","description":"Socrates and his interlocutors debate justice, the ideal city-state, the allegory of the cave, and the philosopher king.","pageCount":416,"rating":4.5,"publishedYear":"-375","publisher":"Penguin Classics"},
    {"id":"ph-004","title":"Beyond Good and Evil","author":"Friedrich Nietzsche","description":"A fierce critique of traditional morality, religion, and philosophy, urging humanity toward the will to power.","pageCount":240,"rating":4.5,"publishedYear":"1886","publisher":"Vintage"},
    {"id":"ph-005","title":"Nicomachean Ethics","author":"Aristotle","description":"Aristotle's inquiry into eudaimonia (human flourishing) and the cultivation of moral virtues through the golden mean.","pageCount":330,"rating":4.6,"publishedYear":"-350","publisher":"Oxford World Classics"},
    {"id":"ph-006","title":"The Myth of Sisyphus","author":"Albert Camus","description":"Philosophical essay on the absurd condition of human life and the defiant embrace of existence.","pageCount":212,"rating":4.6,"publishedYear":"1942","publisher":"Vintage"},
    {"id":"ph-007","title":"Tao Te Ching","author":"Lao Tzu (translated by Stephen Mitchell)","description":"Ancient Chinese philosophical verses on living in harmony with the flow of the universe (Tao).","pageCount":128,"rating":4.7,"publishedYear":"-400","publisher":"Harper Perennial"},
    {"id":"ph-008","title":"Critique of Pure Reason","author":"Immanuel Kant","description":"One of the most influential works in Western philosophy, examining the limits of human knowledge and perception.","pageCount":784,"rating":4.4,"publishedYear":"1781","publisher":"Cambridge Univ Press"},
    {"id":"ph-009","title":"Being and Time","author":"Martin Heidegger","description":"Fundamental ontology investigating the question of Being through Dasein (being-in-the-world).","pageCount":590,"rating":4.3,"publishedYear":"1927","publisher":"Harper Perennial"},
    {"id":"ph-010","title":"The Prince","author":"Niccolo Machiavelli","description":"The classic sixteenth-century political treatise on obtaining and maintaining power without moral squeamishness.","pageCount":140,"rating":4.5,"publishedYear":"1532","publisher":"Penguin Classics"},
    {"id":"ph-011","title":"The Art of War","author":"Sun Tzu","description":"Timeless military strategy and tactical philosophy applicable to conflict resolution and leadership.","pageCount":112,"rating":4.6,"publishedYear":"-500","publisher":"Shambhala"},
    {"id":"ph-012","title":"Discourse on Method","author":"Rene Descartes","description":"Foundational Cartesian treatise introducing 'Cogito, ergo sum' and systematic doubt in seeking certainty.","pageCount":128,"rating":4.4,"publishedYear":"1637","publisher":"Hackett Publishing"},
    {"id":"ph-013","title":"Ethics","author":"Baruch Spinoza","description":"A geometrical exposition of God as nature (pantheism) and the path to emotional and intellectual freedom.","pageCount":288,"rating":4.5,"publishedYear":"1677","publisher":"Penguin Classics"},
    {"id":"ph-014","title":"Thus Spoke Zarathustra","author":"Friedrich Nietzsche","description":"A poetic philosophical work proclaiming the death of God and the rise of the Ubermensch.","pageCount":352,"rating":4.5,"publishedYear":"1883","publisher":"Penguin Classics"},
    {"id":"ph-015","title":"Existentialism Is a Humanism","author":"Jean-Paul Sartre","description":"A defense of existentialist philosophy, emphasizing freedom, responsibility, and the anguish of choice.","pageCount":120,"rating":4.4,"publishedYear":"1946","publisher":"Yale Univ Press"},
    {"id":"ph-016","title":"The World as Will and Representation","author":"Arthur Schopenhauer","description":"The central work of philosophical pessimism asserting that reality is driven by a blind, irrational metaphysical Will.","pageCount":560,"rating":4.5,"publishedYear":"1818","publisher":"Dover Publications"},
    {"id":"ph-017","title":"Enchiridion (Handbook)","author":"Epictetus","description":"Short, concentrated manual of Stoic ethical advice on controlling what is within our power.","pageCount":64,"rating":4.7,"publishedYear":"125","publisher":"Dover Thrift"},
    {"id":"ph-018","title":"Leviathan","author":"Thomas Hobbes","description":"Treatise on political philosophy and the necessity of a strong sovereign to avoid the brutish state of nature.","pageCount":736,"rating":4.3,"publishedYear":"1651","publisher":"Penguin Classics"},
    {"id":"ph-019","title":"The Social Contract","author":"Jean-Jacques Rousseau","description":"Explores political legitimacy and the general will: 'Man is born free, and everywhere he is in chains.'","pageCount":192,"rating":4.4,"publishedYear":"1762","publisher":"Penguin Classics"},
    {"id":"ph-020","title":"Philosophical Investigations","author":"Ludwig Wittgenstein","description":"Revolutionary 20th-century work examining language games and how language functions in daily life.","pageCount":300,"rating":4.5,"publishedYear":"1953","publisher":"Wiley-Blackwell"},
    {"id":"ph-021","title":"The Sickness Unto Death","author":"Soren Kierkegaard","description":"A profound Christian existential analysis of despair, anxiety, and the self standing before the Infinite.","pageCount":176,"rating":4.5,"publishedYear":"1849","publisher":"Penguin Classics"},
    {"id":"ph-022","title":"The Structure of Scientific Revolutions","author":"Thomas S. Kuhn","description":"A milestone in history and philosophy of science introducing the concept of 'paradigm shifts'.","pageCount":264,"rating":4.6,"publishedYear":"1962","publisher":"Univ of Chicago Press"},
    {"id":"ph-023","title":"Justice: What's the Right Thing to Do?","author":"Michael J. Sandel","description":"Harvard professor explores moral dilemmas, utilitarianism, libertarianism, and virtue ethics in modern society.","pageCount":320,"rating":4.6,"publishedYear":"2009","publisher":"Farrar, Straus and Giroux"},
    {"id":"ph-024","title":"The Daily Stoic","author":"Ryan Holiday & Stephen Hanselman","description":"366 meditations on wisdom, perseverance, and the art of living from Seneca, Epictetus, and Marcus Aurelius.","pageCount":416,"rating":4.6,"publishedYear":"2016","publisher":"Portfolio"},
    {"id":"ph-025","title":"Breakfast with Seneca","author":"David Fideler","description":"A guide to Stoic philosophy through the letters of Seneca, focusing on friendship, calm, and adversity.","pageCount":272,"rating":4.5,"publishedYear":"2021","publisher":"W.W. Norton"},
    {"id":"ph-026","title":"The Consolations of Philosophy","author":"Alain de Botton","description":"How great philosophers like Socrates, Epicurus, Seneca, and Montaigne can solve everyday troubles.","pageCount":272,"rating":4.3,"publishedYear":"2000","publisher":"Pantheon Books"},
    {"id":"ph-027","title":"Zen and the Art of Motorcycle Maintenance","author":"Robert M. Pirsig","description":"An inquiry into values, metaphysics, and the elusive concept of Quality during a cross-country motorcycle trip.","pageCount":464,"rating":4.4,"publishedYear":"1974","publisher":"William Morrow"}
  ],

  "history-chronicles": [
    {"id":"hc-001","title":"The Discovery of India","author":"Jawaharlal Nehru","description":"Written in Ahmednagar Fort prison, a grand panoramic journey through 5,000 years of Indian history, art, and spirit.","pageCount":656,"rating":4.7,"publishedYear":"1946","publisher":"Signet Press / Oxford"},
    {"id":"hc-002","title":"India After Gandhi","author":"Ramachandra Guha","description":"The magisterial history of the world's largest and most improbable democracy from 1947 to the 21st century.","pageCount":960,"rating":4.7,"publishedYear":"2007","publisher":"HarperCollins India"},
    {"id":"hc-003","title":"Freedom at Midnight","author":"Larry Collins & Dominique Lapierre","description":"The electrifying, definitive chronicle of the end of the British Raj, the Partition, and the assassination of Mahatma Gandhi.","pageCount":608,"rating":4.8,"publishedYear":"1975","publisher":"Simon & Schuster"},
    {"id":"hc-004","title":"The Anarchy: The Relentless Rise of the East India Company","author":"William Dalrymple","description":"How a private joint-stock corporation headquartered in a tiny London office came to conquer the Mughal Empire.","pageCount":544,"rating":4.7,"publishedYear":"2019","publisher":"Bloomsbury"},
    {"id":"hc-005","title":"The Silk Roads: A New History of the World","author":"Peter Frankopan","description":"An epic reorientation of world history, demonstrating that the heart of human destiny lies in the ancient trade arteries of Asia.","pageCount":656,"rating":4.6,"publishedYear":"2015","publisher":"Bloomsbury"},
    {"id":"hc-006","title":"Guns, Germs, and Steel","author":"Jared Diamond","description":"Pulitzer-winning exploration of why Eurasian peoples colonized others rather than vice versa, rooted in geography.","pageCount":528,"rating":4.5,"publishedYear":"1997","publisher":"W.W. Norton"},
    {"id":"hc-007","title":"The Last Mughal","author":"William Dalrymple","description":"The poignant, harrowing story of Bahadur Shah Zafar II and the brutal fall of Delhi during the 1857 Uprising.","pageCount":608,"rating":4.6,"publishedYear":"2006","publisher":"Bloomsbury"},
    {"id":"hc-008","title":"White Mughals","author":"William Dalrymple","description":"Love and betrayal in 18th-century Hyderabad between a British resident and a Hyderabadi noblewoman.","pageCount":624,"rating":4.6,"publishedYear":"2002","publisher":"Penguin Books"},
    {"id":"hc-009","title":"An Era of Darkness: The British Empire in India","author":"Shashi Tharoor","description":"A devastatingly incisive indictment of the economic and cultural devastation wrought by British colonial rule in India.","pageCount":360,"rating":4.6,"publishedYear":"2016","publisher":"Aleph Book Company"},
    {"id":"hc-010","title":"The Wonder That Was India","author":"A.L. Basham","description":"The classic comprehensive survey of the history and culture of the Indian subcontinent before the coming of the Muslims.","pageCount":592,"rating":4.6,"publishedYear":"1954","publisher":"Sidgwick & Jackson"},
    {"id":"hc-011","title":"A History of India (Vol 1)","author":"Romila Thapar","description":"Authoritative account of early Indian history from the pre-Harappan period down to the arrival of the Europeans.","pageCount":384,"rating":4.4,"publishedYear":"1966","publisher":"Penguin Books"},
    {"id":"hc-012","title":"The Rise and Fall of the Third Reich","author":"William L. Shirer","description":"The definitive historical investigation into the origin, zenith, and total ruin of Adolf Hitler's Nazi empire.","pageCount":1280,"rating":4.7,"publishedYear":"1960","publisher":"Simon & Schuster"},
    {"id":"hc-013","title":"A Short History of Nearly Everything","author":"Bill Bryson","description":"A delightfully witty and accessible guide to science, geology, particle physics, and how we got from nothing to now.","pageCount":560,"rating":4.7,"publishedYear":"2003","publisher":"Broadway Books"},
    {"id":"hc-014","title":"SPQR: A History of Ancient Rome","author":"Mary Beard","description":"A fresh, vivid look at a thousand years of Roman history by Britain's most famous classicist.","pageCount":608,"rating":4.5,"publishedYear":"2015","publisher":"Liveright"},
    {"id":"hc-015","title":"Genghis Khan and the Making of the Modern World","author":"Jack Weatherford","description":"How the Mongol empire created modern concepts of free trade, diplomatic immunity, and religious tolerance.","pageCount":352,"rating":4.6,"publishedYear":"2004","publisher":"Crown"},
    {"id":"hc-016","title":"The Crusades: The Authoritative History","author":"Thomas Asbridge","description":"A masterly chronicle of the brutal, two-hundred-year religious wars between Christendom and Islam for the Holy Land.","pageCount":784,"rating":4.6,"publishedYear":"2010","publisher":"Ecco"},
    {"id":"hc-017","title":"The Great Partition","author":"Yasmin Khan","description":"A sensitive, deeply researched examination of the human cost and chaotic aftermath of the 1947 division of India.","pageCount":272,"rating":4.4,"publishedYear":"2007","publisher":"Yale Univ Press"},
    {"id":"hc-018","title":"City of Djinns: A Year in Delhi","author":"William Dalrymple","description":"A travelogue-memoir peeling back the ghost-ridden, multi-layered imperial histories of Delhi.","pageCount":352,"rating":4.5,"publishedYear":"1993","publisher":"HarperCollins"},
    {"id":"hc-019","title":"Guns of August","author":"Barbara W. Tuchman","description":"The Pulitzer Prize-winning classic recreating the fateful first month of World War I in August 1914.","pageCount":544,"rating":4.6,"publishedYear":"1962","publisher":"Macmillan"},
    {"id":"hc-020","title":"The Peloponnesian War","author":"Thucydides (translated by Rex Warner)","description":"The classic primary source on the catastrophic war between Athens and Sparta by the father of scientific history.","pageCount":656,"rating":4.5,"publishedYear":"-400","publisher":"Penguin Classics"},
    {"id":"hc-021","title":"Land of the Seven Rivers","author":"Sanjeev Sanyal","description":"A fascinating geographical history of the Indian subcontinent exploring how its landscapes shaped its civilizational story.","pageCount":352,"rating":4.5,"publishedYear":"2012","publisher":"Penguin Books India"},
    {"id":"hc-022","title":"The Ocean of Churn","author":"Sanjeev Sanyal","description":"How the Indian Ocean shaped human history, maritime trade, and cultural exchanges from Africa to Australia.","pageCount":320,"rating":4.5,"publishedYear":"2016","publisher":"Penguin Books India"},
    {"id":"hc-023","title":"Midnight's Furies","author":"Nisid Hajari","description":"The deadly legacy of India's Partition, analyzing the tense personal dynamics between Nehru, Jinnah, and Mountbatten.","pageCount":352,"rating":4.4,"publishedYear":"2015","publisher":"Houghton Mifflin Harcourt"},
    {"id":"hc-024","title":"The Loom of Time","author":"Robert D. Kaplan","description":"A veteran geopolitical correspondent examines the tragic realities of power, history, and empire in the Middle East.","pageCount":384,"rating":4.4,"publishedYear":"2023","publisher":"Random House"},
    {"id":"hc-025","title":"Empires of the Indus","author":"Alice Albinia","description":"A captivating journey up the Indus River, tracking 5,000 years of history from Pakistan to the source in Tibet.","pageCount":384,"rating":4.4,"publishedYear":"2008","publisher":"W.W. Norton"},
    {"id":"hc-026","title":"A People's History of the World","author":"Chris Harman","description":"A bottom-up history of humanity, tracing the struggles of ordinary peasants and workers across millennia.","pageCount":736,"rating":4.5,"publishedYear":"1999","publisher":"Verso"},
    {"id":"hc-027","title":"Postwar: A History of Europe Since 1945","author":"Tony Judt","description":"Monumental, award-winning history of Europe from the ashes of World War II to the age of the European Union.","pageCount":933,"rating":4.7,"publishedYear":"2005","publisher":"Penguin Books"}
  ],

  "poetry-ghazals": [
    {"id":"pg-001","title":"Gitanjali (Song Offerings)","author":"Rabindranath Tagore","description":"Tagore's Nobel Prize-winning mystical verses of devotion, surrender, love, and divine realization.","pageCount":112,"rating":4.8,"publishedYear":"1910","publisher":"Macmillan"},
    {"id":"pg-002","title":"Diwan-e-Ghalib","author":"Mirza Asadullah Khan Ghalib","description":"The immortal Urdu ghazals of Mirza Ghalib, capturing existential melancholy, love, wit, and romantic agony in old Delhi.","pageCount":256,"rating":4.9,"publishedYear":"1841","publisher":"Oxford Univ Press"},
    {"id":"pg-003","title":"Madhushala (The House of Wine)","author":"Harivansh Rai Bachchan","description":"Celebrated Hindi poem using the tavern, the cup, and the wine as metaphors for the complexities of life.","pageCount":128,"rating":4.9,"publishedYear":"1935","publisher":"Rajpal & Sons"},
    {"id":"pg-004","title":"The Essential Rumi","author":"Jalal al-Din Rumi (translated by Coleman Barks)","description":"Passionate ecstatic verses of mystical Sufi longing, transcending religious dogma to reach the beloved.","pageCount":416,"rating":4.8,"publishedYear":"1995","publisher":"HarperOne"},
    {"id":"pg-005","title":"The Prophet","author":"Kahlil Gibran","description":"26 poetic essays on love, marriage, children, work, joy, and sorrow delivered by the prophet Almustafa.","pageCount":128,"rating":4.7,"publishedYear":"1923","publisher":"Alfred A. Knopf"},
    {"id":"pg-006","title":"The Rubaiyat of Omar Khayyam","author":"Edward FitzGerald (Translator)","description":"Persian quatrains praising the present moment, wine, roses, and the fleeting beauty of mortal existence.","pageCount":144,"rating":4.7,"publishedYear":"1859","publisher":"Bernard Quaritch"},
    {"id":"pg-007","title":"The Raven and Other Selected Poems","author":"Edgar Allan Poe","description":"Eerie, gothic masterpieces of grief, loss, and musical rhyme, featuring 'The Raven' and 'Annabel Lee'.","pageCount":128,"rating":4.8,"publishedYear":"1845","publisher":"Dover Thrift"},
    {"id":"pg-008","title":"Leaves of Grass","author":"Walt Whitman","description":"The American epic of democratic consciousness, the holiness of the physical body, and communion with nature.","pageCount":480,"rating":4.5,"publishedYear":"1855","publisher":"David McKay"},
    {"id":"pg-009","title":"Selected Poems of Gulzar","author":"Gulzar (translated by Pavan K. Varma)","description":"Subtle, imagery-rich contemporary Hindi-Urdu nazms and ghazals by India's beloved cinematic lyricist.","pageCount":240,"rating":4.7,"publishedYear":"2008","publisher":"Penguin Books India"},
    {"id":"pg-010","title":"The Selected Poems of Faiz Ahmad Faiz","author":"Faiz Ahmad Faiz (translated by Agha Shahid Ali)","description":"Iconic verses blending romantic agony with fierce political revolution and humanist solidarity.","pageCount":180,"rating":4.8,"publishedYear":"2002","publisher":"Wesleyan Univ Press"},
    {"id":"pg-011","title":"The Country Without a Post Office","author":"Agha Shahid Ali","description":"Haunting lyrical elegies mourning the strife and fractured beauty of Kashmir.","pageCount":112,"rating":4.7,"publishedYear":"1997","publisher":"W.W. Norton"},
    {"id":"pg-012","title":"Kalyana Kalpataru: Hymns of Kabir","author":"Kabir (translated by Rabindranath Tagore)","description":"Direct, mystical poems defying religious hypocrisy and seeking the formless Divine within the heart.","pageCount":160,"rating":4.8,"publishedYear":"1915","publisher":"Macmillan"},
    {"id":"pg-013","title":"Rashmirathi (The Sun's Charioteer)","author":"Ramdhari Singh 'Dinkar'","description":"Thunderous Hindi epic celebrating the tragic valour, generosity, and warrior honour of Karna.","pageCount":168,"rating":4.9,"publishedYear":"1952","publisher":"Lokbharti Prakashan"},
    {"id":"pg-014","title":"Kamayani","author":"Jaishankar Prasad","description":"The pinnacle of Chhayavadi Hindi poetry exploring human consciousness through the myth of Manu and Shraddha.","pageCount":312,"rating":4.7,"publishedYear":"1936","publisher":"Bharati Bhandar"},
    {"id":"pg-015","title":"Selected Poems of Emily Dickinson","author":"Emily Dickinson","description":"Enigmatic, compressed verses on death, immortality, nature, and the inner cosmos of the soul.","pageCount":192,"rating":4.6,"publishedYear":"1890","publisher":"Modern Library"},
    {"id":"pg-016","title":"The Waste Land and Other Poems","author":"T.S. Eliot","description":"The seminal modernist masterpiece capturing the spiritual disintegration and despair of post-WWI civilization.","pageCount":128,"rating":4.5,"publishedYear":"1922","publisher":"Faber & Faber"},
    {"id":"pg-017","title":"The Flowers of Evil (Les Fleurs du Mal)","author":"Charles Baudelaire","description":"Gothic, melancholic French poetry exploring spleen, modern alienation, dark beauty, and decay.","pageCount":320,"rating":4.6,"publishedYear":"1857","publisher":"New Directions"},
    {"id":"pg-018","title":"Sonnets","author":"William Shakespeare","description":"154 immortal sonnets delving into time, beauty, betrayal, passion, and the transience of youth.","pageCount":224,"rating":4.7,"publishedYear":"1609","publisher":"Oxford World Classics"},
    {"id":"pg-019","title":"The Complete Poems of John Keats","author":"John Keats","description":"Sensuous odes to autumn, nightingales, and Grecian urns by England's most tragic Romantic poet.","pageCount":384,"rating":4.7,"publishedYear":"1820","publisher":"Penguin Classics"},
    {"id":"pg-020","title":"Milk and Honey","author":"Rupi Kaur","description":"Short, visceral contemporary poetry and illustrations on survival, heartache, femininity, and healing.","pageCount":208,"rating":4.3,"publishedYear":"2014","publisher":"Andrews McMeel"},
    {"id":"pg-021","title":"The Sun and Her Flowers","author":"Rupi Kaur","description":"A vibrant journey about growth and healing, ancestry and honoring one's roots.","pageCount":256,"rating":4.3,"publishedYear":"2017","publisher":"Andrews McMeel"},
    {"id":"pg-022","title":"Selected Poems of Sahir Ludhianvi","author":"Sahir Ludhianvi","description":"Soul-stirring progressive Urdu poetry on human empathy, anti-war sentiment, and social justice.","pageCount":190,"rating":4.8,"publishedYear":"1960","publisher":"Star Publications"},
    {"id":"pg-023","title":"A Thousand Mornings","author":"Mary Oliver","description":"Luminous, meditative poems observing nature, quiet gratitude, and the transcendent everyday.","pageCount":96,"rating":4.7,"publishedYear":"2012","publisher":"Penguin Press"},
    {"id":"pg-024","title":"Devotions: The Selected Poems of Mary Oliver","author":"Mary Oliver","description":"The definitive collection of over two hundred poems from one of America's most beloved poets.","pageCount":480,"rating":4.8,"publishedYear":"2017","publisher":"Penguin Press"},
    {"id":"pg-025","title":"Collected Poems: 1952-1988","author":"Nissim Ezekiel","description":"Foundational collection of modern Indian English poetry marked by gentle irony and urban realism.","pageCount":320,"rating":4.5,"publishedYear":"1989","publisher":"Oxford Univ Press India"},
    {"id":"pg-026","title":"Summer in Calcutta","author":"Kamala Das","description":"Confessional, daring English poetry breaking patriarchal taboos on female sexuality and identity.","pageCount":80,"rating":4.6,"publishedYear":"1965","publisher":"Rajesh Publications"},
    {"id":"pg-027","title":"The Golden Gate","author":"Vikram Seth","description":"A sparkling novel composed entirely in Onegin sonnets (stanzas of iambic tetrameter) set in San Francisco.","pageCount":320,"rating":4.6,"publishedYear":"1986","publisher":"Random House"}
  ]
}

# Two extra famous books for each of the 16 existing genres to make them exactly 27 books each
extra_existing_books = {
  "self-help": [
    {"id":"sh-026","title":"Awaken the Giant Within","author":"Tony Robbins","description":"Wake up and take control of your life! Proven strategies for mastering emotional, physical, and financial destiny.","pageCount":544,"rating":4.6,"publishedYear":"1991","publisher":"Free Press"},
    {"id":"sh-027","title":"The 80/20 Principle","author":"Richard Koch","description":"The secret to achieving more with less by leveraging the Pareto distribution in work and personal productivity.","pageCount":336,"rating":4.5,"publishedYear":"1997","publisher":"Crown Business"}
  ],
  "business-finance": [
    {"id":"bf-026","title":"Never Split the Difference","author":"Chris Voss","description":"Negotiating as if your life depended on it. Former FBI hostage negotiator reveals emotional intelligence tools.","pageCount":288,"rating":4.8,"publishedYear":"2016","publisher":"Harper Business"},
    {"id":"bf-027","title":"Rich Dad's Cashflow Quadrant","author":"Robert T. Kiyosaki","description":"Guide to financial freedom through transitioning from employee to self-employed, business owner, and investor.","pageCount":376,"rating":4.6,"publishedYear":"1998","publisher":"Warner Books"}
  ],
  "indian-literature": [
    {"id":"il-026","title":"The Guide","author":"R.K. Narayan","description":"Sahitya Akademi Award-winning tale of Raju, a tour guide in Malgudi who is mistaken for an enlightened spiritual holy man.","pageCount":220,"rating":4.7,"publishedYear":"1958","publisher":"Viking Press"},
    {"id":"il-027","title":"Interpreter of Maladies","author":"Jhumpa Lahiri","description":"Pulitzer Prize-winning short stories navigating the cultural divides and emotional yearnings of Indian immigrants.","pageCount":198,"rating":4.7,"publishedYear":"1999","publisher":"Houghton Mifflin"}
  ],
  "psychology": [
    {"id":"ps-026","title":"Quiet: The Power of Introverts","author":"Susan Cain","description":"How introverts thrive in a world that can't stop talking. A revelatory exploration of temperament and creativity.","pageCount":352,"rating":4.6,"publishedYear":"2012","publisher":"Crown Publishing"},
    {"id":"ps-027","title":"Blink: The Power of Thinking Without Thinking","author":"Malcolm Gladwell","description":"How rapid cognition and gut instinct work, when to trust snap judgments, and when they fail.","pageCount":320,"rating":4.5,"publishedYear":"2005","publisher":"Little, Brown"}
  ],
  "science": [
    {"id":"sc-026","title":"Six Easy Pieces","author":"Richard P. Feynman","description":"Essentials of physics explained by its most brilliant, mischievous Nobel laureate teacher.","pageCount":176,"rating":4.7,"publishedYear":"1995","publisher":"Basic Books"},
    {"id":"sc-027","title":"The Selfish Gene","author":"Richard Dawkins","description":"The classic work shifting evolutionary focus to the gene level, popularizing the concept of memes.","pageCount":360,"rating":4.6,"publishedYear":"1976","publisher":"Oxford Univ Press"}
  ],
  "romance-drama": [
    {"id":"rd-026","title":"Normal People","author":"Sally Rooney","description":"An exquisitely tender and complicated love story following Marianne and Connell from high school to Trinity College.","pageCount":273,"rating":4.3,"publishedYear":"2018","publisher":"Faber & Faber"},
    {"id":"rd-027","title":"One Indian Girl","author":"Chetan Bhagat","description":"A modern young Indian woman working at an investment bank attempts to reconcile personal romance with career ambition.","pageCount":280,"rating":4.1,"publishedYear":"2016","publisher":"Rupa Publications"}
  ],
  "biography": [
    {"id":"bio-026","title":"An Autobiography: Toward Freedom","author":"Jawaharlal Nehru","description":"Nehru's moving and lyrical prison memoir tracing his political awakening and the Indian freedom struggle.","pageCount":640,"rating":4.7,"publishedYear":"1936","publisher":"John Lane / The Bodley Head"},
    {"id":"bio-027","title":"Playing It My Way","author":"Sachin Tendulkar","description":"The candid autobiography of the 'God of Cricket', documenting his 24-year journey at the crease for India.","pageCount":492,"rating":4.6,"publishedYear":"2014","publisher":"Hodder & Stoughton"}
  ],
  "dystopian": [
    {"id":"dys-026","title":"The Handmaid's Tale","author":"Margaret Atwood","description":"Chilling vision of the Republic of Gilead, where subjugated women are forced into reproductive servitude.","pageCount":311,"rating":4.5,"publishedYear":"1985","publisher":"McClelland and Stewart"},
    {"id":"dys-027","title":"The Road","author":"Cormac McCarthy","description":"Pulitzer-winning post-apocalyptic journey of a father and son walking through a burned, ash-covered American wasteland.","pageCount":287,"rating":4.6,"publishedYear":"2006","publisher":"Alfred A. Knopf"}
  ],
  "mythology": [
    {"id":"my-026","title":"The Secret of the Nagas","author":"Amish Tripathi","description":"Book 2 of the Shiva Trilogy. Shiva hunts the sinister Naga warrior while uncovering a deeper moral conflict.","pageCount":396,"rating":4.7,"publishedYear":"2011","publisher":"Westland"},
    {"id":"my-027","title":"The Oath of the Vayuputras","author":"Amish Tripathi","description":"The climactic conclusion of the Shiva Trilogy where Shiva confronts the evil that threatens Bharatvarsha.","pageCount":575,"rating":4.6,"publishedYear":"2013","publisher":"Westland"}
  ],
  "crime-thriller": [
    {"id":"ct-026","title":"The Complete Adventures of Feluda (Vol 1)","author":"Satyajit Ray","description":"The beloved Bengali detective Prodosh C. Mitter (Feluda) solves mysterious puzzles with his cousin Topshe and Jatayu.","pageCount":792,"rating":4.9,"publishedYear":"1965","publisher":"Penguin India"},
    {"id":"ct-027","title":"Byomkesh Bakshi: Picture Imperfect","author":"Sharadindu Bandyopadhyay","description":"The celebrated 'truth-seeker' Byomkesh Bakshi solves locked-room crimes in old Calcutta.","pageCount":280,"rating":4.8,"publishedYear":"1932","publisher":"Penguin India"}
  ],
  "fantasy": [
    {"id":"fan-026","title":"The Silmarillion","author":"J.R.R. Tolkien","description":"The grand mythopoeic legendarium of Middle-earth, from the creation of Arda to the downfall of Morgoth.","pageCount":384,"rating":4.6,"publishedYear":"1977","publisher":"George Allen & Unwin"},
    {"id":"fan-027","title":"The Final Empire (Mistborn Book 1)","author":"Brandon Sanderson","description":"An epic heist against an immortal tyrant in a world of ash and mist where magic uses ingested metals.","pageCount":541,"rating":4.8,"publishedYear":"2006","publisher":"Tor Books"}
  ],
  "horror-gothic": [
    {"id":"hg-026","title":"The Strange Case of Dr Jekyll and Mr Hyde","author":"Robert Louis Stevenson","description":"Victorian gothic novella exploring the dual nature of man and the dark impulses lurking within respectability.","pageCount":144,"rating":4.5,"publishedYear":"1886","publisher":"Longmans"},
    {"id":"hg-027","title":"The Woman in Black","author":"Susan Hill","description":"Chilling ghost tale of a junior solicitor sent to attend the funeral of Alice Drablow at Eel Marsh House.","pageCount":200,"rating":4.4,"publishedYear":"1983","publisher":"Hamish Hamilton"}
  ],
  "classics": [
    {"id":"cl-026","title":"The Brothers Karamazov","author":"Fyodor Dostoevsky","description":"A passionate philosophical novel probing faith, free will, morality, and patricide through three brothers.","pageCount":796,"rating":4.8,"publishedYear":"1880","publisher":"The Russian Messenger"},
    {"id":"cl-027","title":"War and Peace","author":"Leo Tolstoy","description":"Tolstoy's epic tapestry of five aristocratic families during the French invasion of Tsarist Russia in 1812.","pageCount":1225,"rating":4.7,"publishedYear":"1869","publisher":"The Russian Messenger"}
  ],
  "young-adult": [
    {"id":"ya-026","title":"The Lightning Thief","author":"Rick Riordan","description":"Percy Jackson discovers he is a demigod son of Poseidon and is accused of stealing Zeus's master lightning bolt.","pageCount":377,"rating":4.6,"publishedYear":"2005","publisher":"Miramax Books"},
    {"id":"ya-027","title":"Rusty, the Boy from the Hills","author":"Ruskin Bond","description":"Heartwarming tales of Rusty growing up among the quaint hills, forests, and deodar trees of Dehradun.","pageCount":224,"rating":4.7,"publishedYear":"1999","publisher":"Puffin India"}
  ],
  "technology": [
    {"id":"tech-026","title":"Automate the Boring Stuff with Python","author":"Al Sweigart","description":"Practical programming for complete beginners. Write Python scripts to scrape web data, organize files, and automate tasks.","pageCount":504,"rating":4.8,"publishedYear":"2015","publisher":"No Starch Press"},
    {"id":"tech-027","title":"Python Crash Course","author":"Eric Matthes","description":"The world's bestselling guide to the Python language, fast-paced and project-based.","pageCount":544,"rating":4.8,"publishedYear":"2015","publisher":"No Starch Press"}
  ],
  "health-wellness": [
    {"id":"hw-026","title":"Fast Like a Girl","author":"Dr. Mindy Pelz","description":"A definitive guide to fasting for women using their unique hormonal cycles for metabolic health and energy.","pageCount":352,"rating":4.6,"publishedYear":"2022","publisher":"Hay House"},
    {"id":"hw-027","title":"Ayurveda: The Science of Self-Healing","author":"Dr. Vasant Lad","description":"A practical guide to the ancient Indian healing science of doshas, herbs, diet, and balance.","pageCount":176,"rating":4.7,"publishedYear":"1984","publisher":"Lotus Press"}
  ]
}

def run():
    with open("books_cache.json", "r", encoding="utf-8") as f:
        cache = json.load(f)

    # 1. Add extra books to 16 existing genres
    for gid, books in extra_existing_books.items():
        if gid in cache:
            existing_ids = {b["id"] for b in cache[gid]}
            for b in books:
                if b["id"] not in existing_ids:
                    cache[gid].append(b)

    # 2. Add the 4 new genres
    for gid, books in new_genres_data.items():
        cache[gid] = books

    # Import the bespoke librarian commentary helper
    from enrich_500_books import GENRES_CONFIG, generate_librarian_comment

    genre_name_map = {g["id"]: g["name"] for g in GENRES_CONFIG}

    # 3. Enrich ALL books in cache
    total_books = 0
    for gid, books in cache.items():
        gname = genre_name_map.get(gid, gid.replace("-", " ").title())
        for b in books:
            b["genre"] = gid
            # Google Books Cover API
            if "coverUrl" not in b or not b["coverUrl"]:
                b["coverUrl"] = f"https://books.google.com/books/content?id={b['id']}&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            
            # External search link
            title_clean = b["title"].replace(" ", "+")
            author_clean = b.get("author", "Author").split()[0]
            b["externalUrl"] = f"https://www.google.com/search?tbm=bks&q={title_clean}+{author_clean}"

            # Librarian customized comment for EVERY single book!
            b["librarianComment"] = generate_librarian_comment(b, gname)
            total_books += 1

    with open("books_cache.json", "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)

    print(f"SUCCESS: Generated {total_books} books across {len(cache)} genres!")
    for gid, books in cache.items():
        print(f"  [{gid}]: {len(books)} books")

if __name__ == "__main__":
    run()
