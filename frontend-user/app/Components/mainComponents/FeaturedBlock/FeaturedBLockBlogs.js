import Image from "next/image"
import Link from "next/link";
import { capitalise, httpsToHttp } from "../../helper";
import { formatDate } from "../../helper";

export const FeaturedPostPostGrid = ({ data }) => {
    return (
        <div className="p-1 lg:p-2 md:grid lg:grid-cols-2 w-full overflow-hidden">
            {/* main feature card */}
            <MainHeroPost item={data[0]} />
            <div className="grid sm:grid-cols-2 justify-center w-full lg:h-[700px] gap-1" >
                {/* Troverse each side card one by one */}
                {data && data.length >= 4 && data.slice(1, 5).map((each, key) => {
                    return (
                        // calling the function to return the card 
                        <CardPost item={each} key={key} />
                    )
                })}
            </div>
        </div>
    )
}

export const MainHeroPost = ({ item }) => {
    return (
        <div className="lg:row-span-2 w-full lg:flex lg:flex-col grid items-center lg:h-[720px] p-0 lg:p-0" >
            {/* image of the post */}
            <div className="overflow-hidden my-2 lg:m-5 lg:hover:m-0 lg:hover:h-[540px]  hover:shadow-lg transition-all duration-300 rounded-xl lg:h-[500px]"><Image typeof={item.images.type} style={{ objectFit: "cover" }} className="min-h-full w-full aspect-square" height={200} width={700} src={httpsToHttp(item.images.url)} alt={item.images.name} /></div>
            {/* keyword of the post */}
            <div className="lg:px-16 px-2">
                <BlogsTags tagString={item.tags} />
                {/* title */}
                <Link href={`/post/${item.category}/${item.slug}`}><h3 className="inline dark:text-white text-xl sm:text-2xl font-semibold text-black bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 lg:hover:bg-[length:100%_14px] group-lg:hover:bg-[length:100%_10px] dark:from-purple-900 dark:to-purple-900">{capitalise(item.title)}</h3></Link>
                {/* author block */}
                <BlogsAuthor authorName={item?.author?.name} authorImgSrc={item?.author?.url} authorCreatedAt={item?.createdAt} />
            </div>
        </div>
    )
}

export const BlogsTags = ({ tagString }) => {
    return (
        <div className="flex gap-1 flex-wrap">
            {tagString && tagString.length > 0 && tagString.split(",").map((every, key) => {
                return <p key={key} className="text-[12px] lg:text-md text-blue-800"># {capitalise(every)}</p>
            })}
        </div>
    )
}

export const BlogsAuthor = ({ authorName, authorImgSrc, authorCreatedAt, }) => {
    console.log({ authorImgSrc });

    return (
        <div className="flex gap-4 text-[10px] md:text-sm text-gray-600 items-center">
            <div className="flex items-center">
                <div className="shrink-0 overflow-hidden mr-2 inline-block h-6 w-6 rounded-full bg-gray-300" ><Image style={{ objectFit: "cover" }} height={100} width={100} src={authorImgSrc} alt={authorName + " image"} /></div>
                <p>{authorName}</p>
            </div>
            <p className="">{formatDate(authorCreatedAt)}</p>
        </div>
    )
}

export const CardPost = ({ item }) => {
    return <div className="w-full  rounded-2xl overflow-hidden flex flex-col justify-between lg:h-[330px]" >
        <div className="overflow-hidden mx-1 my-5 lg:m-5 lg:hover:m-0 lg:hover:h-[540px]  hover:shadow-lg transition-all duration-300 rounded-xl lg:h-[280px]">
            {Object.entries(item.images)?.length > 0 && <Image style={{ objectFit: "cover" }} className="w-full aspect-square" height={70} width={400} src={httpsToHttp(item.images?.url)} alt={item.images?.name} />}</div>
        <div className=" px-5">
            {/* These are the features of the post */}
            <BlogsTags tagString={item.tags} />
            {/* title */}
            <Link href={`/post/${item.category}/${item.slug}`}><h3 className="inline dark:text-white text-lg font-semibold text-black bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 lg:hover:bg-[length:100%_14px] group-lg:hover:bg-[length:100%_10px] dark:from-purple-900 dark:to-purple-900">{capitalise(item.title)}</h3></Link>
            {/* author block */}
            <BlogsAuthor authorName={item?.author?.name} authorImgSrc={item?.author?.url} authorCreatedAt={item?.createdAt} />
        </div>
    </div>
}
