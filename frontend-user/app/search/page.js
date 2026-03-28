import { getHomePagePosts } from "../page";
import { getBlogs } from "../serverCalls";
import Search from "./Components/serchClientSide";


export default async function getData() {
    const blogs = await getBlogs()
    console.log({ blogs });

    return <Search blogs={blogs} />
}



// import React from 'react'

// function Page() {
//   return (
//     <div>
//       searcg
//     </div>
//   )
// }

// export default Page
