const mongoose = require('mongoose');

const { exec } = mongoose.Query.prototype;

mongoose.Query.prototype.exec = function () {
  console.log("I'M ABOUT TO RUN A QUERY");
  //   console.log('Let\'s see ');

  return exec.apply(this, arguments);
};
