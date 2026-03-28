export const APIS = {
  LOGO: "/logo",

  META_DATA: "/meta-data",
  META_DATA_BY_CATEGORY: "/meta-data",

  NAVIGATIONS: "/get-navigation",
  SOCIAL_MEDIA: "/get-social-media",
  BLOGS: "/blogs",

  HERO_POST: "/single-fetaured",
  AUTHORS: "/all-writers",
  CATEGORIES: "/categories",
  AUTHOR_BLOGS: "/get-blogs-by-author-id",
  STATIC_PAGES: "/static-page",
  BLOGS_BY_CATEGORY: "/blogs-by-category",
}

const handleRequest = async (path) => {
  try {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`)
  } catch (e) {
    console.log(e);
    return { ok: false }
  }
}


export const getMetaData = async (name) => {
  const res = await handleRequest(`${APIS.META_DATA}/${name}`)
  if (!res.ok) {
    return { metaDescription: "something", metaKeywords: "keywords", title: "some title" }
  }
  return res.json()
}

export const homeMetaText = async () => {
  return await getMetaData("home")
}

export const getLogo = async () => {
  const res = await handleRequest(APIS.LOGO)
  if (!res.ok) {
    return { url: "/logo.png" }
  }
  return res.json()
}


export const getNav = async () => {
  const res = await handleRequest(APIS.NAVIGATIONS)
  if (!res.ok) {
    return []
  }
  return await res.json()

}


export const getSocialMedia = async () => {
  const res = await handleRequest(APIS.SOCIAL_MEDIA);
  if (!res.ok) {
    return []
  }
  const data = await res.json();
  return data
}






export const getBlogs = async () => {
  const res = await handleRequest(APIS.BLOGS);
  if (!res.ok) {
    return []
  }
  return res.json()
}


export const getHeroPost = async () => {
  const res = await handleRequest(APIS.HERO_POST)
  if (!res.ok) {
    return {
      category: "some", slug: "pg-1", images: { url: "/images/hero1.avif", name: "Cup " }, title: "A cup of coffe to start off the dat",
      author: { name: "Rajesh Sharma", type: "Developer", url: "/images/download.jpeg", }, createdAt: new Date().getDate(), tags: " adsf, asdf,asdf"
    }
  }
  return res.json()
}

export const getAllAuthors = async () => {
  const res = await handleRequest(APIS.AUTHORS)
  if (!res.ok) {
    return []
  }
  return res.json()
}

export const getAllCategories = async () => {
  const res = await handleRequest(APIS.CATEGORIES)

  if (!res.ok) {
    return []
  }
  return await res.json()
}


export const getBlogsByAuthorId = async (id) => {
  const res = await handleRequest(`${APIS.AUTHOR_BLOGS}/${id}`)
  if (!res.ok) {
    return []
  }
  return res.json()
}


export const getStaticPage = async (slug) => {
  const res = await handleRequest(`${APIS.STATIC_PAGES}/${slug}`)
  if (!res.ok) {
    return {}
  }
  return res.json()

}

export const getBlogsByCategory = async (category) => {
  const res = await handleRequest(`${APIS.BLOGS_BY_CATEGORY}/${category}`)
  if (!res.ok) {
    return []
  }
  return res.json()
}

export const getMetaDataByCategory = async (category) => {
  const res = await handleRequest(`${APIS.META_DATA_BY_CATEGORY}/${category}`)
  if (!res.ok) {
    return []
  }
  return res.json()

}