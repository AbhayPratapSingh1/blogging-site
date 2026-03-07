import Image from "next/image"
import Link from "next/link"
import { capitalise, formatDate , httpsToHttp } from "../../helper";

export const HeroPostImage = ({data})=>{
    return (
      <Link href={`/post/${data.category}/${data?.slug}`}><div  className="max-h-96"><Image  priority style={{objectFit: "cover"}} className="h-62 sm:h-96" height={500} width={800} src={httpsToHttp(data?.images?.url)}   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={data?.images?.name} /></div></Link>
    )
  }
  export const HeroPostDetail = ({data})=>{
    return (
      <div className=" h-full max-h-62 sm:max-h-96 w-full py-2 md:py-0 px-2 lg:px-10 bg-gray-400  flex flex-col justify-center align-center text-white md:gap-10 [background-color:rgb(172,144,109)]" >
        <Link href={`/post/${data.category}/${data?.slug}`}><h2 className=" text-3xl md:text-4xl">{capitalise(data?.title)}</h2></Link>
        <Link href={`/post/${data.category}/${data?.slug}`}>
          <HeroBlogAuthor data={data} />
        </Link>
      </div>
    )
  }
  export const HeroBlogAuthor = ({data})=>{
    return (
      <div className="my-5 gap-0 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 inline-block h-6 w-6 rounded-full bg-gray-500 overflow-hidden"><Image typeof={data?.author?.type} style={{ objectFit: "cover" }} height={80} width={80} src={httpsToHttp(data?.author?.url)} alt={data?.images?.name} /></div>
          <p>{capitalise(data?.author?.name)}</p>
        </div>
        <p className="text-[12px] md:text-[15px]">{formatDate(data.createdAt)}</p>
        {/* <BlogsAuthor/> */}
        <div className="text-[12px] gap-0.5 flex flex-wrap justify-start md:gap-2 md:text-[15px]">
          {data?.tags?.split(",").map((each,key)=>{
            return <p className="" key={key}># {capitalise(each)}</p>
          })}
        </div>
      </div>
    )
  }
  