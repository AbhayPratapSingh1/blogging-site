import Image from "next/image"
import { httpsToHttp } from "../../helper"
import Link from "next/link"
import { BlogsAuthor, BlogsTags } from "../FeaturedBlock/FeaturedBLockBlogs"

export const PostBlogs = ({blogs})=>{
    return (
        <div className="grid lg:grid-cols-3 gap-5 my-5">
            {blogs && blogs.length > 0 && blogs.map((each, key) => {
                return <div key={key} className="p-2 pb-4 bg-white w-full  rounded-2xl overflow-hidden flex flex-col justify-between lg:h-[400px]">
                    <div className="overflow-hidden m-2 lg:hover:m-0 lg:hover:h-[516px] hover:shadow-lg transition-all duration-300 rounded-xl lg:h-[280px]"><Image style={{ objectFit: "cover" }} className="w-full aspect-square" height={70} width={400} src={httpsToHttp(each.images.url)} alt={each.images.name} /></div>
                    <div className=" px-5">
                        <BlogsTags tagString={each.tags}/>
                        <Link href={`/post/${each.category}/${each.slug}`}>
                            <h3 className="inline dark:text-white text-lg font-semibold text-black bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 lg:hover:bg-[length:100%_14px] group-lg:hover:bg-[length:100%_10px] dark:from-purple-900 dark:to-purple-900">{each.title}</h3>
                            <BlogsAuthor authorName={each?.author?.name} authorImgSrc={each?.author?.url} authorCreatedAt={each?.createdAt}/>
                        </Link>
                    </div>
                </div >
            })}
        </div>
    )
}

export const CategorySelection = ({categories , tab , allPosts, settab })=>{
    return (
        <div className="max-w-3xl m-auto relative rounded-full flex flex-wrap font-light text-sm justify-center p-1 gap-2 ">
            <button onClick={() => { settab("") }} className={`border border-black rounded-full z-10 px-5 py-1 text-lg transition-all duration-500 hover:bg-black hover:text-white ${tab === "" ? "bg-black text-white" : "bg-white text-black"}`}>All ({allPosts?.length})</button>
            {categories && categories.length > 0 && categories.map((each, index) => {
                const count = allPosts && allPosts.length > 0 && allPosts.filter(one => one.category.toLowerCase() === each.categoryName?.toLowerCase()).length
                return count > 0 && <button onClick={() => { settab(each.categoryName) }} key={index} className={`border border-black text-lg rounded-full z-10 px-5 py-3 transition-all duration-500 hover:bg-black hover:text-white ${tab === each.categoryName ? "bg-black text-white" : "bg-white text-black"}`} >{each.categoryName}({count})</button>
            })}
        </div>
    )
}