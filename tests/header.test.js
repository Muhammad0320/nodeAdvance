const puppeteer = require('puppeteer');

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

test('show logout button, when logged in', () => {
  const Buffer = require('safe-buffer').Buffer;

  const Keygrip = require('keygrip');

  const id = '6579ad679350c94938ec3951';

  const sessionObj = {
    passport: {
      id,
    },
  };

  const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  const keys = require('../config/keys');

  const keygrip = new Keygrip([keys.cookieKey]);

  const sig = keygrip.sign('session=' + sessionStr);

  console.log(sig, sessionStr);
});
