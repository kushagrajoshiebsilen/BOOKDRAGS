import https from 'https';
import fs from 'fs';

const genres = [
  { id: 'gothic-academia', query: 'Frankenstein Shelley Dracula Stoker Dorian Gray' },
  { id: 'classics-philosophy', query: 'Marcus Aurelius Meditations Plato Republic' },
  { id: 'mystery-occult', query: 'Sherlock Holmes Hound Baskervilles Poe Murders Rue Morgue' },
  { id: 'fantasy-antiquity', query: 'Tolkien Fellowship Ring Silmarillion Morte dArthur' },
  { id: 'horror-cosmic', query: 'Lovecraft Call Cthulhu Sheridan Le Fanu Carmilla' },
  { id: 'historical-lore', query: 'Decline Fall Roman Empire Gibbon Machiavelli Prince' },
  { id: 'scifi-speculative', query: 'HG Wells Time Machine Jules Verne Twenty Thousand Leagues' },
  { id: 'poetry-romanticism', query: 'Poe Raven Baudelaire Flowers Evil Blake Songs' }
];

function fetchGenre(g) {
  return new Promise((resolve) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(g.query)}&maxResults=8`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.items) {
            const books = data.items.map((item, idx) => {
              const info = item.volumeInfo || {};
              const imageLinks = info.imageLinks || {};
              let coverUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";
              if (coverUrl.startsWith('http://')) coverUrl = coverUrl.replace('http://', 'https://');
              
              return {
                id: item.id || `${g.id}-${idx}`,
                title: info.title || "Untitled",
                author: (info.authors && info.authors[0]) || "Unknown Author",
                genre: g.id,
                coverUrl: coverUrl,
                description: info.description ? info.description.replace(/<[^>]*>?/gm, '').substring(0, 300) + '...' : "A real published work from Google Books.",
                sourceUrl: info.infoLink || info.previewLink || `https://books.google.com/books?id=${item.id}`,
                publishedYear: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : 1850,
                rating: info.averageRating || 4.7,
                pageCount: info.pageCount || 280,
                publisher: info.publisher || "Google Books"
              };
            });
            resolve(books);
          } else {
            resolve([]);
          }
        } catch (e) {
          console.error(e);
          resolve([]);
        }
      });
    }).on('error', (e) => {
      console.error(e);
      resolve([]);
    });
  });
}

async function run() {
  let all = [];
  for (const g of genres) {
    const list = await fetchGenre(g);
    console.log(`Fetched ${list.length} for ${g.id}`);
    all = all.concat(list);
  }
  console.log(`TOTAL: ${all.length}`);
  if (all.length > 0) {
    fs.writeFileSync('src/data/books.json', JSON.stringify(all, null, 2));
  }
}

run();
