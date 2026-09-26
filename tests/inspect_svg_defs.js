const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Let's inspect the SVG definition in defs:
const defsStart = html.indexOf('<defs>');
const defsEnd = html.indexOf('</defs>');
console.log('--- DEFS CONTENT ---');
console.log(html.substring(defsStart, Math.min(defsStart + 3000, defsEnd + 10)));
