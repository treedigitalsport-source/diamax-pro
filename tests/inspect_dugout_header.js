const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const badgeIdx = html.indexOf('id="network-status-badge"');
console.log(html.substring(badgeIdx - 1500, badgeIdx + 100));
