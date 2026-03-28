
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from "react-router-dom";

import DashBoardLayout from './Components/layout/DashBoardLayout';

import Dashboard from "./pages/dashboard/dashboard";

import Login from "./pages/login/login";

import AllSites from './pages/sites/AllSites';
import SiteMenu from './pages/sites/SiteMenu';

import AllBlogs from './pages/sites/blogs/AllBlogs';
import AddUpdateBlog from './pages/sites/blogs/AddUpdateBlog';
import DeleteBlog from './pages/sites/blogs/DeleteBlog';

import AllCategory from './pages/sites/category/AllCategory';
import AddUpdateCategory from './pages/sites/category/AddUpdateCategory';
import DeleteCategory from './pages/sites/category/DeleteCategory';

import AllTags from './pages/sites/tags/AllTags';
import AddUpdateTags from './pages/sites/tags/AddUpdateTags';
import DeleteTags from './pages/sites/tags/DeleteTags';

import AllAuthors from './pages/sites/authors/AllAuthors';

import AllNavigation from './pages/sites/navigation/allNavigation';
import AddUpdateNavigation from './Components/forms/AddUpdateNavigation';
import DeleteNavigation from './pages/sites/navigation/DeleteNavigation';
import AllSocialMedia from './pages/sites/socialMedia/allSocialMedia';
import DeleteSocialMedia from './pages/sites/socialMedia/deleteSocialMedia';
import AddUpdateSocialMedia from './Components/forms/AddUpdateSocialMedia';
import AllStaticPage from './pages/sites/staticPage/AllStaticPage';
import AddUpdateStaticPage from './Components/forms/AddUpdateStaticPage';
import DeleteStaticPage from './pages/sites/staticPage/DeleteStaticPage';
import Select from './Components/common/multiSelectTag';


const AvailRoutes = (props) => { 
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/temp" element={<Select />} /> */}
      <Route path={`/dashboard`} element={<DashBoardLayout title="Welcome Back"></DashBoardLayout>} />
      {/* <Route path={`/dashboard`} element={<DashBoardLayout title="Welcome Back"><Dashboard /></DashBoardLayout>} /> */}
      <Route path={`/sites`} element={<DashBoardLayout title="Your Sites"><AllSites/></DashBoardLayout>} />
      <Route path={`/sites/:siteId`} element={<DashBoardLayout title="Explore Site"> <SiteMenu/></DashBoardLayout>} />

      <Route path={`/sites/:siteId/blogs`} element={<DashBoardLayout title="Your Blogs"> <AllBlogs/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/blogs/add-new`} element={<DashBoardLayout title="Add New Blog"> <AddUpdateBlog/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/blogs/update-blog/:blogId`} element={<DashBoardLayout title="Update Old Blog"> <AddUpdateBlog edit /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/blogs/delete/:blogId`} element={<DashBoardLayout title="Delete Your Blog ?"> <DeleteBlog/></DashBoardLayout>} />
      
      <Route path={`/sites/:siteId/categories`} element={<DashBoardLayout title="Your Categories" description="Here is the summary of all the categories that are added."><AllCategory/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/categories/add-new`} element={<DashBoardLayout title="Add New Category" description="Fill the Form and upload to submit new Category."> <AddUpdateCategory/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/categories/update-category/:categoryId`} element={<DashBoardLayout title="Update Category" description="Fill the Form and upload to Update Category."> <AddUpdateCategory edit /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/categories/delete/:categoryId`} element={<DashBoardLayout title="Delete Your Category ?" description="Confirm to delete your Category!"> <DeleteCategory/></DashBoardLayout>} />

      <Route path={`/sites/:siteId/tags`} element={<DashBoardLayout title="Your Tags" description="Here is the summary of all the Tags that are added." ><AllTags/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/tags/add-new`} element={<DashBoardLayout title="Add New Tags" description="Fill the Form and upload to submit new Tags." > <AddUpdateTags/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/tags/update-tags/:tagId`} element={<DashBoardLayout title="Update Tags" description="Fill the Form and upload to Update Tags." > <AddUpdateTags edit /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/tags/delete/:tagId`} element={<DashBoardLayout title="Delete Your Tag ?" description="Confirm to delete your Tag!"> <DeleteTags/></DashBoardLayout>} />

      <Route path={`/sites/:siteId/navigation`} element={<DashBoardLayout title="Your Navigations" description="Follow are the list of the Navigations in the web page." ><AllNavigation/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/navigation/add-new`} element={<DashBoardLayout title="Add New Navigation" description="Fill the Form and upload to submit new Navigation." > <AddUpdateNavigation/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/navigation/update-navigation/:navId`} element={<DashBoardLayout title="Update Navigation" description="Fill the Form and upload to Update Navigation." > <AddUpdateNavigation edit /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/navigation/delete/:navId`} element={<DashBoardLayout title="Delete Your Navigation ?" description="Confirm to delete your Navigation!" > <DeleteNavigation/></DashBoardLayout>} />
      
      <Route path={`/sites/:siteId/social-media`} element={<DashBoardLayout title="Your Social Media" description="Follow are the list of the Social Medias in the web page." ><AllSocialMedia/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/social-media/add-new`} element={<DashBoardLayout title="Add New Social Media" description="Fill the Form and upload to submit new Social Media." > <AddUpdateSocialMedia/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/social-media/update-social-media/:socialMediaId`} element={<DashBoardLayout title="Update Social Media" description="Fill the Form and upload to Update Social Media." > <AddUpdateSocialMedia edit /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/social-media/delete/:socialMediaId`} element={<DashBoardLayout  title="Delete Your Social Media ?" description="Confirm to delete your Social Media!" > <DeleteSocialMedia/></DashBoardLayout>} />
      
      <Route path={`/sites/:siteId/static-page`} element={<DashBoardLayout title="Your Static Pages" description="Follow are the list of the Static Pages in the web page." ><AllStaticPage /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/static-page/add-new`} element={<DashBoardLayout title="Add New Static Pages" description="Fill the Form and upload to submit new Static Pages." > <AddUpdateStaticPage/></DashBoardLayout>} />
      <Route path={`/sites/:siteId/static-page/update-static-page/:staticPageId`} element={<DashBoardLayout title="Update Static Page" description="Fill the Form and upload to Update Static Page." > <AddUpdateStaticPage edit /></DashBoardLayout>} />
      <Route path={`/sites/:siteId/static-page/delete/:staticPageId`} element={<DashBoardLayout  title="Delete Your Static Page ?" description="Confirm to delete your Static Page!" > <DeleteStaticPage/></DashBoardLayout>} />
      
    </Routes>

  );
};
export default AvailRoutes