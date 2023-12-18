const puppeteer = require('puppeteer');
const sessionFactory = require('./factory/sessionFactory');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();

  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('the header has a correct header', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('show logout button, when signed in', async () => {
  //   const id = '6579ad679350c94938ec3951';

  const { session, sig } = sessionFactory();

  await page.setCookie({ name: 'session', value: session });

  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('localhost:3000');

  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
});
