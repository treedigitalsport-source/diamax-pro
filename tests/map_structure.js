const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /<!--\s*([^\-]+?)\s*-->/g;
let m;
while ((m = regex.exec(html)) !== null) {
  if (m.index >= 800000 && m.index <= 940000) {
    console.log(`Comment at index ${m.index}: ${m[1].trim().substring(0, 80)}`);
  }
}
