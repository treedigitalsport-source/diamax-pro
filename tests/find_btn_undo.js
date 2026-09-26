const fs = require('fs');
const html = fs.readFileSync('v_original_aprobada.html', 'utf8');

const idx = html.indexOf('btn-undo-keypad');
if (idx !== -1) {
  console.log(html.substring(idx - 200, idx + 800));
} else {
  console.log('btn-undo-keypad not found in v_original_aprobada');
}
