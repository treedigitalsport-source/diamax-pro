const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const cssIdx = html.indexOf('.responsive-grid-split');
console.log('.responsive-grid-split CSS index:', cssIdx);
if (cssIdx !== -1) {
  console.log(html.substring(cssIdx - 50, cssIdx + 400));
}
