import { FeaturedPostPostGrid } from "./FeaturedBlock/FeaturedBLockBlogs"

const FeaturedPost = ({ data }) => {
    return (
        <div className="my-5 md:my-10 mx-2 lg:mx-6">
            <h2 className="heading text-center text-3xl lg:text-4xl font-bold">Featured Post</h2>
            <FeaturedPostPostGrid data={data}/>
        </div>
    )
}

export default FeaturedPost