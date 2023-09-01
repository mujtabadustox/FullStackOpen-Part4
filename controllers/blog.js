const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

blogRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Blog.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

blogRouter.put("/:id", (request, response, next) => {
  const id = request.params.id;
  const { title, author, url, likes } = request.body;

  Blog.findByIdAndUpdate(id, { title, author, url, likes }, { new: true })
    .then((newBlog) => {
      response.send(newBlog);
    })
    .catch((error) => {
      next(error);
    });
});

blogRouter.get("/:id", (request, response, next) => {
  const id = request.params.id;
  Blog.findById(id)
    .then((blogs) => {
      if (blogs) {
        response.json(blogs);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
