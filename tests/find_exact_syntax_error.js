const fs = require('fs');
const vm = require('vm');

const content = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  if (idx === 3) {
    try {
      new vm.Script(match[1], { filename: 'block3.js' });
      console.log('Block 3 compiles fine in vm!');
    } catch (e) {
      console.log('VM Error:', e.stack);
    }
  }
}
