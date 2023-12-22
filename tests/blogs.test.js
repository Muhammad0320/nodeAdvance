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

  describe('And using valid input', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Test title');

      await page.type('.content input', 'My Test content');

      await page.click('form button');
    });

    test('submitting takes user to review screen', async () => {
      const confirmationText = await page.getContentOf('h5');

      expect(confirmationText).toEqual('Please confirm your entries');
    });

    test('Submitting then saves add blog to index page', async () => {
      await page.click('button.green');

      await page.waitFor('.card');

      const title = await page.getContentOf('.card-title');

      const content = await page.getContentOf('p');

      expect(title).toEqual('My Test title');

      expect(content).toEqual('My Test content');
    });
  });

  describe('And using invalid inprbbbut', async () => {
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

describe('when user is not signed in', async () => {
  test('show an error', async () => {
    const result = await page.evaluate(async () => {
      return fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          title: 'My title browser',
          content: 'My content',
        }),
      }).then(res => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('User cannot view list of blog posts', async () => {
    const result = await page.evaluate(() => {
      return fetch('/api/blogs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(res => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });
});
