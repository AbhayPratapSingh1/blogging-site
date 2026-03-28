import { capitalise } from "../Components/helper";
import { PostBlogs } from "../Components/mainComponents/CategoryPost/categoriesBlock";
import { getBlogs } from "../serverCalls";

export default async function Page() {
  const blogs = await getBlogs()
  
  return (
    < div className='' >
      <h1 className=' text-center text-3xl sm:text-4xl lg:text-5xl p-4 font-semibold'>{capitalise(blogs[0]?.category)}</h1>
      <div className="px-2 md:px-12 my-10 md:my-20">
        {blogs && <PostBlogs blogs={blogs} count={blogs?.length} />}
      </div>

    </div >

  )
}
