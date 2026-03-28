import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { staticPagesAPI } from '../api/staticPagesAPI'
import {  setMessage } from './appSlice'

export const getAllStaticPagesRequest = createAsyncThunk("staticPages/getAllStaticPagesRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await staticPagesAPI.getAll(sendData)
        dispatch(setAllStaticPages(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewStaticPagesRequest = createAsyncThunk("staticPages/addNewStaticPagesRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await staticPagesAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleStaticPageRequest = createAsyncThunk("staticPages/singleStaticPageRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data = await staticPagesAPI.single(sendData)
        dispatch(setSingleStaticPage(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateStaticPagesRequest = createAsyncThunk("staticPages/updateStaticPagesRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await staticPagesAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})
export const deleteStaticPagesRequest = createAsyncThunk("staticPages/deleteStaticPagesRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await staticPagesAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allStaticPages: [],
    singleStaticPage: {},
    errorInStaticPages: ''
}


export const staticPagesSlice = createSlice({
    name: "staticPages",
    initialState,
    reducers: {
        setAllStaticPages: (state, action) => {
            state.allStaticPages = action.payload
        },
        setSingleStaticPage: (state, action) => {
            state.singleStaticPage = action.payload
        },
        clearError: (state) => {
            state.errorInStaticPages =''
        }
    }
, extraReducers:(builder)=>{
    builder.addCase(getAllStaticPagesRequest.rejected, (state, action)=>{
        state.errorInStaticPages= action.payload
    }),
    builder.addCase(addNewStaticPagesRequest.rejected, (state, action)=>{
        state.errorInStaticPages= action.payload
    }),    builder.addCase(updateStaticPagesRequest.rejected, (state, action)=>{
        state.errorInStaticPages= action.payload
    }),
    builder.addCase(singleStaticPageRequest.rejected, (state, action)=>{
        state.errorInStaticPages= action.payload
    }),
    builder.addCase(deleteStaticPagesRequest.rejected, (state, action)=>{
        state.errorInStaticPages= action.payload
    })
}
})


export const { setAllStaticPages,setSingleStaticPage, clearError } = staticPagesSlice.actions

export default staticPagesSlice.reducer