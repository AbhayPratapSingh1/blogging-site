import React, { useEffect, useRef, useCallback } from 'react'
import Table from '../../../Components/table/Table'
import { headerBlogs } from '../../../Components/table/tabledata'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBlogsRequest, resetBlogs } from '../../../features/blogSlice'
import { Link, useParams } from 'react-router-dom'
import AddNew from '../../../Components/common/addNew'
import { MdOutlineAddBox } from "react-icons/md";

const PAGE_SIZE = 20

function AllBlogs() {
  const { siteId } = useParams()
  const dispatch = useDispatch()
  const { allBlogs, loading, page, hasMore, total } = useSelector(state => state.blogs)

  const observer = useRef()
  const lastBlogRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1
        dispatch(getAllBlogsRequest({ siteId, page: nextPage, limit: PAGE_SIZE }))
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, page, dispatch, siteId])

  useEffect(() => {
    dispatch(resetBlogs())
    dispatch(getAllBlogsRequest({ siteId, page: 1, limit: PAGE_SIZE }))
    return () => dispatch(resetBlogs())
  }, [dispatch, siteId])

  return (
    <div className='px-6 py-4 bg-gray-100 min-h-screen'>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Blogs</h2>
          <p className="text-sm text-gray-500">
            {total || allBlogs.length} total blogs
            {hasMore && ` • Showing ${allBlogs.length}`}
          </p>
        </div>
        <Link 
          to={`/sites/${siteId}/blogs/add-new`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MdOutlineAddBox className="text-lg" />
          <span className="font-medium">Add New</span>
        </Link>
      </div>

      <Table 
        header={headerBlogs} 
        streamData={allBlogs} 
        editLink={`/sites/${siteId}/blogs/update-blog`} 
        DeleteLink={`/sites/${siteId}/blogs/delete`}
        lastRowRef={lastBlogRef}
      />

      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!hasMore && allBlogs.length > 0 && (
        <p className="text-center text-gray-400 py-4 text-sm">All blogs loaded</p>
      )}
    </div>
  )
}

export default AllBlogs
