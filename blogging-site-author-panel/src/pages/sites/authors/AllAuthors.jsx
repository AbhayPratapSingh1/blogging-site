import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getAllAuthorRequest } from '../../../features/authorSlice'
function AllAuthors() {

  const { siteId } = useParams()

  const dispatch = useDispatch()

  const Authors = useSelector(state => state.author.allAuthors)
  console.log("tags  L ", Authors);

  useEffect(() => {
    dispatch(getAllAuthorRequest())
  }, [dispatch])
  return (
    <div className="flex flex-wrap justify-evenly gap-2 my-5">
      {Authors?.map((each, index) => {
        return (
          <div key={index} on className="max-w-96 flex-wrap flex-grow shrink-0 bg-white p-2 md:p-5 m-2 md:my-8 border rounded-xl flex justify-evenly items-center [box-shadow:15px_15px_15px_gray]">
            <div className="shrink-0 overflow-hidden mr-2 inline-block h-28 w-28 rounded-full bg-gray-300" ><img style={{ objectFit: "cover" }} height={100} width={100} src={each.profilePic?.url} alt={each.name} /></div>
            <div className="flex flex-col ">
              <div className="text-black font-bold text-lg">{each.name}</div>
              <div className="text-gray-400 font-extralight text-sm">{each.email}</div>
              <div className=" mt-5 flex  basis-full gap-10 justify-center">
                <Link to={``}> <div className="border px-2 rounded text-gray-500 bg-gray-200">Edit</div></Link>
                <Link to={``}> <div className="border px-2 rounded text-gray-500 bg-gray-200">Delete</div></Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AllAuthors