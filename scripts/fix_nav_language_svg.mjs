import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');
let h = fs.readFileSync(indexPath, 'utf8');

const re = /const (tab\w+) = document\.getElementById\('(btn-go-scorer|nav-lineup|btn-view-field|nav-manual|nav-card|nav-skills|nav-profile)'\);\r?\n(\s*)if \(\1\) \1\.innerHTML = '<span>' \+ \(isEsLocale \? '([^']*)' : '([^']*)'\) \+ '<\/span>';/g;
let n = 0;
h = h.replace(re, (m, v, id, indent, es, en) => {
  n++;
  return `const ${v} = document.getElementById('${id}');\r\n${indent}if (${v}) { let _sp = ${v}.querySelector('span'); if (!_sp) { _sp = document.createElement('span'); ${v}.appendChild(_sp); } _sp.textContent = (isEsLocale ? '${es}' : '${en}'); }`;
});
console.log('reemplazos:', n);
if (n !== 7) throw new Error('Se esperaban 7 reemplazos');
fs.writeFileSync(indexPath, h, 'utf8');
