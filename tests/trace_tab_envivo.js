const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tEnvivo = html.indexOf('id="tab-envivo"');
const tManual = html.indexOf('id="tab-manual"');
const sub = html.substring(tEnvivo, tManual);

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
      const classMatch = match[2].match(/class=["']([^"']+)["']/i);
      const id = idMatch ? idMatch[1] : (classMatch ? `class:${classMatch[1]}` : '');
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

console.log('Unclosed divs inside tab-envivo:');
stack.forEach(s => console.log(s));
