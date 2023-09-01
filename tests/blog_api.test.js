const mongoose = require("mongoose");
mongoose.set("bufferTimeoutMS", 50000);
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "React Patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },

  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Consider…",
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all notes are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("the blog exists", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);

  expect(titles).toContain("React Patterns");
});

afterAll(async () => {
  await mongoose.connection.close();
});
