const HorizontalBlogCard = ({ blog }) => {
    return (
        <div className="w-full h-20 flex">
            <div className="w-20 h-auto">
                <img className="w-20 h-auto" src={blog?.images?.url} alt="blog" />
            </div>
            <div className="px-2">
                <p className="text-gray-700 text-sm ">{blog?.title}</p>
                <p className="text-gray-500 text-[11px]">Author : {blog?.author?.name}</p>
            </div>
        </div>
    )
}
export default HorizontalBlogCard