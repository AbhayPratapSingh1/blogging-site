
export async function getBlogsByAuthor(id){
    console.log(id);
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/get-all-by-author/${id}`);
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-all-by-author/${id}`, {
        next: { tags: ['blogs'] },
        headers: {
            encodedes: process.env.NEXT_PUBLIC_SITE_NAME
        }
    })
    console.log(data);
    return data
}

export default async function Page({params}){
    console.log(params.authorId);
    const data = await getBlogsByAuthor(params.authorId)
    // console.log(data);
    return (
        <div className="">THis is the authors blogs</div>
    )
}
