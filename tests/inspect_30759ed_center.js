const { execSync } = require('child_process');

const html = execSync(`git show 30759ed:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const p1Center = html.indexOf('p1-title-welcome');
console.log(html.substring(p1Center - 400, p1Center + 1200));
