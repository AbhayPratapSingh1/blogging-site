import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllSitesRequest } from "../../features/siteSlice";
import { FaSitemap } from "react-icons/fa";
export default function AllSites() {
  const dispatch = useDispatch();

  const sitesArray = useSelector((state) => state.sites.allSites);
  useEffect(() => {
    dispatch(getAllSitesRequest());
  }, [dispatch]);

  return (
    <main className="h-full p-5 bg-gray-100">
      {sitesArray.map((site, index) => {
        const statusColor = site.isActive ? "text-green-500" : "text-red-400";
        return (
          <Link key={index} to={`/sites/${site._id}`}>
            <div className="border rounded-xl p-4 w-60 shadow-2xl ">
              <p className="text-lg text-gray-700">{site.name}</p>
              <div className="flex justify-center text-4xl text-gray-600 my-4">
                <FaSitemap />
              </div>
              <p className="text-gray-400 text-sm">
                Id : {site._id}
              </p>
              <p className={`text-gray-400 text-sm ${statusColor}`}>
                {site.isActive ? "Active" : "Not Active"}
              </p>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
