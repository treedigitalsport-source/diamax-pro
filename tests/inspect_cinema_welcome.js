const fs = require('fs');

const html = fs.readFileSync('v6_hace_1_hora_49505bc.html', 'utf8');
const matches = [];
let pos = 0;
while ((pos = html.indexOf('diamax-cinema-welcome', pos)) !== -1) {
  matches.push(pos);
  pos += 21;
}

for (const m of matches) {
  console.log('--- MATCH AT', m, '---');
  console.log(html.substring(m - 100, m + 400));
}
