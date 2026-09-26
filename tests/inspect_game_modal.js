const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find modal-nuevo-juego
const idx = html.indexOf('id="modal-nuevo-juego"');
if (idx !== -1) {
  console.log('modal-nuevo-juego found at line ~' + html.substring(0, idx).split('\n').length);
  console.log(html.substring(idx, idx + 2500));
} else {
  console.log('modal-nuevo-juego not found');
}
