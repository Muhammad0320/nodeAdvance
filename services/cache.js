const util = require('util');
const redis = require('redis');
const mongoose = require('mongoose');

const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = { key: '' }) {
  this.useCache = true;

  this.hashKey = options.key;

  return this;
};

mongoose.Query.prototype.exec = async function () {
  //   console.log({ ...this.getQuery(), collection: this.mongooseCollection.name });

  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const cachedValue = await client.hget(this.hashKey, key);

  //   console.log(cachedValue);

  if (cachedValue) {
    const doc = JSON.parse(cachedValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  console.log(result);

  // kareem

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
};

module.exports = {
  clearCache(key) {
    client.del(key);
  },
};

/*





*/
