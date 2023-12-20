const puppeteer = require('puppeteer');
const sessionFactory = require('./factory/sessionFactory');
const userFactory = require('./factory/userFactory');
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
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('show logout button, when signed in', async () => {
  const user = await userFactory();

  const { session, sig } = sessionFactory(user);

  await page.setCookie({ name: 'session', value: session });

  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('localhost:3000');

  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
});
