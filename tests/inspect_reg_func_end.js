const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('function ejecutarRegistroOficial');
console.log(html.substring(idx + 1000, idx + 3000));
