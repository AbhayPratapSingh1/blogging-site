import React, { useEffect } from 'react'
import Table from '../../../Components/table/Table'
import { headerBlogs } from '../../../Components/table/tabledata'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBlogsRequest } from '../../../features/blogSlice'

import { CiCirclePlus } from "react-icons/ci";
import { Link, useParams } from 'react-router-dom'
import AddNew from '../../../Components/common/addNew'
function AllBlogs() {
  const { siteId } = useParams()
  const ActionDiv = { name: "Add New", link: `/sites/${siteId}/blogs/add-new` }
  
  const dispatch = useDispatch()
  const data = useSelector(state => state.blogs.allBlogs)
  useEffect(() => {
    dispatch(getAllBlogsRequest(siteId))
  }, [dispatch])
  console.log(data[0]);
  return (
    <div className='px-5 bg-gray-100'>
      <p className="text-md font-bold">Total Blogs</p>
      <p className="text-gray-500">{data.length}</p>
      <div className="flex my-10">
        <Table header={headerBlogs} streamData={data} ActionDiv={ActionDiv} editLink={`/sites/${siteId}/blogs/update-blog`} DeleteLink={`/sites/${siteId}/blogs/delete`} />
        <AddNew link={`/sites/${siteId}/blogs/add-new`}/>
      </div>
    </div>
  )
}

export default AllBlogs
