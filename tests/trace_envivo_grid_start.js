const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const bpIdx = html.indexOf('id="bullpen-relievers-container"');
const p36Idx = html.indexOf('id="panel-36-plays"');

console.log('--- Between Bullpen and panel-36-plays ---');
console.log(html.substring(bpIdx, p36Idx));
