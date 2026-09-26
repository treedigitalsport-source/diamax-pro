const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  if (idx === 3) {
    const lines = match[1].split('\n');
    console.log('Lines 1340 to 1355 of block 3:');
    console.log(lines.slice(1335, 1355).map((l, i) => `${1336 + i}: ${l}`).join('\n'));
  }
}
