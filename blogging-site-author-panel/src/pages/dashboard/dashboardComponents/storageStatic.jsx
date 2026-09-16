import StorageStatus from "./storageStatus"
import { RiPagesLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { LuTags } from "react-icons/lu";

const StorageStatic = ({site, blog, tag, category})=>{
    return(
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-gray-800 font-semibold text-lg mb-4">Storage Statistics</h2>
            <div className="space-y-4">
                <StorageStatus icon={<AiOutlineGlobal/>} color="blue" total={10} present={site || 0} description="Sites"/>
                <StorageStatus icon={<RiPagesLine/>} color="green" total={200} present={blog || 0} description="Blogs"/>
                <StorageStatus icon={<MdOutlineCategory/>} color="purple" total={50} present={category || 0} description="Categories"/>
                <StorageStatus icon={<LuTags/>} color="orange" total={50} present={tag || 0} description="Tags"/>
            </div>
        </div>
    )
}

export default StorageStatic
