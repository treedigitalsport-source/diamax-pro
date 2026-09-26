const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.nav button') || l.includes('#nav-card') || l.includes('.nav {') || l.includes('nav-manual-btn')) {
    console.log(`${i + 1}: ${l.trim()}`);
  }
});
