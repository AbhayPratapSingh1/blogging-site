"use server"

import CategoryPost from "./Components/mainComponents/categoryPost";
import CallToAction from "./Components/mainComponents/callToAction";
import FeaturedPost from "./Components/mainComponents/featuredPost";
import HeroCard from "./Components/mainComponents/heroCard";
import AuthorBlock from "./Components/mainComponents/authorBlock";
import { getAllAuthors, getAllCategories, getBlogs, getHeroPost } from "./serverCalls";




export default async function Home() {
  const heroPost = await getHeroPost();
  const authors = await getAllAuthors();
  const category = await getAllCategories();
  const blogs = await getBlogs();

  return (
    <>
      <HeroCard data={heroPost} />
      <CategoryPost categories={category} blogs={blogs} />
      <AuthorBlock authors={authors} />
      <FeaturedPost blogs={blogs} />
      <CallToAction />
    </>
  )
}