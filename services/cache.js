const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
  console.log("I'M ABOUT TO RUN A QUERY");
  //   console.log('Let\'s see ');

  return exec.apply(this, arguments);
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
