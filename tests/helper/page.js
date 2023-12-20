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

    await this.page.goto('localhost:3000');

    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentOf(selector) {
    const content = await this.page.$eval(selector, el => el.innerHTML);

    return content;
  }
}

module.exports = CustomPage;
