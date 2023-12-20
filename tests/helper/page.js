const puppeteer = require('puppeteer');

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
        return target[property] || page[property] || browser[property];
      },
    });

    return superPage;
  }
}

const buildPage = CustomPage.build();

module.exports = buildPage;
