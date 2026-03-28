import Link from "next/link"
import { FeaturedPostPostGrid } from "./FeaturedBlock/FeaturedBLockBlogs"

const FeaturedPost = ({ blogs }) => {
    return (
        <div className="my-5 md:my-10 mx-2 lg:mx-6 flex flex-col ">
            <h2 className="heading text-center text-3xl lg:text-4xl font-bold">Featured Post</h2>
            <FeaturedPostPostGrid blogs={blogs} />
            <div className="flex justify-end w-full p-10">
                <Link href={"/post"} >
                    <button className="text-md md:text-xl">  - All Blogs</button>
                </Link>
            </div>
        </div>
    )
}

export default FeaturedPost