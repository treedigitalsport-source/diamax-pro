const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tLineup = html.indexOf('id="tab-lineup"');
const tCampo = html.indexOf('id="tab-campo"');
const tField = html.indexOf('id="tab-field"');

console.log('id="tab-lineup" index:', tLineup);
console.log('id="tab-campo" index:', tCampo);
console.log('id="tab-field" index:', tField);

if (tLineup !== -1) {
  console.log('\n--- tab-lineup snippet ---');
  console.log(html.substring(tLineup - 50, tLineup + 500));
}

if (tCampo !== -1) {
  console.log('\n--- tab-campo snippet ---');
  console.log(html.substring(tCampo - 50, tCampo + 500));
}

if (tField !== -1) {
  console.log('\n--- tab-field snippet ---');
  console.log(html.substring(tField - 50, tField + 500));
}
