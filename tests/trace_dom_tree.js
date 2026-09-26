const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of <div id="diamax-page-
const p1 = html.indexOf('id="diamax-page-1"');
const p2 = html.indexOf('id="diamax-page-2"');
const p3 = html.indexOf('id="diamax-page-3"');
const overlay = html.indexOf('id="auth-modal-overlay"');

console.log('p1:', p1, 'p2:', p2, 'p3:', p3, 'overlay:', overlay);

// Let's count open vs close div tags inside diamax-page-3 up to auth-modal-overlay
const p3Segment = html.substring(p3, overlay);
const openDivs = (p3Segment.match(/<div(\s|>)/gi) || []).length;
const closeDivs = (p3Segment.match(/<\/div>/gi) || []).length;

console.log('Inside P3 before auth-modal-overlay: open <div> count =', openDivs, 'close </div> count =', closeDivs, 'difference =', openDivs - closeDivs);
