import React from 'react'
import { capitalise, formatDate, httpsToHttp, paragraphLength } from '../../../Components/helper'
import RenderHtml from '../../../Components/commonToAll/renderHtml'
import Image from "next/image"
import { getAllPosts } from '../page'
import { PostBlogs } from '@/app/Components/mainComponents/CategoryPost/categoriesBlock'
import { getBlogs } from '@/app/serverCalls'

async function getSinglePost(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-by-slug/${slug}`)
    return res.json()
}


export async function generateMetadata({ params }) {
    const { slug, category } = await params
    const post = await getSinglePost(slug)
    console.log({ post });

    return {
        title: capitalise(post.metadata.title),
        keywords: post.metadata.keywords,
        description: post.metadata.description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_CLIENT_URL}/${category}/${slug}`,
        },
        openGraph: {
            locale: "en_IN",
            type: "website",
        },
    }
}


const AuthorBlock = ({ post }) => {
    return <div className='order-1 max-w-xl m-auto flex items-center py-2'>
        <div className="shrink-0 overflow-hidden mr-2 inline-block h-16 w-16 rounded-full bg-gray-300"><Image typeof={post?.images?.type} style={{ objectFit: "cover" }} height={100} width={100} src={post?.author?.url} alt={post?.author?.name} /></div>
        <div className='flex flex-col justify-start'>
            <p className='text-sm sm:text-lg'>{capitalise(post?.author?.name)}</p>
            <div className='flex gap-5 justify-center text-[10px] sm:text-[12px]'>
                <p className='text-center '>{formatDate(post.createdAt)}</p>
                <p className='text-center '>{Math.floor(paragraphLength(post.description) / 130)} min</p>
            </div>
        </div>
    </div>
}

const Details = ({ post }) => {
    return (
        <div className='flex flex-col p-2'>
            {/* tags ,  heading and description block */}
            <h1 className='max-w-3xl m-auto sm:py-2 order-1 text-2xl sm:text-3xl lg:text-5xl text-center text-black font-bold'>{capitalise(post?.title)}</h1>
            <div className='order-0 flex justify-center gap-2 flex-wrap'>
                {post?.tags?.split(",").map((each, index) => {
                    return (
                        <button key={index} className='text-blue-500 font-semithin text-[10px] lg:text-sm bg-blue-50 rounded-full px-2 py-0.5'>{capitalise(each)}</button>
                    )
                })}
            </div>

            <AuthorBlock post={post} />
            {/* image block */}
            <div className="order-2 h-full w-full overflow-hidden bg-gray-300" >
                <Image className='h-full w-full' typeof={post?.images?.type} style={{ objectFit: "contain" }} height={800} width={800} src={httpsToHttp(post?.images?.url)} alt={capitalise(post?.author?.name)} />
            </div>
        </div>

    )
}

//   main function
export default async function SlugPages({ params }) {

    const { slug } = await params
    const post = await getSinglePost(slug)
    const otherPost = await getBlogs()
    return (
        <div className='max-w-5xl m-auto py-10'>

            <Details post={post} />
            <RenderHtml html={post.description} />
            <PostBlogs blogs={otherPost} />
        </div>
    )
}