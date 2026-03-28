import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSiteRequest } from "../../features/siteSlice";
import { LinkButton } from "../../Components/common/button";

import { RiPagesLine } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
// import { FaTag } from "react-icons/fa";
import { IoPricetagsOutline } from "react-icons/io5";
// import { FaRegFaceGrinWide } from "react-icons/fa6";
import { FiNavigation } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { RiPageSeparator } from "react-icons/ri";
export default function SiteMenu() {
  const { siteId } = useParams();
  const dispatch = useDispatch();
  const singleSite = useSelector((state) => state.sites.singleSite);

  useEffect(() => {
    dispatch(singleSiteRequest(siteId));
  }, [dispatch]);

  return (
    <div className="px-5 bg-gray-100 h-full">
      <h2 className="text-xl font-semibold py-4 text-gray-700 leading-5">
        <span className="text-sm text-gray-400">Site</span> <br />
        {singleSite.name}
      </h2>
      <div className="flex gap-10 flex-wrap">
        <LinkButton
          name={"Manage Blogs"}
          icon={<RiPagesLine />}
          link={`/sites/${siteId}/blogs`}
        />
        <LinkButton
          name={"Manage Category"}
          icon={<BiCategoryAlt />}
          link={`/sites/${siteId}/categories`}
        />
        <LinkButton
          name={"Manage Tags"}
          icon={<IoPricetagsOutline />}
          link={`/sites/${siteId}/tags`}
        />
        {/* <LinkButton name={"Manage Authors"} description="Add Update all of your Authors of the site" icon={<FaRegFaceGrinWide/>} link={`/sites/${siteId}/authors`} /> */}
        <LinkButton
          name={"Manage Navigation"}
          icon={<FiNavigation />}
          link={`/sites/${siteId}/navigation`}
        />
        <LinkButton
          name={"Manage Social Media"}
          icon={<IoShareSocialOutline />}
          link={`/sites/${siteId}/social-media`}
        />
        <LinkButton
          name={"Manage Static Page"}
          icon={<RiPageSeparator />}
          link={`/sites/${siteId}/static-page`}
        />
      </div>
      {/* <LinkButton name={"" } link={``}/> */}
    </div>
  );
}
