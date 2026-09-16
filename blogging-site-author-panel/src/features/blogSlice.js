import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { blogAPI } from '../api/blogAPI'
import {  setMessage } from './appSlice'

export const getAllBlogsRequest = createAsyncThunk("blogs/getAllBlogsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const { siteId, page, limit } = sendData
        const data= await blogAPI.getAll(siteId, page, limit)
        if (page && page > 1) {
            dispatch(appendBlogs(data))
        } else {
            dispatch(setAllBlogs(data))
        }
        return data
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewBlogRequest = createAsyncThunk("blogs/addNewBlogRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await blogAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleBlogRequest = createAsyncThunk("blogs/singleBlogRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await blogAPI.single(sendData)
        dispatch(setSingleBlog(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateBlogRequest = createAsyncThunk("blogs/updateBlogRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await blogAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const deleteBlogRequest = createAsyncThunk("blogs/deleteBlogRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await blogAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allBlogs: [],
    singleBlog: {},
    errorInBlogs: '',
    loading: false,
    page: 1,
    hasMore: true,
    total: 0
}


export const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setAllBlogs: (state, action) => {
            state.allBlogs = action.payload.blogs || action.payload
            state.total = action.payload.total || action.payload.length || 0
            state.hasMore = action.payload.hasMore ?? true
            state.page = 1
            state.loading = false
        },
        appendBlogs: (state, action) => {
            state.allBlogs = [...state.allBlogs, ...(action.payload.blogs || [])]
            state.hasMore = action.payload.hasMore
            state.page = action.payload.page || state.page + 1
            state.loading = false
        },
        setSingleBlog: (state, action) => {
            state.singleBlog = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setPage: (state, action) => {
            state.page = action.payload
        },
        resetBlogs: (state) => {
            state.allBlogs = []
            state.page = 1
            state.hasMore = true
            state.loading = false
        },
        clearError: (state) => {
            state.errorInBlogs =''
        }
    }
, extraReducers:(builder)=>{
    builder
        .addCase(getAllBlogsRequest.pending, (state)=>{
            state.loading = true
        })
        .addCase(getAllBlogsRequest.rejected, (state, action)=>{
            state.errorInBlogs= action.payload
            state.loading = false
        })
        .addCase(addNewBlogRequest.rejected, (state, action)=>{
            state.errorInBlogs= action.payload
        })
        .addCase(updateBlogRequest.rejected, (state, action)=>{
            state.errorInBlogs= action.payload
        })
        .addCase(singleBlogRequest.rejected, (state, action)=>{
            state.errorInBlogs= action.payload
        })
        .addCase(deleteBlogRequest.rejected, (state, action)=>{
            state.errorInBlogs= action.payload
        })
}
})


export const { setAllBlogs, appendBlogs, setSingleBlog, setLoading, setPage, resetBlogs, clearError } = blogSlice.actions

export default blogSlice.reducer