import { sidebarConfig } from './sidebarConfig';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Image from "../../images/logo.png"
import Premium from './DashBoardLatoutComp/UpdateToPremium';
import { useDispatch } from 'react-redux';
import { toggleMultiSelectMenu } from '../../features/appSlice';

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch()
  
  return (
    <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className='text-lg  w-60 h-full p-8 px-0.5 bg-gray-100 min-h-[100vh] sticky top-0'>
      <div className="items-center justify-center gap-2 flex mb-20"><img className='h-10' src={Image} alt="Logo" /><span className='font-bold'>Burberry</span> </div>
      <div className="text-gray-600 px-3 text-sm">MENU</div>
      {sidebarConfig.map((each, index) => {
        if (location.pathname.includes('dashboard')) {
          return <Link key={index} to={each.link}><div className={` my-1 mx-4 items-center ${each.type ? "flex" : 'hidden'}  p-2 rounded-sm  ${each.name === "Dashboard" ? 'bg-blue-600 text-white' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"} bg-opacity-25  transition-colors duration-300`}>
            <div className="px-2">{each.icon}</div>
            <div className="text-sm">{each.name}</div>
          </div></Link>
        }
        else if (!location.pathname.includes('sites/')) {
          return <Link key={index} to={each.link}><div className={` my-1 mx-4 items-center ${each.type ? "flex" : 'hidden'}  p-2 ${each.name === "Sites" ? 'bg-blue-600 text-white' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"}  bg-opacity-25 rounded-sm  text-gray-600  transition-colors duration-300`}>
            <div className="px-2">{each.icon}</div>
            <div className="text-sm">{each.name}</div>
          </div></Link>
        }
        return (
          <Link key={index} to={each.link}><div className={` my-1 mx-4 flex items-center p-2 rounded-sm  ${each.name === "Sites" ? 'bg-blue-600 text-white' : "bg-white hover:bg-blue-600 hover:bg-opacity-15 text-gray-600"}  bg-opacity-25 text-gray-600  transition-colors duration-300`}>
            <div className="px-2">{each.icon}</div>
            <div className="text-sm">{each.name}</div>
          </div></Link>
        )
      })}
      
    </div>
  )
}

