import React, { useEffect, useState } from 'react'

import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getAllCategoryRequest } from '../../../features/categorySlice'
import AddNew from '../../../Components/common/addNew'

function AllCategory() {
  const { siteId } = useParams()

  const [editOn, setEditOn] = useState(-1)
  const dispatch = useDispatch()
  const data = useSelector(state => state.category.allCategories)

  useEffect(() => {
    dispatch(getAllCategoryRequest(siteId))
  }, [dispatch, siteId])
  return (
    <div className='px-10 py-4 bg-gray-100 h-full' >
      <p className="text-md text-gray-600 font-bold">Total Categories</p>
      <p className="text-gray-500">{data.length}</p>
      <div className="my-5 flex">
        <div className="border rounded-xl bg-gray-50 p-5 h-max flex flex-wrap gap-x-3 gap-y-2 shadow-2xl">
          {data?.length > 0 && data.map((each, index) => {
            return (
              <div key={index} onMouseEnter={() => { setEditOn(index) }} onMouseLeave={() => { editOn == index && setEditOn(-1) }} className="relative">
                <div key={index} className="h-10 min-w-24 shrink-0 text-center bg-white px-6 py-1.5 shadow-md rounded-md border border-gray-300">{each.categoryName}</div>
                {index === editOn &&
                  <div className="absolute -top-10 right-0 h-10 w-full bg-gray-200  border border-gray-500 text-gray-600 rounded-xl flex justify-center gap-3 text-xl items-center">
                    <Link to={`/sites/${siteId}/categories/update-category/${each._id}`} >
                      <FaRegEdit />
                    </Link>
                    <Link to={`/sites/${siteId}/categories/delete/${each._id}`} >
                      <div className="text-2xl">
                        <MdDeleteOutline />
                      </div>
                    </Link>
                  </div>
                }
              </div>
            )
          })}
        </div>
        <div className=" min-w-[20rem] ">
          <AddNew link={`/sites/${siteId}/categories/add-new`} />
        </div>
      </div>
    </div>
  )
}

export default AllCategory