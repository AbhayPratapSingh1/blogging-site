import CategoryPost from "./Components/mainComponents/categoryPost";
import CallToAction from "./Components/mainComponents/callToAction";
import FeaturedPost from "./Components/mainComponents/featuredPost";
import HeroCard from "./Components/mainComponents/heroCard";
import AuthorBlock from "./Components/mainComponents/authorBlock";

export async function getHomePagePosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages-all`, {
    next: { tags: ["posts"] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME,
    },
  });
  return res.json();
}

export async function getFeaturedArray() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/top-10-fetaured-posts`,
    {
      next: { tags: ["posts"] },
      headers: {
        encodedes: process.env.NEXT_PUBLIC_SITE_NAME,
      },
    }
  );
  return res.json();
}

export async function getSingleFeatured() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/single-fetaured`,
    {
      next: { tags: ["posts"] },
      headers: {
        encodedes: process.env.NEXT_PUBLIC_SITE_NAME,
      },
    }
  );
  return res.json();
}

export async function getWriters() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-writers`, {
    next: { tags: ["posts"] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME,
    },
  });
  return res.json();
}

export async function getPostCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    next: { tags: ["posts"] },
    headers: {
      encodedes: process.env.NEXT_PUBLIC_SITE_NAME,
    },
  });
  return res.json();
}

export async function getData() {
  const res = await fetch("https://abhaypratapsingh.pythonanywhere.com/");
  return res.json();
}

export default async function Home() {
  const featuredPosts = await getFeaturedArray();
  const heroPosts = await getSingleFeatured();
  const authors = await getWriters();
  let category = await getPostCategories();
  const homePagePosts = await getHomePagePosts();

  const data = await getData();
  console.log("data : ", data);
  return (
    <CallToAction/>
  )
}

const BooksCard = ({data}) => {
  return (
    <div>
      {data.map((each, index) => {
        return (
          <div key={index}>
            {index}. {each.name} : {each.type}{" "}
          </div>
        );
      })}
    </div>
  );
};
