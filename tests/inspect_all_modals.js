const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /id=["']([a-zA-Z0-9\-_]+modal[a-zA-Z0-9\-_]*)["']/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(`Found modal id: ${m[1]} at index ${m.index}`);
}
