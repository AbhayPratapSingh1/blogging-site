import { getHomePagePosts } from "../page";
import Search from "./Components/serchClientSide";


export default async function getData(){
    const Blogs = await getHomePagePosts()
    return <Search Blogs={Blogs}/>
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
