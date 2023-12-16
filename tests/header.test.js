const puppeteer = require('puppeteer');

test('Add two numbers', () => {
  const sum = 5 + 5;

  expect(sum).toEqual(10);
});

test('we can launch the browser', async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
});
