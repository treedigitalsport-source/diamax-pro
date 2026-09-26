const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('dugout-main-grid CSS found:', html.includes('.dugout-main-grid'));
console.log('panel-36-plays found:', html.includes('id="panel-36-plays"'));
console.log('tab-lineup found:', html.includes('id="tab-lineup"'));
console.log('tab-campo found:', html.includes('id="tab-campo"'));
console.log('Master Key 113714 found:', html.includes('113714'));
