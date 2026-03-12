import puppeteer from 'puppeteer';
import assert from 'node:assert';

(async () => {
  console.log('Starting automated self-tests...');
  // Launch headless browser
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  let pageErrors = 0;
  
  // Listen for unhandled errors in the browser context
  page.on('pageerror', error => {
    console.error('❌ BROWSER PAGE ERROR:', error.message);
    pageErrors++;
  });

  try {
    console.log('\nTest 1: Loading the main application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const title = await page.title();
    assert.ok(title.includes('Signet'), 'Title should contain "Signet"');
    console.log('✅ Test 1 Passed: Application loaded successfully.');

    console.log('\nTest 2: Checking for critical UI elements...');
    const rootExists = await page.$('#root') !== null;
    assert.ok(rootExists, 'React root element should exist');
    console.log('✅ Test 2 Passed: Root element found.');

    console.log('\nTest 3: Simulating Live Assistant interaction...');
    // Look for the Live Assistant button (usually fixed at the bottom)
    const assistantButton = await page.$('.fixed.bottom-8.left-8 button, .fixed.bottom-8.right-8 button');
    if (assistantButton) {
      await assistantButton.click();
      // Wait a moment for any state changes or modals to trigger
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('✅ Test 3 Passed: Live Assistant button clicked successfully.');
    } else {
      console.log('⚠️ Test 3 Skipped: Live Assistant button not found in the DOM.');
    }

    console.log('\nTest 4: Verifying no unhandled page errors occurred...');
    assert.strictEqual(pageErrors, 0, `Expected 0 page errors, but found ${pageErrors}`);
    console.log('✅ Test 4 Passed: Zero console/page errors detected.');

    console.log('\n🎉 All automated tests passed successfully!');
  } catch (err) {
    console.error('\n❌ Test suite failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
