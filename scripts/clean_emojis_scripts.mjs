import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
const APPLY = process.argv.includes('--apply');
const html = fs.readFileSync(indexPath, 'utf8');

const KEEP = new Set(['\u2715', '\u2713', '\u2605', '\u232B', '\u21A9', '\u23FB', '\u2197', '\u2192', '\u2190']);
const ARROW = { '\u2B05': '\u2190', '\u27A1': '\u2192', '\u2794': '\u2192' };
const EC = '[\\u{1F000}-\\u{1FAFF}\\u{2190}-\\u{21FF}\\u{2300}-\\u{23FF}\\u{2600}-\\u{27BF}\\u{2B00}-\\u{2BFF}\\u{FE0F}\\u{200D}]';
const runRe = new RegExp('([ \\t\\u00A0]?)(' + EC + '+)([ \\t\\u00A0]?)', 'gu');
// Líneas cuyo emoji es DATO (emblemas de equipo, banderas de países/idioma): no se tocan
const PROTECT = /flag|Flag|BASEBALL_COUNTRIES|const list = \['⚾'|emblem|Emblem|seleccionarEmblema/;
const stats = {};

function cleanLine(line) {
  if (PROTECT.test(line)) return line;
  return line.replace(runRe, (m, pre, run, post) => {
    const out = [];
    for (const c of [...run]) {
      if (c === '\uFE0F' || c === '\u200D') continue;
      if (ARROW[c]) { out.push(ARROW[c]); stats[c] = (stats[c] || 0) + 1; continue; }
      if (KEEP.has(c)) { out.push(c); continue; }
      stats[c] = (stats[c] || 0) + 1;
    }
    if (!out.length) return pre && post ? ' ' : '';
    return (pre ? ' ' : '') + out.join('') + (post ? ' ' : '');
  });
}

const parts = html.split(/(<script\b[\s\S]*?<\/script>)/gi);
const out = parts.map((p, i) => (i % 2 === 1 ? p.split('\n').map(cleanLine).join('\n') : p)).join('');
const removed = Object.values(stats).reduce((a, b) => a + b, 0);
console.log('Glifos eliminados en scripts:', removed);
if (APPLY) { fs.writeFileSync(indexPath, out, 'utf8'); console.log('✅ aplicado'); } else console.log('(dry-run)');
