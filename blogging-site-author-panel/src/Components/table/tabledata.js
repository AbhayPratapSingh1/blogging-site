import { stringClip, formatDate } from "../../utils/helper"

export const headerBlogs = [
  {
    headerName: "Blog Name",
    accesserId: "title",
    type: "string",
    formatFunction: stringClip,
  }, {
    headerName: "Featured Post",
    accesserId: "featured",
    type: "boolean",
    formatFunction: false,
  }, {
    headerName: "Category",
    accesserId: "category",
    type: "string",
    formatFunction: false,
  }, {
    headerName: "Created",
    accesserId: "createdAt",
    type: "date",
    formatFunction: formatDate,
  },
]

export const tagHeaders = [
  {
    headerName: "Tags Name",
    accesserId: "tagName",
    type: "string",
    formatFunction: stringClip,
  },  {
    headerName: "Created At",
    accesserId: "createdAt",
    type: "date",
    formatFunction: formatDate,
  },
]

export const categoryHeaders = [
  {
    headerName: "Category Name",
    accesserId: "categoryName",
    type: "string",
    formatFunction: stringClip,
  },  {
    headerName: "Created At",
    accesserId: "createdAt",
    type: "date",
    formatFunction: formatDate,
  },
]

export const NavigationHeaders = [
  {
    headerName : "Name",
    accesserId : "name",
    type : "string",
    formatFunction : false,
  },{
    headerName : "Link",
    accesserId : "link",
    type : "string",
    formatFunction : false,
  },{
    headerName : "Position",
    accesserId : "position",
    type : "number",
    formatFunction : false,
  },{
    headerName : "Site",
    accesserId : "site",
    type : "string",
    formatFunction : false,
  },
]

export const SocialMediaHeaders = [
  {
    headerName : "Link",
    accesserId : "link",
    type : "string",
    formatFunction : false,
  },{
    headerName : "Name",
    accesserId : "name",
    type : "string",
    formatFunction : false,
  },{
    headerName : "Site",
    accesserId : "site",
    type : "string",
    formatFunction : false,
  },
]

export const StaticPageHeader = [
  {
    headerName: "Desciption",
    accesserId: "description",
    type: "string",
    formatFunction: stringClip,
  }, {
    headerName: "Static Page Name",
    accesserId: "page",
    type: "string",
    formatFunction: false,
  },{
    headerName: "Meta Title",
    accesserId: "metaTitle",
    type: "string",
    formatFunction: false,
  },
]
