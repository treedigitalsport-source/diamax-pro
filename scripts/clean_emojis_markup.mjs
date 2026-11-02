import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
const APPLY = process.argv.includes('--apply');
const html = fs.readFileSync(indexPath, 'utf8');

// Glifos permitidos: cierre ✕, check ✓, rating ★, y funcionales ⌫ ↩ ⏻ ↗ → ←
const KEEP = new Set(['\u2715', '\u2713', '\u2605', '\u232B', '\u21A9', '\u23FB', '\u2197', '\u2192', '\u2190']);
const DOT = { '\u{1F7E2}': 'green', '\u{1F7E1}': 'amber', '\u{1F534}': 'red', '\u26AA': 'neutral', '\u{1F7E0}': 'amber', '\u{1F535}': 'neutral' };
const ARROW = { '\u2B05': '\u2190', '\u27A1': '\u2192', '\u2794': '\u2192' };
const CAMERA_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5C4 7.67 4.67 7 5.5 7H8L9.5 5H14.5L16 7H18.5C19.33 7 20 7.67 20 8.5V17.5C20 18.33 19.33 19 18.5 19H5.5C4.67 19 4 18.33 4 17.5V8.5Z"/><circle cx="12" cy="12.5" r="3"/></svg>';

const EC = '[\\u{1F000}-\\u{1FAFF}\\u{2190}-\\u{21FF}\\u{2300}-\\u{23FF}\\u{2600}-\\u{27BF}\\u{2B00}-\\u{2BFF}\\u{FE0F}\\u{200D}]';
const runRe = new RegExp('([ \\t\\u00A0]?)(' + EC + '+)([ \\t\\u00A0]?)', 'gu');
const stats = {};

function cleanText(s) {
  return s.replace(runRe, (m, pre, run, post) => {
    const out = [];
    for (const c of [...run]) {
      if (c === '\uFE0F' || c === '\u200D') continue;
      if (DOT[c]) { stats[c] = (stats[c] || 0) + 1; out.push(`<span class="dx-dot dx-dot-${DOT[c]}" aria-hidden="true"></span>`); continue; }
      if (ARROW[c]) { stats[c] = (stats[c] || 0) + 1; out.push(ARROW[c]); continue; }
      if (KEEP.has(c)) { out.push(c); continue; }
      stats[c] = (stats[c] || 0) + 1;
    }
    if (!out.length) return pre && post ? ' ' : '';
    return (pre ? ' ' : '') + out.join('') + (post ? ' ' : '');
  });
}

const textAttrRe = /\b(title|placeholder|alt|aria-label)="([^"]*)"/g;
function cleanTag(tag) {
  return tag.replace(textAttrRe, (m, k, v) => `${k}="${cleanText(v).trim()}"`);
}

function processMarkup(seg) {
  const tokens = seg.split(/(<[^>]*>)/);
  const orig = tokens.slice();
  let skipNext = false;
  let cameraNext = false;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith('<') && t.endsWith('>')) {
      if (/id="p2-emb-\d"/.test(t)) skipNext = true; // emblemas de equipo = contenido, no decoración
      if (/onclick="document\.getElementById\('input-rival-logo-file'\)\.click\(\)"/.test(t)) cameraNext = true;
      tokens[i] = cleanTag(t);
    } else if (t) {
      if (skipNext) { skipNext = false; continue; }
      if (cameraNext && /\u{1F4F7}/u.test(t)) { cameraNext = false; tokens[i] = CAMERA_SVG; stats['📷→svg'] = 1; continue; }
      tokens[i] = cleanText(t);
    }
  }
  // retirar envoltorios que solo contenian un emoji (sin id ni onclick)
  for (let i = 1; i < tokens.length - 1; i++) {
    const open = tokens[i - 1], close = tokens[i + 1];
    const mo = /^<(div|span)\b/.exec(open);
    if (mo && tokens[i].trim() === '' && orig[i].trim() !== '' && close === '</' + mo[1] + '>' && !/\b(?:id|onclick)=/.test(open) && /^<(div|span)\b/.test(open)) {
      tokens[i - 1] = ''; tokens[i + 1] = ''; global.__wrappers = (global.__wrappers || 0) + 1;
    }
  }
  return tokens.join('');
}

const parts = html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->)/gi);
let out = parts.map((p, i) => (i % 2 === 1 ? p : processMarkup(p))).join('');

let wrappers = global.__wrappers || 0;
const removed = Object.values(stats).reduce((a, b) => a + b, 0);
console.log('Glifos eliminados/convertidos:', removed, '| envoltorios vacíos retirados:', wrappers);
const emptyBtn = /<button\b[^>]*>\s*<\/button>/gi;
console.log('Botones vacíos antes/después:', (html.match(emptyBtn) || []).length, (out.match(emptyBtn) || []).length);

if (APPLY) {
  const css = `
/* Punto de estado de 6px (regla Apple HIG aprobada) */
.dx-dot{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:6px;vertical-align:middle;background:#8E8E93}
.dx-dot-green{background:#34C759}.dx-dot-amber{background:#FF9F0A}.dx-dot-red{background:#FF453A}.dx-dot-neutral{background:#8E8E93}
`;
  const marker = '/* Header & Ribbon Interactive Buttons */';
  if (!out.includes('.dx-dot{')) out = out.replace(marker, css + '\n' + marker);
  fs.writeFileSync(indexPath, out, 'utf8');
  console.log('✅ index.html actualizado.');
} else {
  console.log('(dry-run; use --apply)');
}
