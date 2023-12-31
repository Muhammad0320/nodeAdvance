const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;
const keygrip = new Keygrip([keys.cookieKey]);

const sessionFactory = user => {
  const sessionObj = {
    passport: {
      user: user._id.toString(),
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  const sig = keygrip.sign('session=' + session);

  return { sig, session };
};

module.exports = sessionFactory;
