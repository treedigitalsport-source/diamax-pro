const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('reg-category') || l.includes('Super Máster Leyendas') || l.includes('+55') && l.includes('option')) {
    console.log(`${i + 1}: ${l.trim()}`);
  }
});
