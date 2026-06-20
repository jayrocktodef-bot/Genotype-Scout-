const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.toString()}`);
  });

  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
    console.log("Logged messages:");
    console.log(errors.join('\n'));
  } catch (e) {
    console.log("Failed to navigate:", e.message);
  } finally {
    await browser.close();
  }
})();
