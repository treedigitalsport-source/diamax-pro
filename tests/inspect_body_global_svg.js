const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const bodyIdx = html.indexOf('<body');
console.log(html.substring(bodyIdx, bodyIdx + 2000));
