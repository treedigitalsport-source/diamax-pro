const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('class="scoreboard"');
console.log(html.substring(idx - 600, idx + 2500));
