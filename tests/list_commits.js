const { execSync } = require('child_process');

const commits = execSync('git log --pretty=format:"%h %s" -n 60', { encoding: 'utf8' }).split('\n');
console.log(commits);
