const User = mongoose.model('User');
const mongoose = require('mongoose');

const userFactory = () => {
  return new User.create({});
};

module.exports = userFactory;
