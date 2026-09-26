const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="panel-36-plays"');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 1500));
} else {
  console.log('panel-36-plays not found');
}
