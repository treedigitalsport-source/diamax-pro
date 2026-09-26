const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function renderLineup') || l.includes('function limpiarLineup') || l.includes('limpiarLineupRivalEditor')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
