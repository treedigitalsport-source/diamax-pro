const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="modal-nuevo-juego"');
console.log(html.substring(idx + 2500, idx + 7500));
