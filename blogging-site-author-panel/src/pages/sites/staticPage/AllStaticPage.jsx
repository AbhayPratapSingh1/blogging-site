import React, { useEffect } from 'react'
import Table from '../../../Components/table/Table'
import { StaticPageHeader } from '../../../Components/table/tabledata'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllStaticPagesRequest } from '../../../features/staticPagesSlice'
import AddNew from '../../../Components/common/addNew'
function AllStaticPage() {
  const { siteId } = useParams()
  const ActionDiv = { name: "add", link: `/sites/${siteId}/static-page/add-new` }

  const dispatch = useDispatch()
  const data = useSelector(state => state.staticPages.allStaticPages)
  // console.log("data L ");
  useEffect(() => {
    dispatch(getAllStaticPagesRequest(siteId))
  }, [dispatch])
  return (
    <div className='p-10 bg-gray-100 flex h-full'>
      <Table header={StaticPageHeader} streamData={data} ActionDiv={ActionDiv} editLink={`/sites/${siteId}/static-page/update-static-page`} DeleteLink={`/sites/${siteId}/static-page/delete`} />
      <div className=" w-[20rem] ">
        <AddNew link={`/sites/${siteId}/static-page/add-new`} />
      </div>

    </div>
  )
}

export default AllStaticPage
