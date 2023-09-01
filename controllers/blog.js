const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }

  // Blog.find({})
  //   .then((blogs) => {
  //     response.json(blogs);
  //   })
  //   .catch((error) => next(error));
});

blogRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const removedBlog = await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }

  // Blog.findByIdAndRemove(id)
  //   .then(() => {
  //     response.status(204).end();
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
});

blogRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;
  try {
    const newBlog = await Blog.findByIdAndUpdate(
      id,
      { title, author, url, likes },
      { new: true }
    );
    response.send(newBlog);
  } catch (exception) {
    next(exception);
  }

  // Blog.findByIdAndUpdate(id, { title, author, url, likes }, { new: true })
  //   .then((newBlog) => {
  //     response.send(newBlog);
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
});

blogRouter.get("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const blog = await Blog.findById(id);
    response.json(blog);
  } catch (exception) {
    next(exception);
  }

  // Blog.findById(id)
  //   .then((blogs) => {
  //     if (blogs) {
  //       response.json(blogs);
  //     } else {
  //       response.status(404).end();
  //     }
  //   })
  //   .catch((error) => next(error));
});

blogRouter.post("/", async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "Title and Url are required" });
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
  });

  try {
    const newBlog = await blog.save();
    response.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }

  // blog
  //   .save()
  //   .then((result) => {
  //     response.status(201).json(result);
  //   })
  //   .catch((error) => next(error));
});

module.exports = blogRouter;
