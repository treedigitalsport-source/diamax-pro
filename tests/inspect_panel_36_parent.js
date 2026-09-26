const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p36Idx = html.indexOf('id="panel-36-plays"');
console.log('p36Idx:', p36Idx);
if (p36Idx !== -1) {
  console.log('--- 1000 chars before panel-36-plays ---');
  console.log(html.substring(p36Idx - 1000, p36Idx + 300));
}
