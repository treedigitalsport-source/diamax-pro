const { execSync } = require('child_process');

const show = execSync(`git show 7c4c1b3:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const p1Start = show.indexOf('id="diamax-page-1"');
const p2Start = show.indexOf('id="diamax-page-2"');
console.log(show.substring(p1Start, p2Start));
