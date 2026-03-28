import CategoryPost from "@/app/Components/mainComponents/categoryPost";
import { getAllCategories, getBlogsByAuthorId } from "@/app/serverCalls"

export default async function Page({ params }) {

    const { authorId } = await params
    const blogs = await getBlogsByAuthorId(authorId)
    const categories = await getAllCategories();

    return (
        <div className="">
            <div> POSTS BY AUTHOR : "" || UPDATE THIS IN THE FUTURE</div>
            <CategoryPost blogs={blogs} categories={categories} />
        </div>
    )
}

