import React from 'react'
import { capitalise } from '../Components/helper'
import RenderHtml from '../Components/commonToAll/renderHtml'
import { getMetaData, getStaticPage } from '../serverCalls'



export async function generateMetadata({ params }) {

    const { staticPage } = await params
    const post = await getMetaData(staticPage)

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


export default async function Page({ params }) {
    const { staticPage } = await params;
    const data = await getStaticPage(staticPage)

    return (
        <div className='bg-gray-100 blog-content'>
            <h1 className=' text-center text-3xl sm:text-4xl lg:text-5xl p-4 font-semibold'>{capitalise(data.title)}</h1>
            {data.description && <RenderHtml html={data.description} />}
        </div>
    )
}