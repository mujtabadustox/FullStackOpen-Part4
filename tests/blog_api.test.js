const mongoose = require("mongoose");
mongoose.set("bufferTimeoutMS", 15000000);
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("_id is defined", async () => {
  const blogs = await helper.blogsInDb();

  blogs.map((b) => expect(b._id).toBeDefined());
});

test("likes defaut 0", async () => {
  const newBlog = {
    title: "Testing can be Fun sometimes",
    author: "Zoroark",
    url: "www.mujtabazoroark.net",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();
  const blogAtEnd = blogs[blogs.length - 1];
  expect(blogAtEnd.likes).toBe(0);
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView._id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(JSON.stringify(resultBlog.body)).toEqual(JSON.stringify(blogToView));
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Testing is !Fun",
    author: "Muji-Buji",
    url: "www.muj.net",
    likes: 11,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).toContain("Testing is !Fun");
});

test("blog without a title or a url is not added", async () => {
  const newBlog = {
    title: "Man!!",
    author: "YASS GIRL!",
    likes: 6,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all notes are returned", async () => {
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("the blog exists", async () => {
  const blogsAtEnd = await helper.blogsInDb();

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).toContain("React Patterns");
});

afterAll(async () => {
  await mongoose.connection.close();
});
