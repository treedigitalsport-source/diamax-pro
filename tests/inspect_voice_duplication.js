const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
let idx = 0;
while ((idx = html.indexOf('modal-voice-lineup', idx)) !== -1) {
  matches.push(idx);
  idx += 18;
}
console.log('modal-voice-lineup positions:', matches);

matches.forEach((pos, i) => {
  console.log(`\n=== Voice Modal #${i+1} at index ${pos} ===`);
  console.log(html.substring(Math.max(0, pos - 150), Math.min(html.length, pos + 250)));
});
