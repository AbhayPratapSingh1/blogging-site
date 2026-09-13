import { capitalise, formatDate } from '@/app/Components/helper'
import { PostBlogs } from '@/app/Components/mainComponents/CategoryPost/categoriesBlock'
import { getBlogsByCategory } from '@/app/serverCalls'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


export async function generateMetadata({ params }) {
    const { category } = await params
    const posts = await getBlogsByCategory(category)
    const firstPost = posts?.[0]

    return {
        title: `${capitalise(category)} Posts`,
        description: firstPost?.metaDescription || firstPost?.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `Browse all articles in ${category}`,
        keywords: firstPost?.metaKeywords || category,
        openGraph: {
            locale: "en_IN",
            type: "website",
        },
    }
}
export async function DataPageMetaTags({ category }) {
    const data = await getStaticPage(category)
    return {
        title: capitalise(data.title || data.metaTitle),
        keywords: data.metaKeywords || "",
        description: data.metaDescription || "",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${category}`,
        },
        openGraph: {
            locale: "en_IN",
            type: "website",
        },
    }
}






export async function getAllPosts(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages-by-category/${slug}`, {
        next: { tags: ['posts'] },
        headers: {
            encodedes: process.env.NEXT_PUBLIC_SITE_NAME
        }
    })
    return res.json()
}

export async function getStaticPage(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/static-page-by-slug/${slug}`, {
        next: { tags: ['nav'] },
        headers: {
            encodedes: process.env.NEXT_PUBLIC_SITE_NAME
        }
    })
    return res.json()
}

export const StaticPages = ["contact", "about", "terms-and-conditions", "disclaimer", "privacy-policy"]


export default async function Page({ params }) {
    const { category } = await params;
    const data = await getBlogsByCategory(category)

    return CategoryPage(data)

}

const CategoryPage = (blogs) => {
    return (
        <div className=''>
            <h1 className=' text-center text-3xl sm:text-4xl lg:text-5xl p-4 font-semibold'>{capitalise(blogs[0]?.category)}</h1>
            <div className="px-2 md:px-12 my-10 md:my-20">
                {blogs && <PostBlogs blogs={blogs} />}
            </div>
        </div>
    )
}