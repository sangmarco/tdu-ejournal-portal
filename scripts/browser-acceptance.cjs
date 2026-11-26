// Live, read-only acceptance. Install Playwright externally or locally, then set
// PLAYWRIGHT_MODULE to its absolute module directory if it is not locally installed.
// CommonJS permits resolving an optional external runner without changing app dependencies.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const assert = require('node:assert/strict');
const base = process.env.ACCEPTANCE_BASE_URL || 'http://localhost:3000';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  let passed = 0;
  try {
    for (const width of [1440, 1024, 768, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      for (const locale of ['vi', 'en']) {
        const routes = ['', '/journals', '/journals/tapchi1', '/journals/tapchi2', '/journals/tapchi1/issues/1', '/journals/tapchi2/issues/2', '/journals/tapchi1/articles/1', '/journals/tapchi1/articles/2', '/journals/tapchi2/articles/3', '/search'];
        for (const route of routes) {
          const name = `${width} /${locale}${route}`;
          try {
            errors.length = 0;
            const response = await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
            assert.equal(response.status(), 200);
            assert(await page.locator('main h1').count() > 0, 'missing main heading');
            assert.equal(await page.locator('main [role=alert]').count(), 0, 'source alert');
            assert(await page.evaluate(() => innerWidth === document.documentElement.clientWidth && document.documentElement.scrollWidth <= innerWidth + 1), 'horizontal overflow');
            await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), '#main-content', 'first Tab must reach skip link');
            assert(await page.locator('a[href="#main-content"]').isVisible());
            await page.keyboard.press('Enter');
            assert.equal(await page.evaluate(() => document.activeElement?.id), 'main-content', 'skip link must focus main');
            const other = locale === 'vi' ? 'en' : 'vi';
            assert.equal(await page.locator(`header a[hreflang=${other}]`).getAttribute('href'), `/${other}${route}`);
            if (route === '/search') assert.match(await page.locator('[role=status]:visible').innerText(), /^3 /);
            if (route === '/journals/tapchi2') assert(await page.locator(`a[href="/${locale}/journals/tapchi2/articles/3"]`).count() > 0);
            assert.deepEqual(errors, [], 'browser errors');
            passed++;
          } catch (e) { failures.push({ name, error: e.message }); }
        }
        try {
          await page.goto(`${base}/${locale}/search?q=&journal=tapchi2`, { waitUntil: 'networkidle' });
          assert.match(await page.locator('[role=status]:visible').innerText(), /^1 /);
          const other = locale === 'vi' ? 'en' : 'vi';
          await page.locator(`header a[hreflang=${other}]`).focus();
          await page.keyboard.press('Enter');
          await page.waitForURL(`**/${other}/search?q=&journal=tapchi2`);
          await page.waitForLoadState('networkidle');
          await page.locator('#search-query:visible').fill('zzzz-no-matching-publication-zzzz');
          await page.locator('#search-query:visible').press('Enter');
          await page.waitForLoadState('networkidle');
          assert.match(await page.locator('[role=status]:visible').innerText(), /^0 /);
          if (width === 375) {
            const button = page.locator('header button[aria-controls="mobile-navigation"]:visible');
            await button.focus();
            await page.keyboard.press('Enter');
            assert.equal(await button.getAttribute('aria-expanded'), 'true');
            await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), `/${other}`);
            await page.keyboard.press('Enter');
            await page.waitForURL(`${base}/${other}`);
            assert.equal(await button.getAttribute('aria-expanded'), 'false');
          }
          passed++;
        } catch (e) { failures.push({ name: `${width} ${locale} interactions`, error: e.message }); }
      }
      await context.close();
    }
  } finally { await browser.close(); }
  console.log(JSON.stringify({ passed, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
