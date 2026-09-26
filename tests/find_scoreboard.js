const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('INNING 1') || l.includes('AL BATE (ALTA') || l.includes('scoreboard') || l.includes('inning-nav') || l.includes('btn-inning-prev') || l.includes('AL CAMPO')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
