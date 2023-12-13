const mongoose = require("mongoose");

const util = require("util");

const redis = require("redis");

const requireLogin = require("../middlewares/requireLogin");

const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    console.log("hello");
    const blogs = await Blog.find({ _user: req.user.id });

    const redisUrl = "redis://127.0.0.1:6379";

    const client = redis.createClient(redisUrl);

    client.get = util.promisify(client.get);

    const cachedBlog = await client.get(req.user.id);

    console.log("What is happening");

    if (cachedBlog) {
      console.log("From redis");
      return res.send(cachedBlog);
    }

    res.send(blogs);

    console.log("From mongoDB");
  });

  app.post("/api/blogs", requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
