import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getAllSitesRequest } from '../../features/siteSlice'
import { FaSitemap } from "react-icons/fa";
export default function AllSites() {
    const dispatch = useDispatch()

    const sitesArray = useSelector(state => state.sites.allSites)
    useEffect(() => {
        dispatch(getAllSitesRequest())
    }, [dispatch])



    return (
        <main className="h-full p-5 bg-gray-100">{sitesArray && sitesArray.length > 0 && sitesArray.map((one,index) => {
            return (
                <Link key={index} to={`/sites/${one._id}`}>
                    <div className="border rounded-xl p-4 w-60 shadow-2xl ">
                        <p className='text-lg text-gray-700'>{one.site}</p>
                        <div className="flex justify-center text-4xl text-gray-600 my-4"><FaSitemap /></div>
                        {/* <p className='text-gray-400 text-sm'>Id : {one._id}</p> */}
                        <p className={`text-gray-400 text-sm ${one.isAcitve ? "text-green-500" : "text-red-400"}`}>{one.isAcitve ? "Acitive" : "Not Active"}</p>
                    </div>
                </Link>
            )
        })}
        </main>
    )
}
