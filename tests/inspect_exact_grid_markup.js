const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const gridIdx = html.indexOf('class="responsive-grid-split"');
console.log('gridIdx:', gridIdx);
if (gridIdx !== -1) {
  console.log(html.substring(gridIdx - 100, gridIdx + 1200));
}
