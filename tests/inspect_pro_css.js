const { execSync } = require('child_process');

const show = execSync(`git show 7c4c1b3:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const cssIdx = show.indexOf('/* 5. PALABRA: «PRO»');
console.log(show.substring(cssIdx - 50, cssIdx + 1200));
