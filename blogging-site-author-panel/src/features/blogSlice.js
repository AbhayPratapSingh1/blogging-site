import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { blogAPI } from '../api/blogAPI'
import {  setMessage } from './appSlice'

export const getAllBlogsRequest = createAsyncThunk("blogs/getAllBlogsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await blogAPI.getAll(sendData)
        dispatch(setAllBlogs(data))
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
    errorInBlogs: ''
}


export const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setAllBlogs: (state, action) => {
            state.allBlogs = action.payload
        },
        setSingleBlog: (state, action) => {
            state.singleBlog = action.payload
        },
        clearError: (state) => {
            state.errorInBlogs =''
        }
    }
, extraReducers:(builder)=>{
    builder.addCase(getAllBlogsRequest.rejected, (state, action)=>{
        state.errorInBlogs= action.payload
    }),
    builder.addCase(addNewBlogRequest.rejected, (state, action)=>{
        state.errorInBlogs= action.payload
    }),    builder.addCase(updateBlogRequest.rejected, (state, action)=>{
        state.errorInBlogs= action.payload
    }),
    builder.addCase(singleBlogRequest.rejected, (state, action)=>{
        state.errorInBlogs= action.payload
    }),
    builder.addCase(deleteBlogRequest.rejected, (state, action)=>{
        state.errorInBlogs= action.payload
    })
}
})


export const { setAllBlogs,setSingleBlog, clearError } = blogSlice.actions

export default blogSlice.reducer