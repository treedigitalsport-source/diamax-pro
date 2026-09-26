const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  idx++;
  if (idx === 3) {
    console.log(`Script block 3: length ${match[1].length}`);
    try {
      new Function(match[1]);
    } catch (e) {
      console.log('Error message:', e.message);
      // Find line
      const lines = match[1].split('\n');
      for (let i = 1; i <= lines.length; i++) {
        try {
          new Function(lines.slice(0, i).join('\n'));
        } catch (err) {
          if (!err.message.includes('Unexpected end of input')) {
            console.log(`Error near line ${i}: ${lines[i - 1]}`);
            console.log(lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 5)).join('\n'));
            break;
          }
        }
      }
    }
  }
}
