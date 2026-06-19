const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    console.log("🚀 Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Catch console logs
    page.on('console', msg => {
      console.log(`[PAGE LOG] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    // Catch page errors
    page.on('pageerror', err => {
      console.error(`[PAGE ERROR]:`, err);
    });

    console.log("🌐 Navigating to http://localhost:3001...");
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    
    // Wait for the app to initialize
    await new Promise(r => setTimeout(r, 2000));
    
    // Evaluate if there are any errors on page or get state
    const title = await page.title();
    console.log(`Page Title: ${title}`);
    
    // Look for dataset in localStorage/indexedDB
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('genotype_scout_results') ? 'Present' : 'Absent';
    });
    console.log(`localStorage dataset state: ${localStorageData}`);
    
    // Evaluate DB status
    const dbStatus = await page.evaluate(async () => {
      try {
        const dbs = await window.indexedDB.databases();
        return dbs.map(d => d.name);
      } catch (e) {
        return e.message;
      }
    });
    console.log(`IndexedDB databases:`, dbStatus);

  } catch (err) {
    console.error("❌ Puppeteer run failed:", err);
  } finally {
    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }
  }
})();
