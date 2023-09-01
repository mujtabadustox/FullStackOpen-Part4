const dummy = (blogs) => {
  // ...
  return 1;
};

const total_likes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  if (blogs.length === 1) {
    return blogs[0].likes;
  } else {
    const t_likes = blogs.reduce((sum, blog) => {
      return sum + blog.likes;
    }, 0);

    return t_likes;
  }
};

const fav_blog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((e) => e.likes));
  const favBlog = blogs.find((blog) => blog.likes === maxLikes);
  return favBlog;
};

module.exports = {
  dummy,
  total_likes,
  fav_blog,
};
