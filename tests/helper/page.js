const puppeteer = require('puppeteer');

class CustomPage {
  constructor(props) {
    this.props = props;
  }

  static async build() {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    const customPage = new CustomPage(page);
  }
}

module.exports = CustomPage;
