const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle2' });

  // Switch to Page 3
  await page.evaluate(() => {
    irAPagina(3);
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/screenshot_p3_dugout_verified.png' });
  console.log('Saved screenshot of Page 3 to tests/screenshot_p3_dugout_verified.png');

  await browser.close();
})();
