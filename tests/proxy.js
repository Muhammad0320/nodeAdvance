class Greetings {
  constructor() {}

  english() {
    return 'hello';
  }

  spanish() {
    return 'hallo';
  }
}

class MoreGreetings {
  constructor() {}

  german() {
    return 'hallo';
  }

  french() {
    return 'bonjour';
  }
}

const moreGreetings = new MoreGreetings();

const greetings = new Greetings();

const allGreetings = new Proxy(moreGreetings, {
  get: function (target, property) {
    return target[property] || greetings[property];
  },
});

console.log(allGreetings.french());

class Page {
  setCookie() {
    console.log("I'm setting the cookie");
  }

  goto() {
    console.log("I'm going to another page");
  }
}

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  login() {
    this.page.goto();
    this.page.setCookie();
  }
}

const page = new Page();

const customPage = new CustomPage();
