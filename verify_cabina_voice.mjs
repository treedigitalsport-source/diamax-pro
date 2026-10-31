import fs from 'fs';

const html = fs.readFileSync('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html', 'utf-8');

const checks = [
  { name: 'Button Dictar Nota', pattern: 'id="btn-dictar-nota-cabina"' },
  { name: 'Target Batter Button', pattern: 'id="btn-note-target-batter"' },
  { name: 'Notes Container', pattern: 'id="cockpit-notes-container"' },
  { name: 'Active Batter Note Highlight', pattern: 'id="cockpit-batter-active-note"' },
  { name: 'Interim Dictation Box', pattern: 'id="cockpit-dictado-interim"' },
  { name: 'CabinaVoiceNotes Class', pattern: 'class CabinaVoiceNotes' },
  { name: 'window.cabinaVoice instance', pattern: 'window.cabinaVoice = new CabinaVoiceNotes();' },
  { name: 'renderizarNotasCabina function', pattern: 'function renderizarNotasCabina()' },
  { name: 'renderizarNotasCabina call in cockpit', pattern: 'renderizarNotasCabina();' },
  { name: 'SpeechRecognition es-419', pattern: "recognition.lang = 'es-419'" }
];

let allOk = true;
for (const c of checks) {
  const found = html.includes(c.pattern);
  console.log(`[${found ? 'OK' : 'FAIL'}] ${c.name}`);
  if (!found) allOk = false;
}

// Verify no TTS buttons in cockpit
const forbiddenPatterns = [
  'narrarTextoCabina',
  'narrarSituacionCabinaCompleta',
  'narrarFraseCabina',
  'narrarPildoraTexto'
];

for (const f of forbiddenPatterns) {
  const found = html.includes(f);
  console.log(`[${!found ? 'OK (CLEANED)' : 'WARN (STILL PRESENT)'}] ${f}`);
  if (found) allOk = false;
}

if (allOk) {
  console.log('ALL VERIFICATIONS PASSED 100%!');
} else {
  console.error('VERIFICATION FAILED!');
  process.exit(1);
}
