"use client"
import { useState } from "react"
import { stringClip, tagsToText  } from "../../Components/helper";
import Link from "next/link"


function highlight(term, value) {
    const splitedText = term?.toLowerCase().split(value? value.toLowerCase : "  ");
    // const splitedText = []
    return (
        <div>
            {splitedText?.map((each, index) => {
                return (<>{each}{(index === (splitedText.length - 1)) || <span className="text-red-500">{value}</span>}</>)
            })}
        </div>

    )
}


function Search({Blogs}) {
    // console.log(Blogs[0]);
    const [value, setValue] = useState("")
    let filteredBlogs = value && Blogs && Blogs.length > 0 && Blogs.filter(one => {
        const lowercaseTitle = one.title?.toLowerCase()
        const lowercaseDescription = one.description?.toLowerCase()
        const searchedValue = value?.toLowerCase()
        if (lowercaseTitle.includes(searchedValue)) {
            return true
        }
        if (lowercaseDescription.includes(searchedValue)) {
            return true
        }
        return false
    })

    console.log("blocccc" , filteredBlogs[0]?.description);
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
                {filteredBlogs && filteredBlogs.length > 0 && filteredBlogs.map((each, key) => {
                    return ( 
                        <Link key={key} href={`/post/${each.category}/${each.slug}`} className="block border p-2">
                            <div className="text-md text-gray-800 ">{each.title.toLowerCase().includes(value.toLowerCase()) ? highlight(stringClip(each.title, 200), value) : stringClip(each.title, 200)}</div>
                            <div className=" text-gray-400 text-sm">{each.description?.replace(/(<([^>]+)>)/g, "").toLowerCase().includes(value.toLowerCase()) ? highlight(stringClip(each.description?.replace(/(<([^>]+)>)/g, ""), 200, value   )) : stringClip(each.description?.replace(/(<([^>]+)>)/g, ""), 200)}</div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
export default Search