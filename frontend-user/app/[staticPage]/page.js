import React from 'react'
import Image from 'next/image'
import { httpsToHttp, formatDate, capitalise } from '../Components/helper'
import Link from 'next/link'
import RenderHtml from '../Components/commonToAll/renderHtml'



export async function generateMetadata({ params }) {
    // Fetch blog post data
    const post = await fetchBlogPost(params.slug)

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt,
            images: [post.coverImage]
        }
    }
}

// export async function generateMetadata({ params }) {
//     const data = await getStaticPage(params.category)
//     return {
//         title: capitalise(data.metaTitle),
//         keywords: data.metaKeywords,
//         description: data.metaDescription,
//         alternates: {
//             canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${params.page}`,
//         },
//         openGraph: {
//             locale: "en_IN",
//             type: "website",
//             images: [`http://localhost:3000/api/og?title=${encodeURI(capitalise(data.page))}`, { size: { width: 512, height: 512 }, alt: `${data.slug}` }]
//         },
//     }
// }


export async function getStaticPage(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/static-page-by-slug/${slug}`, {
        next: { tags: ['header'] },
        headers: {
            encodedes: process.env.NEXT_PUBLIC_SITE_NAME
        }
    })
    return res.json()
}

export default async function Page({ params }) {
    const data = await getStaticPage(params.staticPage)
    return (
        <div className='bg-gray-100 blog-content'>
            <h1 className=' text-center text-3xl sm:text-4xl lg:text-5xl p-4 font-semibold'>{capitalise(data.page)}</h1>
            {data.description && <RenderHtml html={data.description} />}
        </div>
    )
}