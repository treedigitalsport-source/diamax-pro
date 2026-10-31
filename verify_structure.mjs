import fs from 'fs';

const html = fs.readFileSync('C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html', 'utf-8');

const navIdx = html.indexOf('<div class="nav" id="main-nav">');
const cabinaIdx = html.indexOf('<div id="tab-cabina"');
const envivoIdx = html.indexOf('<div id="tab-envivo"');

console.log('main-nav index:', navIdx);
console.log('tab-cabina index:', cabinaIdx);
console.log('tab-envivo index:', envivoIdx);

if (navIdx !== -1 && cabinaIdx !== -1 && envivoIdx !== -1) {
  if (navIdx < cabinaIdx && cabinaIdx < envivoIdx) {
    console.log('ORDER IS PERFECT: main-nav -> tab-cabina -> tab-envivo ✅');
  } else {
    console.error('Order mismatch!', { navIdx, cabinaIdx, envivoIdx });
    process.exit(1);
  }
} else {
  console.error('Missing IDs!');
  process.exit(1);
}
