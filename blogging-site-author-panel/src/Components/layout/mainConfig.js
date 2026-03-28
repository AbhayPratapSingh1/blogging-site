import { RxDashboard } from "react-icons/rx";
import { TbLogs } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { IoPricetagSharp, IoPerson } from "react-icons/io5";
import {FcDataConfiguration} from "react-icons/fc"

export const cardsConfig = [
    {
        icon:<RxDashboard />,
        no : 100,
        description: "Total Views",
        name:"Dashboard",
        link:"/dashboard"
    },{

        icon:<TbLogs/>,
        no : 200,
        description: "Total Blogs",
        name:"Blogs",
        link:"/blogs"
    },{
        icon:<MdCategory/>,
        no : 300,
        description: "No of Categories",
        name:"Category",
        link:"/category"
    },{
        icon:<IoPerson/>,
        no : 500,
        description: "Total Authors",
        name:"Author",
        link:"/author"
    }
]
