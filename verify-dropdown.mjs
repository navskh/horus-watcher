import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices['iPhone 12 Pro'],
});
const page = await ctx.newPage();
page.on('console', msg => console.log('[browser]', msg.type(), msg.text()));
await page.goto('http://localhost:3300/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Switch to DEP 242 mode to see PART button
await page.click('text=DEP 242');
await page.waitForTimeout(800);

// Take initial screenshot
await page.screenshot({ path: '/tmp/before-click.png', fullPage: false });

// Click PART 선택
await page.click('text=PART 선택');
await page.waitForTimeout(800);

// Take screenshot of dropdown opened
await page.screenshot({ path: '/tmp/after-click-part.png', fullPage: false });

// Check dropdown position
const measurements = await page.evaluate(() => {
  const ul = document.querySelector('ul.absolute');
  const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('PART'));
  return {
    ulBox: ul?.getBoundingClientRect()?.toJSON(),
    buttonBox: button?.getBoundingClientRect()?.toJSON(),
    viewport: { w: window.innerWidth, h: window.innerHeight },
  };
});
console.log('PART measurements:', JSON.stringify(measurements, null, 2));

// Close
await page.click('text=PART 선택');
await page.waitForTimeout(400);

// Click VERSE
await page.click('text=VERSE 선택');
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/after-click-verse.png', fullPage: false });

const measurements2 = await page.evaluate(() => {
  const ul = document.querySelector('ul.absolute');
  const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('VERSE'));
  return {
    ulBox: ul?.getBoundingClientRect()?.toJSON(),
    buttonBox: button?.getBoundingClientRect()?.toJSON(),
    viewport: { w: window.innerWidth, h: window.innerHeight },
  };
});
console.log('VERSE measurements:', JSON.stringify(measurements2, null, 2));

await browser.close();
