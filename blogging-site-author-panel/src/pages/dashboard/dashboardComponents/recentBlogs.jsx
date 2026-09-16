import { MdOutlineAddBox } from "react-icons/md";
import HorizontalBlogCard from "../../../Components/common/horizontalBlog";
import { Link } from "react-router-dom";

const RecentBlog = ({ blogs, siteId }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-800 font-semibold text-lg">Recent Blogs</h2>
                <Link to={`/sites/${siteId}/blogs`}>
                    <span className="text-blue-600 text-sm hover:underline">View All</span>
                </Link>
            </div>
            <div className="space-y-3">
                {blogs?.length > 0 && blogs.slice(0, 5).map((each, index) => {
                    return (
                        <div key={index} className="h-14">
                            <HorizontalBlogCard blog={each} />
                        </div>
                    )
                })}
                {(!blogs || blogs.length === 0) && (
                    <p className="text-gray-400 text-sm text-center py-4">No blogs yet</p>
                )}
            </div>
        </div>
    )
}

export default RecentBlog
