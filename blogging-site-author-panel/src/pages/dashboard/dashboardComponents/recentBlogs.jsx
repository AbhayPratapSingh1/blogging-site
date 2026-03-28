import { MdOutlineAddBox } from "react-icons/md";
import HorizontalBlogCard from "../../../Components/common/horizontalBlog";
import { Link } from "react-router-dom";
const RecentBlog = ({ blogs, siteId }) => {
    return (
        <div className="rounded-xl shadow-xl bg-white w-full p-4 py-2 m-2" >
            <div className="flex mb-4 ">
                <h2 className="text-gray-700 font-semibold text-lg ">Recent Blog Update</h2>
                <div className="flex-grow" />
                <Link to={`/sites/${siteId}/blogs/add-new`} >
                    <div className="text-gray-500 text-3xl"><MdOutlineAddBox /></div>
                </Link>
            </div>
            {blogs?.length > 0 && blogs.slice(0, 6).map((each, index) => {
                return (
                    <div key={index} className="h-14">< HorizontalBlogCard blog={each} /></div>
                )
            })}
        </div>
    )
}

export default RecentBlog