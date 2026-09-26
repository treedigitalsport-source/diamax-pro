const { execSync } = require('child_process');
const fs = require('fs');

const logOutput = execSync('git log --pretty=format:"%h||%ci||%cr||%s" -n 25', { encoding: 'utf8' }).trim().split('\n');

const versions = [];
logOutput.forEach((line, index) => {
  const [hash, date, relDate, subject] = line.split('||');
  versions.push({ index: index + 1, hash, date, relDate, subject });
});

console.log('Available historical versions:');
console.table(versions);
