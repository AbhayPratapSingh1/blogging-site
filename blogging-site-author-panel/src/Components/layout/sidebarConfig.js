
import { RxDashboard } from "react-icons/rx";
import { TbLogs } from "react-icons/tb";

export const sidebarConfig = [
    {
        icon:<RxDashboard />,
        name:"Dashboard",
        link:"/dashboard",
        type:true
    },{
        icon:<TbLogs/>,
        name:"Sites",
        link:"/sites",
        type:true
    }
]

// dashboard , blogs , category , tags , authors , configuration