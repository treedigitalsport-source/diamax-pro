const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log('HTML files in directory:', files);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n=== File: ${f} ===`);
  console.log('Contains tab-lineup:', content.includes('id="tab-lineup"'));
  console.log('Contains tab-campo:', content.includes('id="tab-campo"'));
  console.log('Contains tab-field:', content.includes('id="tab-field"'));
  console.log('Contains Lineup Builder text:', content.includes('Lineup Builder'));
  console.log('Contains Spray Chart text:', content.includes('Spray Chart'));
});
