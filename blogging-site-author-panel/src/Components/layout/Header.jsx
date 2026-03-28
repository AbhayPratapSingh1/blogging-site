import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Bell from './DashBoardLatoutComp/Bell';
import Author from './DashBoardLatoutComp/Author';
import Message from './DashBoardLatoutComp/Message';
import { toggleMultiSelectMenu } from '../../features/appSlice';
export default function Header({ title, description }) {
  const user = useSelector(state => state.login.user)
  const dispatch = useDispatch()
  
  return (
    <div onClick={()=>{dispatch(toggleMultiSelectMenu(false))}} className='bg-gray-100 w-full p-4 pb-0 flex z-50 items-top sticky top-0'>
      <div className="ms-5 mt-5">
        <h1 className='text-gray-600 text-2xl font-bold my-1'>{title ? title : ""}</h1>
        <p className='text-gray-600 text-sm'>{description ? description : ""}</p>
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-center items-center h-max">
        <Bell />
        <Message />
        <Author user={user} />
      </div>
    </div>


  )
}
