const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
let pos = 0;
while ((pos = html.indexOf('PIN', pos)) !== -1) {
  matches.push(pos);
  pos += 3;
}

console.log(`Found ${matches.length} occurrences of 'PIN':`);
matches.forEach(m => {
  console.log(html.substring(Math.max(0, m - 50), Math.min(html.length, m + 200)));
  console.log('--------------------------------------------------');
});
