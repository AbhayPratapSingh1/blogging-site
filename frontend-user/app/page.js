"use server"

import CategoryPost from "./Components/mainComponents/categoryPost";
import CallToAction from "./Components/mainComponents/callToAction";
import FeaturedPost from "./Components/mainComponents/featuredPost";
import HeroCard from "./Components/mainComponents/heroCard";
import AuthorBlock from "./Components/mainComponents/authorBlock";



export async function getFeaturedArray() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`)
  if (!res.ok) {
    return []
  }
  return res.json()
}

export async function getSingleFeatured() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/single-fetaured`)
  if (!res.ok) {
    return {
      category: "some", slug: "pg-1", images: { url: "/images/hero1.avif", name: "Cup " }, title: "A cup of coffe to start off the dat",
      author: { name: "Rajesh Sharma", type: "Developer", url: "/images/download.jpeg", }, createdAt: new Date().getDate(), tags: " adsf, asdf,asdf"
    }
  }
  return res.json()
}

export async function getWriters() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-writers`)
  if (!res.ok) {
    return []
  }
  return res.json()
}

export async function getPostCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  if (!res.ok) {
    return []
  }
  return res.json()
}

export default async function Home() {
  const heroPost = await getSingleFeatured();
  const authors = await getWriters();

  const category = await getPostCategories();
  const featuredPosts = await getFeaturedArray();

  return (
    <>
      <HeroCard data={heroPost} />
      <CategoryPost categories={category} allPosts={featuredPosts} />
      <AuthorBlock authors={authors} />
      <FeaturedPost data={featuredPosts} />
      <CallToAction />

    </>
  )
}