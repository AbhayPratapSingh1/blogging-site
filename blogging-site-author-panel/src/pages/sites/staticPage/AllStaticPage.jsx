import React, { useEffect } from 'react'
import Table from '../../../Components/table/Table'
import { StaticPageHeader } from '../../../Components/table/tabledata'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { getAllStaticPagesRequest } from '../../../features/staticPagesSlice'
import { MdOutlineAddBox } from "react-icons/md";

function AllStaticPage() {
  const { siteId } = useParams()
  const dispatch = useDispatch()
  const data = useSelector(state => state.staticPages.allStaticPages)

  useEffect(() => {
    dispatch(getAllStaticPagesRequest(siteId))
  }, [dispatch, siteId])

  return (
    <div className='px-6 py-4 bg-gray-100 min-h-screen'>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Static Pages</h2>
          <p className="text-sm text-gray-500">{data?.length || 0} pages</p>
        </div>
        <Link 
          to={`/sites/${siteId}/static-page/add-new`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MdOutlineAddBox className="text-lg" />
          <span className="font-medium">Add New</span>
        </Link>
      </div>

      <Table 
        header={StaticPageHeader} 
        streamData={data} 
        editLink={`/sites/${siteId}/static-page/update-static-page`} 
        DeleteLink={`/sites/${siteId}/static-page/delete`} 
      />
    </div>
  )
}

export default AllStaticPage
