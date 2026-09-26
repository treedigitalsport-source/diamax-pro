const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
const occurrences = [];
lines.forEach((l, i) => {
  if (l.includes('GUERREROS') || l.includes('guerreros')) {
    occurrences.push(`${i + 1}: ${l.trim().substring(0, 110)}`);
  }
});
console.log(`Total occurrences: ${occurrences.length}`);
console.log(occurrences.slice(0, 30).join('\n'));
