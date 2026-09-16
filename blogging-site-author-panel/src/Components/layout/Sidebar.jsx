import { sidebarConfig } from './sidebarConfig';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Image from "../../images/logo.png"
import { useDispatch } from 'react-redux';
import { toggleMultiSelectMenu } from '../../features/appSlice';

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch()
  
  return (
    <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className='text-lg w-60 h-full p-8 px-0.5 bg-white border-r border-gray-200 min-h-[100vh] sticky top-0'>
      <div className="items-center justify-center gap-2 flex mb-10">
        <img className='h-8' src={Image} alt="Logo" />
        <span className='font-bold text-gray-800'>Kanto Blog</span>
      </div>
      <div className="text-gray-400 px-3 text-xs font-semibold uppercase tracking-wider">Menu</div>
      <div className="mt-2">
        {sidebarConfig.map((each, index) => {
          const isActive = location.pathname.includes('dashboard') 
            ? each.name === "Dashboard"
            : each.name === "Sites";
          
          return (
            <Link key={index} to={each.link}>
              <div className={`my-1 mx-3 items-center flex p-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <div className="px-2 text-lg">{each.icon}</div>
                <div className="text-sm font-medium">{each.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}
