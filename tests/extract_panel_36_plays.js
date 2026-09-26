const fs = require('fs');
const v5 = fs.readFileSync('v5_dugout_emergente_ph_blindado.html', 'utf8');

const startIdx = v5.indexOf('id="panel-36-plays"');
const panelStart = v5.lastIndexOf('<div class="panel"', startIdx);

// Find where this panel closes
let depth = 0;
let panelEnd = -1;
const sub = v5.substring(panelStart);
const tagRegex = /<\/?div[^>]*>/gi;
let m;

while ((m = tagRegex.exec(sub)) !== null) {
  if (m[0].startsWith('</')) {
    depth--;
    if (depth === 0) {
      panelEnd = panelStart + m.index + m[0].length;
      break;
    }
  } else {
    depth++;
  }
}

console.log('Panel start:', panelStart, 'Panel end:', panelEnd, 'Length:', panelEnd - panelStart);
const panel36Content = v5.substring(panelStart, panelEnd);
console.log('--- First 600 chars of panel 36 ---');
console.log(panel36Content.substring(0, 600));
console.log('--- Last 600 chars of panel 36 ---');
console.log(panel36Content.substring(panel36Content.length - 600));
