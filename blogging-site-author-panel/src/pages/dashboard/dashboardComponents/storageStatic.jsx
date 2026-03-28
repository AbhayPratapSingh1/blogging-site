import StorageStatus from "./storageStatus"

import { RiPagesLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { LuTags } from "react-icons/lu";

const StorageStatic = ({site, blog, tag, category})=>{
    return(
        <div className="rounded-xl shadow-xl bg-white w-full p-4 py-2 m-2 mb-1 flex flex-col gap-2">
            <h2 className="text-gray-700 font-semibold text-lg">Storage Statistic</h2>
            <StorageStatus icon={<AiOutlineGlobal/>} color="red" total={5} present={site? site : 0} desciption={"Sites Storage"}/>
            <StorageStatus icon={<RiPagesLine/>} color="green" total={100} present={blog? blog : 0}  desciption={"Blogs Storage"}/>
            <StorageStatus icon={<MdOutlineCategory/>} color="blue" total={35} present={category? category : 0}  desciption={"Category Storage"}/>
            <StorageStatus icon={<LuTags/>} color="gray" total={35} present={tag? tag : 0}  desciption={"tags Storage"}/>
        </div>
    )
}

export default StorageStatic