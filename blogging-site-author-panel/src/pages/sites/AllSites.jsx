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
    <div className="px-6 py-4 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Sites</h2>
        <p className="text-sm text-gray-500">{sitesArray?.length || 0} sites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sitesArray?.map((site, index) => {
          return (
            <Link key={index} to={`/sites/${site._id}`}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaSitemap className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{site.name}</h3>
                    <p className={`text-sm ${site.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      {site.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
