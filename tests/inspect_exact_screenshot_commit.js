const { execSync } = require('child_process');

const commits = ['30759ed', 'db0c408', 'a6408f4', 'b1e3a3a'];

for (const c of commits) {
  try {
    const html = execSync(`git show ${c}:index.html`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const p1Idx = html.indexOf('id="diamax-page-1"');
    const p2Idx = html.indexOf('id="diamax-page-2"');
    console.log(`====================== COMMIT ${c} ======================`);
    console.log(html.substring(p1Idx, Math.min(p1Idx + 4000, p2Idx)));
  } catch (e) {
    console.log(`Error in commit ${c}:`, e.message);
  }
}
