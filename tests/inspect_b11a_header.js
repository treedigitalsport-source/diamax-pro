const { execSync } = require('child_process');
const fs = require('fs');

const b11aHtml = execSync('git show b11a759:index.html', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
const p3Idx = b11aHtml.indexOf('id="diamax-page-3"');
const headerIdx = b11aHtml.indexOf('class="header"', p3Idx);
console.log(b11aHtml.substring(headerIdx, headerIdx + 2000));
