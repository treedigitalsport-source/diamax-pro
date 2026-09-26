const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const authModalIdx = html.indexOf('showAuthModal');
const modalDefIdx = html.indexOf('auth-modal-overlay') !== -1 ? html.indexOf('auth-modal-overlay') : html.indexOf('modal');
console.log('showAuthModal at:', authModalIdx);
console.log('modalDefIdx at:', modalDefIdx);

// Let's search for the actual HTML modal container
const modalMatch = html.match(/<div[^>]*id=["'][^"']*modal[^"']*["'][\s\S]*?<\/form>/i);
if (modalMatch) {
  console.log('Found modal container:');
  console.log(modalMatch[0].substring(0, 1500));
}
