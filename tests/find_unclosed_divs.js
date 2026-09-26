const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p3 = html.indexOf('id="diamax-page-3"');
const overlay = html.indexOf('id="auth-modal-overlay"');
const p3Sub = html.substring(p3, overlay);

// Let's trace tags in p3Sub
const tagRegex = /<\/?([a-zA-Z0-9\-]+)([^>]*)>/g;
let match;
const stack = [];

while ((match = tagRegex.exec(p3Sub)) !== null) {
  const fullTag = match[0];
  const tagName = match[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'use'].includes(tagName);

  if (isSelfClosing) continue;

  if (tagName === 'div' || tagName === 'section' || tagName === 'main' || tagName === 'header' || tagName === 'nav') {
    if (!isClosing) {
      // get id if any
      const idMatch = match[2].match(/id=["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : '';
      stack.push({ tag: tagName, id: id, index: match.index });
    } else {
      if (stack.length > 0 && stack[stack.length - 1].tag === tagName) {
        stack.pop();
      } else {
        console.log(`Mismatched close </${tagName}> at offset ${match.index}. Top of stack:`, stack[stack.length - 1]);
      }
    }
  }
}

console.log('Remaining unclosed tags on stack before auth-modal-overlay:');
stack.forEach(item => console.log(item));
