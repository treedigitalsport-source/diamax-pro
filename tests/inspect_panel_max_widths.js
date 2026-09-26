const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /(max-width|width)\s*:\s*([0-9]+px|[0-9]+%)/g;
let m;

// Check inside tab-envivo
const tEnvivo = html.indexOf('id="tab-envivo"');
const tLineup = html.indexOf('id="tab-lineup"');
const envivoHTML = html.substring(tEnvivo, tLineup);

console.log('--- Widths inside tab-envivo ---');
while ((m = regex.exec(envivoHTML)) !== null) {
  if (m[0].includes('px') && parseInt(m[2]) > 200) {
    console.log(`Found ${m[0]} at offset ${m.index} in tab-envivo snippet:`, envivoHTML.substring(Math.max(0, m.index - 40), Math.min(envivoHTML.length, m.index + 80)).replace(/\n/g, ' '));
  }
}
