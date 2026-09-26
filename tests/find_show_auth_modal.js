const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const fnIdx = html.indexOf('function showAuthModal');
if (fnIdx !== -1) {
  console.log(html.substring(fnIdx, fnIdx + 1500));
} else {
  console.log('function showAuthModal not found, searching for showAuthModal');
  let pos = 0;
  while ((pos = html.indexOf('showAuthModal', pos)) !== -1) {
    console.log(`Match at ${pos}:`);
    console.log(html.substring(pos - 50, pos + 250));
    pos += 13;
  }
}
