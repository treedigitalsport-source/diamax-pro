const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="spray-chart-layer"');
console.log('id="spray-chart-layer" index:', idx);
if (idx !== -1) {
  console.log('--- Spray chart layer snippet ---');
  console.log(html.substring(idx - 400, idx + 800));
}

// Search for other tabs in index.html
const allTabIds = [];
const reg = /id=["'](tab-[a-zA-Z0-9\-_]+)["']/g;
let m;
while ((m = reg.exec(html)) !== null) {
  allTabIds.push(m[1]);
}
console.log('\nAll tab- IDs in html:', allTabIds);
