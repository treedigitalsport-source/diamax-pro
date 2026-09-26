const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const tManual = html.indexOf('id="tab-manual"');
const sub = html.substring(tEnvivo, tManual);

const openDivs = (sub.match(/<div(\s|>)/gi) || []).length;
const closeDivs = (sub.match(/<\/div>/gi) || []).length;

console.log('tab-envivo open <div>:', openDivs, 'close </div>:', closeDivs, 'diff:', openDivs - closeDivs);
