const CustomPage = require('./helper/page');

let page;

beforeEach(async () => {
  page = await CustomPage.build();

  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('the header has a correct header', async () => {
  const text = await page.getContentOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('show logout button, when signed in', async () => {
  await page.login();

  //   const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  const text = await page.getContentOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');
});
