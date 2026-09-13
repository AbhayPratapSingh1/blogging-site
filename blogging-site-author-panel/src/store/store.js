import { configureStore } from '@reduxjs/toolkit'
import appReducer from "../features/appSlice"
import loginReducer from "../features/loginSlice"
import blogReducer from "../features/blogSlice"
import authorReducer from '../features/authorSlice'
import categoryReducer from '../features/categorySlice'
import staticPagesReducer from '../features/staticPagesSlice'
import navigationReducer from '../features/navigationSlice'
import tagsReducer from '../features/tagsSlice'
import socialMediaReducer from '../features/socialMediaSlice'
import siteReducer from '../features/siteSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    login:loginReducer,
    blogs:blogReducer,
    author:authorReducer,
    category:categoryReducer,
    staticPages:staticPagesReducer,
    navigation:navigationReducer,
    tags:tagsReducer,
    socialMedia:socialMediaReducer,
    sites:siteReducer
  },
})