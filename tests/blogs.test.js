const CustomPage = require('./helper/page');

let page;

beforeEach(async () => {
  page = await CustomPage.build();

  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('When logged in, can see blogs create form', async () => {
  await page.login();

  await page.click('a.btn-floating');
});
