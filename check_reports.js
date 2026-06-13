const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Click on the Reports tab
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.sidebar-item');
    for (const tab of tabs) {
      if (tab.innerText.includes('Reports')) {
        tab.click();
        break;
      }
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();