const { execSync } = require('child_process');

const html = execSync(`git show 30759ed:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const p1Start = html.indexOf('id="diamax-page-1"');
const p2Start = html.indexOf('id="diamax-page-2"');
console.log(html.substring(p1Start, p2Start));
