const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tagRegex = /<\/?([a-zA-Z0-9\-]+)([^>]*)>/g;
let match;
const stack = [];

while ((match = tagRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const tagName = match[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'use'].includes(tagName);

  if (isSelfClosing) continue;

  if (tagName === 'div') {
    if (!isClosing) {
      const idMatch = match[2].match(/id=["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : '';
      stack.push({ tag: tagName, id: id, index: match.index });
    } else {
      if (stack.length > 0) {
        const popped = stack.pop();
        if (popped.id && (popped.id.startsWith('diamax-page') || popped.id.includes('modal') || popped.id.includes('overlay') || popped.id.includes('tab-'))) {
          console.log(`Closed <div id="${popped.id}"> at index ${match.index}`);
        }
      }
    }
  }
}

console.log('--- Unclosed divs at end of file ---');
stack.forEach(item => {
  if (item.id) console.log(item);
});
