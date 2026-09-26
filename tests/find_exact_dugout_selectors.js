const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Tactical IA section
const iaIdx = html.indexOf('DIAMAX TACTICAL IA');
if (iaIdx !== -1) {
  console.log('--- Tactical IA section snippet ---');
  console.log(html.substring(iaIdx, iaIdx + 2000));
}

// 2. Pitch tracker section
const pitchIdx = html.indexOf('LANZADOR ACTIVO');
if (pitchIdx !== -1) {
  console.log('\n--- Pitch tracker section snippet ---');
  console.log(html.substring(pitchIdx, pitchIdx + 2000));
}

// 3. Scoreboard inning and runs
const scIdx = html.indexOf('INNING 1');
if (scIdx !== -1) {
  console.log('\n--- Scoreboard snippet ---');
  console.log(html.substring(scIdx - 200, scIdx + 2000));
}
