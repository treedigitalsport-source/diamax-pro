const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idx = html.indexOf('id="auth-modal-overlay"');
console.log('--- 800 chars before auth-modal-overlay ---');
console.log(html.substring(idx - 800, idx));
console.log('--- 800 chars after auth-modal-overlay ends (around line 16950) ---');
const idxVoice = html.indexOf('id="modal-voice-lineup"');
console.log('idxVoice:', idxVoice);
if (idxVoice !== -1) {
  console.log(html.substring(idxVoice - 400, idxVoice + 400));
}
