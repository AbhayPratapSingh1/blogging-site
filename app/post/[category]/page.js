import React from 'react'
import Image from 'next/image'
import { httpsToHttp, formatDate, capitalise } from '../helper'
import Link from 'next/link'
import RenderHtml from '../Components/commonToAll/renderHtml'


export async function generateMetadata({ params }) {
    // remember that categorty of param is definded while creating the folder !
    if (StaticPages.includes(params.category.toLowerCase())) {
        return DataPageMetaTags(params)
    }
    else {
        return CategoryPageMetaTags(params)
    }
    
}
export async function DataPageMetaTags(params){
    const data = await getStaticPage(params.category)
    return {
        title: capitalise(data.metaTitle),
        keywords: data.metaKeywords,
        description: data.metaDescription,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${params.page}`,
        },
        openGraph: {
            locale: "en_IN",
            type: "website",
            images: [`http://localhost:3000/api/og?title=${encodeURI(capitalise(data.page))}`, { size: { width: 512, height: 512 }, alt: `${data.slug}` }]
        },
    }
}
export async function CategoryPageMetaTags(params){
    const post = await getAllPosts(params.category)
    return {
        title: capitalise(post[0]?.category),
        keywords: post.metaKeywords,
        description: post.metaDescription,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${params.category}`,
        },
        openGraph: {
            locale: "en_IN",
            type: "website",
            images: [`http://localhost:3000/api/og?title=${encodeURI(capitalise(post.title))}`, { size: { width: 512, height: 512 }, alt: `${post.title}` }]
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

    if (StaticPages.includes(params.category.toLowerCase())) {
        const data = await getStaticPage(params.category)
        return DataPage(data)
    }
    else {
        const data = await getAllPosts(params.category)
        // console.log(data);
        return CategoryPage(data)
    }
}

function DataPage(data) {
    return (
        <div className='bg-gray-100'>
            <h1 className=' text-center text-3xl sm:text-4xl lg:text-5xl p-4 font-semibold'>{capitalise(data.page)}</h1>
            {data.description && <RenderHtml html={data.description} />}
        </div>
    )
}

function CategoryPage(categoriesPost) {
    return (
        <div className=''>
            <h1 className='bg-gray-100 text-center text-3xl sm:text-4xl lg:text-5xl p-4 font-semibold'>{capitalise(categoriesPost[0]?.category)}</h1>
            {categoriesPost && showPost(categoriesPost)}
        </div>
    )
}

function showPost(data) {
    return (
        <div className='bg-gray-100 p-4 sm:px-8 lg:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-14'>
            {data.map((each, index) => {
                return (
                    <div key={index} className="p-2 pb-4 bg-white w-full  rounded-2xl overflow-hidden flex flex-col justify-between lg:h-[400px]">
                        <div className="overflow-hidden m-2 lg:hover:m-0 lg:hover:h-[516px] hover:shadow-lg transition-all duration-300 rounded-xl lg:h-[280px]"><Image style={{ objectFit: "cover" }} className="w-full aspect-square" height={70} width={400} src={httpsToHttp(each.images.url)} alt={capitalise(each.images.name)} /></div>
                        <div className=" px-5">
                            <div className="flex gap-5">
                                {each.tags && each.tags.length > 0 && each.tags.split(",").map((every, key) => {
                                    return <p key={key} className="text-[12px] text-blue-800"># {capitalise(every)}</p>
                                })}
                            </div>
                            <Link href={`./${each.category}/${each.slug}`}>
                                <h3 className="inline dark:text-white text-lg font-semibold text-black bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 lg:hover:bg-[length:100%_14px] group-lg:hover:bg-[length:100%_10px] dark:from-purple-900 dark:to-purple-900">{capitalise(each.title)}</h3>
                                <div className="flex gap-5 text-[12px] text-gray-600">
                                    <div className="flex items-center">
                                        <div className="mr-2 inline-block h-6 w-6 rounded-full bg-black overflow-hidden" ><Image typeof={each.author.type} style={{ objectFit: "cover" }} height={80} width={80} src={httpsToHttp(each.author.url)} alt={each.images.name} /></div>
                                        <p>{capitalise(each.author.name)}</p>
                                    </div>
                                    <p className="">{formatDate(each.createdAt)}</p>
                                </div>
                            </Link>
                        </div>
                    </div >
                )
            })}
        </div>
    )
}