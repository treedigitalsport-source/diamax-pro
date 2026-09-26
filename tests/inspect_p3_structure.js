const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Range 829000 to 833200 ---');
console.log(html.substring(829000, 833200));

console.log('\n\n--- Range 892500 to 896600 ---');
console.log(html.substring(892500, 896600));
