"use client"
import { useState } from "react"
import { CategorySelection, PostBlogs } from "./CategoryPost/categoriesBlock"

export async function getCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        next: { tags: ['posts'] },
        headers: {
            encodedes: process.env.NEXT_PUBLIC_SITE_NAME
        }
    })
    return res.json()
}

const CategoryPost = ({ categories, allPosts }) => {
    const [tab, settab] = useState("")
    let filteredBlogs = []
    if (tab === "") {
        filteredBlogs = allPosts
    }
    else {
        filteredBlogs = allPosts.filter(function (eachPost) {
            if (tab === eachPost.category) {
                return true
            }
        })
    }
    return (
        <div className="px-2 md:px-12 my-10 md:my-20">
            <h2 className="font-bold text-center text-3xl md:text-4xl my-2">Browser by Category</h2>
            <p className="text-center text-sm md:texti-lg text-gray-400 mb-4">Select a category to see more related content</p>
            <CategorySelection categories={categories} tab={tab} allPosts={allPosts} settab={settab}/>
            <PostBlogs blogs={filteredBlogs}/>
        </div>
    )
}


export default CategoryPost