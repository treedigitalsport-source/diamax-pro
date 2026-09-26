const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Check diamax-page-2
const p2Idx = html.indexOf('id="diamax-page-2"');
const p3Idx = html.indexOf('id="diamax-page-3"');
console.log('Page 2 index:', p2Idx);
if (p2Idx !== -1) {
  console.log('Page 2 content length:', p3Idx - p2Idx);
  console.log(html.substring(p2Idx, p2Idx + 1500));
}

// Search for spray chart or campo in html
const sprayIdx = html.indexOf('spray-chart');
console.log('\nspray-chart index:', sprayIdx);
const fieldIdx = html.indexOf('field-canvas');
console.log('field-canvas index:', fieldIdx);
const terrenoIdx = html.indexOf('terreno');
console.log('terreno index:', terrenoIdx);
