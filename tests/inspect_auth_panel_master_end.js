const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const masterIdx = html.indexOf('id="auth-panel-master"');
const nextModalIdx = html.indexOf('id="modal-nuevo-juego"');
console.log('--- Substring between master panel and next modal ---');
console.log(html.substring(masterIdx + 4000, nextModalIdx));
