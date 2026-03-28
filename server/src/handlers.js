import { staticPages, pageMetaData, blogsDetails, blogs } from "./static.js";

export const SOCIAL_MEDIA = [
  { name: "facebook", link: "/" },
  { name: "whatsapp", link: "/ws" },
  { name: "linkedin", link: "/in" },
  { name: "twitter", link: "/tw" },
  { name: "instagram", link: "/ig" },
];

export const handleStaticPageBySlug = (c) => {
  const { slug } = c.req.param();

  if (slug in staticPages) {
    return c.json(staticPages[slug]);
  }

  return c.body("Not Found", 404);
};

export const handleLogo = (c) => c.json({ url: "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" });

export const handlePageMetaData = (c) => {
  const { page } = c.req.param();
  if (page in pageMetaData) {
    return c.json(pageMetaData[page]);
  }
  return c.body("Not Fount", 404);
};

export const handleCategories = (c) => {
  const categories = [];
  for (const blog of blogsDetails) {
    if (!(categories.includes(blog.category))) {
      categories.push({ categoryName: blog.category });
    }
  }
  return c.json(categories);
};

export const handleBlogByAuthorId = (c) => {
  const { id } = c.req.param();
  const posts = blogsDetails.filter(({ author }) => author.authorId === id);
  return c.json(posts);
};

export const handleBlogByCategory = (c) => {
  const { category } = c.req.param();
  const selectedBlogs = blogsDetails.filter(({ category: cat }) => cat.toLowerCase() === category.toLowerCase());
  return c.json(selectedBlogs);
};

export const handlePageBySlug = (c) => {
  const { slug } = c.req.param();

  if (slug in blogs) {
    return c.json(blogs[slug]);
  }
  return c.body("Not Found", 403);
};

export const handleAllBlogs = (c) => c.json(blogsDetails);

