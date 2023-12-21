const CustomPage = require('./helper/page');

let page;

beforeEach(async () => {
  page = await CustomPage.build();

  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();

    await page.click('a.btn-floating');
  });

  test('Can see blogs create form', async () => {
    const label = await page.getContentOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('And using invalid input', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentOf('.title .red-text');

      const contentError = await page.getContentOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');

      expect(contentError).toEqual('You must provide a value');
    });
  });
});
