import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3001');
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Find the container with text "Scout Profile" and click it
  const clickSuccess = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('h3'));
    const target = els.find(e => e.textContent.includes('Scout Profile'));
    if (target) {
      // Click the parent div
      target.closest('div[class*="group"]').click();
      return true;
    }
    return false;
  });
  
  console.log('Clicked module:', clickSuccess);

  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
