const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
let pos = 0;
while ((pos = html.indexOf('<header', pos)) !== -1) {
  matches.push(pos);
  pos += 7;
}

console.log(`Found ${matches.length} <header> tags:`);
matches.forEach((m, i) => {
  console.log(`--- HEADER #${i + 1} at position ${m} ---`);
  console.log(html.substring(m, m + 800));
});
