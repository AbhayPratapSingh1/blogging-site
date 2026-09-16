import React, { useEffect, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline, MdOutlineAddBox } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getAllTagsRequest } from '../../../features/tagsSlice'

function AllTags() {
  const { siteId } = useParams()
  const dispatch = useDispatch()
  const data = useSelector(state => state.tags.allTags)
  const [editOn, setEditOn] = useState(-1)

  useEffect(() => {
    dispatch(getAllTagsRequest(siteId))
  }, [dispatch, siteId])

  return (
    <div className='px-6 py-4 bg-gray-100 min-h-screen'>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Tags</h2>
          <p className="text-sm text-gray-500">{data?.length || 0} total tags</p>
        </div>
        <Link 
          to={`/sites/${siteId}/tags/add-new`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MdOutlineAddBox className="text-lg" />
          <span className="font-medium">Add New</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {data?.length > 0 && data.map((each, index) => {
            return (
              <div 
                key={index}
                onMouseEnter={() => setEditOn(index)} 
                onMouseLeave={() => editOn === index && setEditOn(-1)} 
                className="relative group"
              >
                <div className="h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                  {each.tagName}
                </div>
                {index === editOn && (
                  <div className="absolute -top-12 left-0 right-0 h-10 bg-white border border-gray-200 rounded-lg shadow-lg flex justify-center gap-2 items-center z-10">
                    <Link 
                      to={`/sites/${siteId}/tags/update-tags/${each._id}`}
                      className="p-1.5 hover:bg-gray-100 rounded-md text-blue-600 transition-colors"
                    >
                      <FaRegEdit />
                    </Link>
                    <Link 
                      to={`/sites/${siteId}/tags/delete/${each._id}`}
                      className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors"
                    >
                      <MdDeleteOutline className="text-xl" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
          {(!data || data.length === 0) && (
            <p className="text-gray-400 text-sm">No tags yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllTags
