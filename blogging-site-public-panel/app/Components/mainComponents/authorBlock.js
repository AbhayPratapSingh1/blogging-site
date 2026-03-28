
import Link from "next/link"
import { formatDate } from "../helper";
import Image from "next/image";


const AuthorBlock = ({ authors }) => {

    return (
        <section className="px-4 md:px-28 my-20 ">
            <div className="flex justify-between items-baseline w-full">
                <h2 className="py-4 text-2xl md:text-4xl">Top Author</h2>
                <Link href={"/all-author-block"} >
                    <button className="text-md md:text-xl">All Author</button>
                </Link>
            </div>
            <hr />

            <div className="flex flex-wrap justify-evenly gap-2 my-5">
                {authors && (authors.slice(0, 3)).map((author, index) => {
                    return (
                        <Link key={index} href={`/all-author-block/${author._id}`} >
                            <div className="max-w-96 flex-grow shrink-0 bg-white p-2 md:p-5 m-2 md:my-8 md:hover:mb-12 md:hover:mt-4 transition-all duration-500 border rounded-xl flex justify-evenly items-center [box-shadow:15px_15px_15px_gray]">
                                <div className="shrink-0 overflow-hidden mr-2 inline-block h-28 w-28 rounded-full bg-gray-300" ><Image style={{ objectFit: "cover" }} height={100} width={100} src={author.profilePic?.url || "/"} alt={author.name} /></div>
                                <div className="flex flex-col">
                                    <div className="text-black font-bold text-lg">{author.name}</div>
                                    <div className="text-gray-400 font-extralight text-sm">{author.email}</div>
                                    <div className=" font-extraligt text-[11px] flex">Joined : {formatDate(author.createdAt)}</div>
                                    <div className=" font-extraligh text-[11px] flex">Last Post : {formatDate(author.updatedAt)}</div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section >
    )
}


export default AuthorBlock