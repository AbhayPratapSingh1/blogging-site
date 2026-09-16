import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getAllAuthorRequest } from '../../../features/authorSlice'

function AllAuthors() {
  const { siteId } = useParams()
  const dispatch = useDispatch()
  const Authors = useSelector(state => state.author.allAuthors)

  useEffect(() => {
    dispatch(getAllAuthorRequest(siteId))
  }, [dispatch, siteId])

  return (
    <div className='px-6 py-4 bg-gray-100 min-h-screen'>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Authors</h2>
        <p className="text-sm text-gray-500">{Authors?.length || 0} authors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Authors?.map((each, index) => {
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200">
                  <img 
                    src={each.profilePic?.url} 
                    alt={each.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{each.name}</h3>
                  <p className="text-sm text-gray-500">{each.email}</p>
                </div>
              </div>
            </div>
          )
        })}
        {(!Authors || Authors.length === 0) && (
          <p className="text-gray-400 text-sm col-span-3 text-center py-8">No authors yet</p>
        )}
      </div>
    </div>
  )
}

export default AllAuthors
