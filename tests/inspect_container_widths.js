const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find container styles
const containerRegex = /\.container\s*\{[^}]+\}/g;
let m;
while ((m = containerRegex.exec(html)) !== null) {
  console.log('Container CSS match:', m[0]);
}

const page3Regex = /#diamax-page-3\s*\{[^}]+\}/g;
while ((m = page3Regex.exec(html)) !== null) {
  console.log('#diamax-page-3 CSS match:', m[0]);
}

const panelRegex = /\.panel\s*\{[^}]+\}/g;
while ((m = panelRegex.exec(html)) !== null) {
  console.log('.panel CSS match:', m[0]);
}

const splitRegex = /\.responsive-grid-split\s*\{[^}]+\}/g;
while ((m = splitRegex.exec(html)) !== null) {
  console.log('.responsive-grid-split CSS match:', m[0]);
}
