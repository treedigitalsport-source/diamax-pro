const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
let regex = /id=["']auth-panel-([^"']+)["']/g;
let m;
while ((m = regex.exec(html)) !== null) {
  matches.push({ panel: m[1], index: m.index });
}
console.log('Panels found:', matches);

// Let's check the lines around lines 16000-17100
const lines = html.split('\n');
console.log('Total lines:', lines.length);
for (let i = 16000; i < lines.length; i++) {
  if (lines[i].includes('auth-panel-') || lines[i].includes('diamax-auth-modal') || lines[i].includes('SUBMENÚ')) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
  }
}
