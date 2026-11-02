import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
const lines = html.split('\n');

const idRegex = /\bid="([^"]+)"/g;
const duplicatesToFind = [
  'diamax-icon-tactical-crosshair',
  'diamax-icon-lineup-dictate',
  'diamax-icon-boxscore-matrix',
  'diamax-icon-sabermetric-brain',
  'diamax-icon-ai-core',
  'diamax-icon-manager-badge',
  'diamax-icon-gear-precision',
  'diamax-icon-db-refresh',
  'diamax-icon-sun-moon',
  'diamax-icon-stadium-gate',
  'p1-bolt-grad',
  'btn-daylight-text',
  'header-refresh-db-text',
  'header-settings-text',
  'header-exit-text',
  'auth-reg-access-badge-text'
];

duplicatesToFind.forEach(id => {
  console.log(`\n--- ID: ${id} ---`);
  lines.forEach((l, idx) => {
    if (l.includes(`id="${id}"`)) {
      console.log(`  Line ${idx + 1}: ${l.trim().substring(0, 100)}`);
    }
  });
});
