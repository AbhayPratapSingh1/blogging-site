import DataCard from "./dataCard"

import { RiPagesLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { LuTags } from "react-icons/lu";


const DataDetail = ({sites, blog, category, tags})=>{
    
    console.log("stese : ",sites,sites?.length);
    return (
        <div className="flex justify-left gap-20 flex-wrap ml-2 mr-20">
            <DataCard name={"Site"} value={sites?sites:"fetching..."}  icon={<AiOutlineGlobal />}/>
            <DataCard name={"Blogs"} value={blog?blog:"fetching..."}  icon={<RiPagesLine />}/>
            <DataCard name={"Categories"} value={category?category:"fetching..."}  icon={<MdOutlineCategory />}/>
            <DataCard name={"Tags"} value={tags?tags:"fetching..."}  icon={<LuTags />}/>
        </div>
    )
}
export default DataDetail