const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('status-away-team') || l.includes('status-home-team') || l.includes('scoreboard-away-box') || l.includes('scoreboard-home-box') || l.includes('label-away-team')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
