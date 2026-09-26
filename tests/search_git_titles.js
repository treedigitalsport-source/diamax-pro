const { execSync } = require('child_process');

const commits = execSync('git log -n 25 --pretty=format:"%h %s"', { encoding: 'utf8' }).trim().split('\n');

for (const line of commits) {
  const hash = line.split(' ')[0];
  try {
    const show = execSync(`git show ${hash}:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const match = show.match(/BIENVENIDO[\s\S]{1,300}?(?:PRO|<\/h1>|<\/div>)/i);
    if (match) {
      console.log(`=== COMMIT ${hash}: ${line} ===`);
      console.log(match[0]);
    }
  } catch (e) {
    // ignore
  }
}
