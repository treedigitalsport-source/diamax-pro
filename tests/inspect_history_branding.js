const { execSync } = require('child_process');
const fs = require('fs');

const commits = ['b11a759', '209370c', 'cf7eb88', '4b5addd', '77ffc68', '9b58ccb', 'af171c4'];

commits.forEach(c => {
  try {
    const html = execSync(`git show ${c}:index.html`, { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
    
    // Header in Page 3
    const p3Start = html.indexOf('id="diamax-page-3"');
    const headerStart = html.indexOf('<div class="header-logo-container"', p3Start !== -1 ? p3Start : 0);
    
    console.log(`\n=================== COMMIT ${c} ===================`);
    if (headerStart !== -1) {
      console.log('--- HEADER LOGO CONTAINER ---');
      console.log(html.substring(headerStart, headerStart + 600));
    }
    
    // Check symbols or logos
    const logoSymbolIdx = html.indexOf('<symbol id="diamax-home-plate-symbol"');
    if (logoSymbolIdx !== -1) {
      console.log('--- LOGO SYMBOL ---');
      console.log(html.substring(logoSymbolIdx, logoSymbolIdx + 400));
    }
    
    const vaultSymbolIdx = html.indexOf('<symbol id="diamax-diamond-vault"');
    if (vaultSymbolIdx !== -1) {
      console.log('--- VAULT SYMBOL FOUND in', c);
    }
  } catch(e) {
    console.error(c, e.message);
  }
});
