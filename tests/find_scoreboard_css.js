const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.scoreboard') || l.includes('.outs-container') || l.includes('.score-flex') || l.includes('.out-led-lamp')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
