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
