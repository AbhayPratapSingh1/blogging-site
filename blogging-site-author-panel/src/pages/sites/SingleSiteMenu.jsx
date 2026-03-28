import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { singleSiteRequest } from '../../features/siteSlice'
import { getAllAuthorRequest } from '../../features/authorSlice'


export default function SingleSiteAuthors({ slug }) {

  const dispatch = useDispatch()

  const site = useSelector(state => state.sites.singleSite)
  const allAuthorArray = useSelector(state => state.author.allAuthors)



  useEffect(() => {
    dispatch(getAllAuthorRequest())
    dispatch(singleSiteRequest())
    console.log("all authores : ", allAuthorArray);
    console.log("single site : ", site);
  }, [dispatch])

  return (
    <section className="p-4"><h2 class="text-4xl font-extrabold dark:text-white py-4">All Authors</h2>
      {allAuthorArray && allAuthorArray.length > 0 && allAuthorArray.map(one => {
        return <Link to={`/sites/${one._id}`}><button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{one.name}</button></Link>
      })}</section>
  )
}
