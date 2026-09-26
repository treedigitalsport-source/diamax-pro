const { execSync } = require('child_process');

const show = execSync(`git show 7c4c1b3:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const titleIdx = show.indexOf('p1-title-welcome');
console.log(show.substring(titleIdx - 200, titleIdx + 1500));
