import DataCard from "./dataCard"
import { RiPagesLine } from "react-icons/ri";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { LuTags } from "react-icons/lu";

const DataDetail = ({sites, blog, category, tags})=>{
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DataCard name="Sites" value={sites} icon={<AiOutlineGlobal />}/>
            <DataCard name="Blogs" value={blog} icon={<RiPagesLine />}/>
            <DataCard name="Categories" value={category} icon={<MdOutlineCategory />}/>
            <DataCard name="Tags" value={tags} icon={<LuTags />}/>
        </div>
    )
}
export default DataDetail
