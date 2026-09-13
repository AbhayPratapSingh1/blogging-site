import Table from "../table/Table";
import { cardsConfig } from "./mainConfig"
import { headerBlogs } from "../table/tabledata"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllBlogsRequest } from "../../features/blogSlice";


export default function () {
    const dispatch = useDispatch()
    const actionDiv = {name:"view", action:"pass"}
    const blogsArray = useSelector(state=>state.blogs.allBlogs)

useEffect(()=>{dispatch(getAllBlogsRequest())}, [dispatch])

    return (
        <main className="">
            <section className="flex bg-slate-300 gap-2 justify-around p-6 flex-wrap">
                {cardsConfig.map((each, index) => {
                    return (
                        <div key={index} className="rounded-md flex flex-col bg-white w-56 h-40 p-5 px-7 justify-around">
                            <div className="flex my-2 justify-center items-center w-8 h-8 rounded-full p-2  bg-blue-900 bg-opacity-10 text-blue-900 text-4xl">{each.icon}</div>
                            <div className="text-3xl  font-bold text-gray-800">{each.no}</div>
                            <div className="text-sm text-gray-500">{each.description}</div>
                        </div>
                    )
                })}
            </section>
            <section className="m-5">
                <Table header={headerBlogs} streamData={blogsArray} ActionDiv={actionDiv} />
            </section>

        </main>
    )
}