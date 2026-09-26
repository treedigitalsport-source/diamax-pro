const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const pinBtnIdx = html.indexOf('id="auth-tab-pin-btn"');
const pinPanelIdx = html.indexOf('id="auth-panel-pin"');

console.log('--- PIN BUTTON ---');
console.log(html.substring(pinBtnIdx - 50, pinBtnIdx + 400));

console.log('--- PIN PANEL ---');
console.log(html.substring(pinPanelIdx - 100, pinPanelIdx + 1200));
