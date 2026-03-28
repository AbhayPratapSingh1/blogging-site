"use client"
import { useState } from "react"
import { capitalise, stringClip, tagsToText } from "../../Components/helper";
import Link from "next/link"


function highlight(term, value) {
    console.log("\n\n\n\n\n\n\n TERM ", term);

    const splitedText = term?.toLowerCase().split(value ? value.toLowerCase() : "  ");
    return (
        <div>
            {splitedText?.map((each, index) => {
                console.log(each, value);
                return (<span key={index}>{each}{(index === (splitedText.length - 1)) || <span className="text-red-500">{value.toUpperCase()}</span>}</span>)
            })}
        </div>


    )
}


function Search({ blogs }) {

    const [value, setValue] = useState("")
    let filteredBlogs = value && blogs && blogs.length > 0 && blogs.filter(blog => {

        const lowercaseTitle = blog.title?.toLowerCase()
        const lowercaseDescription = blog.description?.toLowerCase() || ""
        const searchedValue = value?.toLowerCase()
        console.log({ blog: blog.title });
        if (lowercaseTitle.includes(searchedValue)) {
            return true
        }
        if (lowercaseDescription.includes(searchedValue)) {
            return true
        }
        return false

    })

    return (
        <section className="my-20 min-h-[50vh]">
            <div className="flex justify-center items-center ">
                <div className="border bg-white flex  rounded-xl overflow-hidden">
                    <input className="px-4 py-2 rounded-xl" type="text" placeholder="Search Here" id="search" value={value} onChange={(e) => { setValue(e.target.value) }} />
                </div>
            </div>
            <div className="m-2 md:my-10 md:mx-20">
                <div className="text-sm my-2">{value ? (filteredBlogs && filteredBlogs.length > 0) ? <h1>Search results for query {value}</h1> : <h1>No Articles found for {value}</h1> : <h1>Write or Paste Text to search</h1>}</div>
                <div className="text-[12px] mb-2">{filteredBlogs.length} Results Found</div>
                {filteredBlogs && filteredBlogs.length > 0 && filteredBlogs.map((blog, index) => {
                    return (
                        <Link key={index} href={`/post/${blog.category}/${blog.slug}`} className="block border p-2">
                            <div className="text-md text-gray-800 ">{blog.title.toLowerCase().includes(value.toLowerCase()) ? highlight(stringClip(blog.title, 200), value) : stringClip(blog.title, 200)}</div>
                            <div className="text-gray-400 text-sm">{blog.description?.replace(/(<([^>]+)>)/g, "").toLowerCase().includes(value.toLowerCase()) ? highlight(stringClip(blog.description?.replace(/(<([^>]+)>)/g, ""), 200, value)) : stringClip(blog.description?.replace(/(<([^>]+)>)/g, ""), 200)}</div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
export default Search