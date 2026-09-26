const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function actualizarInfoEquipo') || l.includes('function setTeamName') || l.includes('header-team-title')) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
