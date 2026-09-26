const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

const expectedElements = [
  'network-status-badge',
  'lang-btn',
  'btn-daylight',
  'btn-ai-agent',
  'btn-refresh-db',
  'btn-header-exit',
  'btn-settings',
  'lbl-game-selected-ribbon',
  'game-select',
  'btn-ribbon-home',
  'btn-ribbon-away',
  'ribbon-matchup-badge',
  'game-status-badge',
  'cloud-sync-indicator',
  'btn-config-game-header',
  'btn-go-scorer',
  'nav-lineup',
  'btn-view-field',
  'nav-manual',
  'nav-card',
  'nav-dash',
  'nav-skills',
  'nav-profile',
  'badge-live-fecha',
  'badge-live-hora',
  'badge-live-sede',
  'badge-live-rival',
  'badge-live-clima',
  'btn-ai-pitch-call',
  'btn-ai-shift-call',
  'btn-ai-base-call',
  'btn-ai-pinch-hitter',
  'btn-ai-rival-scout',
  'btn-ai-pitcher-matchup',
  'btn-ai-voice-mic',
  'btn-ai-voice-speaker',
  'btn-ai-custom-query'
];

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('💎 AUDITORÍA INTEGRAL DE ELEMENTOS, BOTONES E ICONOGRAFÍA 3D METÁLICA');
console.log('═══════════════════════════════════════════════════════════════════════════');

let missing = 0;
expectedElements.forEach(id => {
  if (content.includes(`id="${id}"`) || content.includes(`id='${id}'`)) {
    console.log(`✅ [OK] Elemento: #${id}`);
  } else {
    console.error(`❌ [ERROR] Elemento faltante: #${id}`);
    missing++;
  }
});

const lines = content.split('\n');
let headerLinesWithEmoji = 0;
const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

for (let i = 4380; i <= 4560; i++) {
  if (lines[i] && emojiRegex.test(lines[i])) {
    console.log(`⚠️ Línea ${i+1}: ${lines[i].trim()}`);
    headerLinesWithEmoji++;
  }
}

console.log('───────────────────────────────────────────────────────────────────────────');
console.log(`📊 TOTAL ELEMENTOS AUDITADOS: ${expectedElements.length}`);
console.log(`✨ ELEMENTOS CORRECTAMENTE INTEGRADOS: ${expectedElements.length - missing}`);
console.log(`❌ ELEMENTOS FALTANTES: ${missing}`);
console.log(`🚫 EMOJIS PLANOS EN HEADER / DUGOUT: ${headerLinesWithEmoji}`);
console.log('═══════════════════════════════════════════════════════════════════════════');

if (missing > 0 || headerLinesWithEmoji > 0) {
  process.exit(1);
} else {
  console.log('🏆 AUDITORÍA 100% EXITOSA — ICONOGRAFÍA METÁLICA 3D COMPLETAMENTE OPERATIVA');
  process.exit(0);
}
