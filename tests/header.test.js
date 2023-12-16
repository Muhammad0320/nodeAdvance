const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();

  await page.goto('localhost:3000');
});

test('Add two numbers', () => {
  const sum = 5 + 5;

  expect(sum).toEqual(10);
});

test('we can launch the browser', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});
