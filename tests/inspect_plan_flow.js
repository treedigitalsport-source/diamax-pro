const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find plan selection functions and buttons in Page 2 and Auth Modal
const matches = [];
let pos = 0;
while ((pos = html.indexOf('seleccionarPlan', pos)) !== -1) {
  matches.push(pos);
  pos += 15;
}

console.log(`Found ${matches.length} references to seleccionarPlan:`);
matches.forEach(m => {
  console.log(html.substring(Math.max(0, m - 50), Math.min(html.length, m + 300)));
  console.log('--------------------------------------------------');
});

// Also check the registration forms in Page 2 and Modal
const p2RegIdx = html.indexOf('p2-sub-registro');
console.log('--- P2 REGISTRO FORM SNIPPET ---');
if (p2RegIdx !== -1) {
  console.log(html.substring(p2RegIdx, p2RegIdx + 1200));
}
