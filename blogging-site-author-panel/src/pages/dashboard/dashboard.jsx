import { getAllBlogsRequest } from "../../features/blogSlice";
import { getAllCategoryRequest } from "../../features/categorySlice";
import { getAllSitesRequest } from "../../features/siteSlice";
import { getAllTagsRequest } from "../../features/tagsSlice";
import DataDetail from "./dashboardComponents/dataDetails";
import RecentBlog from "./dashboardComponents/recentBlogs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StorageStatic from "./dashboardComponents/storageStatic";
import Friends from "./dashboardComponents/friends";
import { getAllAuthorRequest } from "../../features/authorSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const blog = useSelector((state) => state.blogs.allBlogs);
    const categories = useSelector((state) => state.category.allCategories);
    const tags = useSelector((state) => state.tags.allTags);
    const authors = useSelector((state) => state.author.allAuthors);

    const sites = useSelector((state) => state.sites.allSites);
    useEffect(() => {
        console.log("Chilederen is loding hence request is send");
        dispatch(getAllSitesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (sites && sites.length > 0) {
            dispatch(getAllAuthorRequest(sites[0]?._id));
            dispatch(getAllBlogsRequest(sites[0]?._id));
            dispatch(getAllTagsRequest(sites[0]?._id));
            dispatch(getAllCategoryRequest(sites[0]?._id));
        }
    }, [sites]);

    return (
        <div className=" h-full bg-gray-100 px-5 py-8">
            <DataDetail
                sites={sites?.length}
                blog={blog?.length}
                tags={tags?.length}
                category={categories?.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 my-2 gap-5">
                <div className="">
                    <StorageStatic
                        site={sites?.length}
                        blog={blog?.length}
                        category={categories?.length}
                        tag={tags?.length}
                    />
                    <Friends authors={authors} />
                </div>
                <RecentBlog siteId={sites[0]?._id} blogs={blog} />
            </div>
        </div>
    );
};
export default Dashboard;
