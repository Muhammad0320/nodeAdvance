const puppeteer = require('puppeteer');
const userFactory = require('../factory/userFactory');
const sessionFactory = require('../factory/sessionFactory');

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static async build() {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    const customPage = new CustomPage(page);

    const superPage = new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || browser[property] || page[property];
      },
    });

    return superPage;
  }

  async login() {
    const user = await userFactory();

    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });

    await this.page.setCookie({ name: 'session.sig', value: sig });

    await this.page.goto('localhost:3000/blogs');

    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentOf(selector) {
    const content = await this.page.$eval(selector, el => el.innerHTML);

    return content;
  }

  async get(url) {
    const result = await this.page.evaluate(async _url => {
      return fetch(_url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(res => res.json());
    }, url);

    return result;
  }

  async post(url, data) {
    const result = await page.evaluate(
      async (_url, _data) => {
        return fetch(_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(_data),
        }).then(res => res.json());
      },
      url,
      data
    );

    return result;
  }

  // async sendRequest(data) {

  //   return Promise.all(

  //     data.map( async data  => {

  //       const result = await this.page.evaluate(() => {
  //       return fetch('/api/blogs', {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //         credentials: 'same-origin',
  //       }).then(res => res.json());
  //     }, )

  //   })

  //    )

  // }
}

module.exports = CustomPage;
