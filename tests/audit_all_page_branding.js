const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Find all logo / branding occurrences
const lines = html.split('\n');
const brandingOccurrences = [];

lines.forEach((line, idx) => {
  if (
    line.includes('DIAMAX') ||
    line.includes('diamax-home-plate-symbol') ||
    line.includes('logo-Photoroom') ||
    line.includes('hp3d-') ||
    line.includes('brand-title') ||
    line.includes('header-brand') ||
    line.includes('ribbon') ||
    line.includes('p1-') ||
    line.includes('p2-') ||
    line.includes('p3-') ||
    line.includes('irAPagina')
  ) {
    if (line.includes('<img') || line.includes('<svg') || line.includes('class="') || line.includes('id="') || line.includes('<h1') || line.includes('<h2') || line.includes('<h3')) {
      brandingOccurrences.push({ lineNum: idx + 1, content: line.trim() });
    }
  }
});

console.log(`Found ${brandingOccurrences.length} potential branding lines`);
brandingOccurrences.slice(0, 50).forEach(o => console.log(`[L${o.lineNum}] ${o.content}`));
