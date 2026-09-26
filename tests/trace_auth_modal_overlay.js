const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const overlayIdx = html.indexOf('id="auth-modal-overlay"');
const nextModalIdx = html.indexOf('id="modal-nuevo-juego"');
const sub = html.substring(overlayIdx, nextModalIdx);

const tagRegex = /<\/?([a-zA-Z0-9\-]+)([^>]*)>/g;
let match;
const stack = [];

while ((match = tagRegex.exec(sub)) !== null) {
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
        stack.pop();
      } else {
        console.log(`Extra close </div> at offset ${match.index}`);
      }
    }
  }
}

console.log('Unclosed divs inside auth-modal-overlay:');
stack.forEach(s => console.log(s));
