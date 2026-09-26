const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p36Idx = html.indexOf('id="panel-36-plays"');
const gridOpening = html.lastIndexOf('<div', html.lastIndexOf('<div class="panel"', p36Idx - 10) - 10);
console.log('--- Container opening before panel-36-plays and left panel ---');
console.log(html.substring(gridOpening - 200, gridOpening + 300));
