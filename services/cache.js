const util = require('util');
const redis = require('redis');
const mongoose = require('mongoose');

const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);

// client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  client.get = util.promisify(client.get);

  //   console.log({ ...this.getQuery(), collection: this.mongooseCollection.name });

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const cachedValue = await client.get(key);

  if (cachedValue) {
    console.log('odehhhhhhhhhhhhhhhhhh');

    console.log(cachedValue);

    const doc = JSON.parse(cachedValue);
    console.log('hjdbehjvbfehv elh');
    console.log(doc);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  console.log(result);

  // kareem

  client.set(key, JSON.stringify(result));
};

/*





*/
