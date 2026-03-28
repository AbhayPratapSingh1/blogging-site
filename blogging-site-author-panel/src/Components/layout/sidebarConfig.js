
import { RxDashboard } from "react-icons/rx";
import { TbLogs } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { IoPricetagSharp, IoPerson } from "react-icons/io5";
import {FcDataConfiguration} from "react-icons/fc"

export const sidebarConfig = [
    {
        icon:<RxDashboard />,
        name:"Dashboard",
        link:"/dashboard/",
        type:true
    },{

        icon:<TbLogs/>,
        name:"Sites",
        link:"/sites",
        type:true

    },{
        icon:<FcDataConfiguration/>,
        name:"Configuration",
        link:"/configuration",
        type:true

    }
]

// dashboard , blogs , category , tags , authors , configuration