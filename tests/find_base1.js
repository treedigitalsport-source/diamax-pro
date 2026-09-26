const fs = require('fs');

const html = fs.readFileSync('tests/inspect_panel_scoreboard.js', 'utf8');
const origHtml = fs.readFileSync('v_original_aprobada.html', 'utf8');

const idx = origHtml.indexOf('id="base-1"');
if (idx !== -1) {
  console.log('Found base-1 at:');
  console.log(origHtml.substring(idx - 400, idx + 1200));
}
