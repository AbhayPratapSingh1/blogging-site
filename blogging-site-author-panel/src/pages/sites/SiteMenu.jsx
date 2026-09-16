import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { singleSiteRequest } from "../../features/siteSlice";
import { RiPagesLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { IoPricetagsOutline } from "react-icons/io5";
import { FiNavigation } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { RiPageSeparator } from "react-icons/ri";
import { MdOutlinePeople } from "react-icons/md";

export default function SiteMenu() {
  const { siteId } = useParams();
  const dispatch = useDispatch();
  const singleSite = useSelector((state) => state.sites.singleSite);

  useEffect(() => {
    dispatch(singleSiteRequest(siteId));
  }, [dispatch, siteId]);

  const menuItems = [
    { name: "Blogs", icon: <RiPagesLine />, link: `/sites/${siteId}/blogs`, color: "blue" },
    { name: "Categories", icon: <BiCategoryAlt />, link: `/sites/${siteId}/categories`, color: "green" },
    { name: "Tags", icon: <IoPricetagsOutline />, link: `/sites/${siteId}/tags`, color: "purple" },
    { name: "Navigation", icon: <FiNavigation />, link: `/sites/${siteId}/navigation`, color: "orange" },
    { name: "Social Media", icon: <IoShareSocialOutline />, link: `/sites/${siteId}/social-media`, color: "pink" },
    { name: "Static Pages", icon: <RiPageSeparator />, link: `/sites/${siteId}/static-page`, color: "teal" },
    { name: "Authors", icon: <MdOutlinePeople />, link: `/sites/${siteId}/authors`, color: "indigo" },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    pink: "bg-pink-100 text-pink-600",
    teal: "bg-teal-100 text-teal-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="px-6 py-4 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Site</p>
        <h2 className="text-2xl font-semibold text-gray-800">{singleSite?.name || "Loading..."}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.link}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${colorClasses[item.color]}`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
