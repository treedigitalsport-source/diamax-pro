const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /p1-btn-(plans|login|ceo-key)/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(`Found ${m[0]} at index ${m.index}`);
}
