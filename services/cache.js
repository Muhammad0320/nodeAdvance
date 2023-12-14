const mongoose = require('mongoose');

const util = require('util');

const redis = require('redis');

const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);

client.get = util.promisify(client.get);

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
    console.log(cachedValue);

    const doc = new this.model(JSON.parse(cachedValue));

    return doc;
  }

  const result = await exec.apply(this, arguments);

  console.log(result);

  // kareem

  client.set(key, result);
};

/*


const redis = require('redis');

const util = require('util');

             const blogs = await Blog.find({ _user: req.user.id });

    const redisUrl = "redis://127.0.0.1:6379";

    const client = redis.createClient(redisUrl);

    client.get = util.promisify(client.get);

    const cachedBlog = await client.get(req.user.id);

    console.log("What is happening");

    if (cachedBlog) {
      console.log("From redis");

      return res.send(JSON.parse(cachedBlog));
    }

    console.log("From mongoDB");

    res.send(blogs);

    client.set(req.user.id, JSON.stringify(blogs));


*/
