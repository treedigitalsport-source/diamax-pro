const { execSync } = require('child_process');

const show = execSync(`git show 7c4c1b3:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const heroStart = show.indexOf('id="diamax-hero-identity"');
console.log(show.substring(heroStart - 50, heroStart + 1200));
