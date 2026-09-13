import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tagsAPI } from '../api/tagsAPI'
import {  setMessage } from './appSlice'

export const getAllTagsRequest = createAsyncThunk("tags/getAllTagsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await tagsAPI.getAll(sendData)
        dispatch(setAllTags(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewTagsRequest = createAsyncThunk("tags/addNewTagsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await tagsAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleTagsRequest = createAsyncThunk("tags/singleTagsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await tagsAPI.single(sendData)
        dispatch(setSingleTags(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateTagsRequest = createAsyncThunk("tags/updateTagsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await tagsAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})
export const deleteTagsRequest = createAsyncThunk("tags/deleteTagsRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await tagsAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allTags: [],
    singleTags: {},
    errorInTags: ''
}


export const tagsSlice = createSlice({
    name: "Tags",
    initialState,
    reducers: {
        setAllTags: (state, action) => {
            state.allTags = action.payload
        },
        setSingleTags: (state, action) => {
            state.singleTags = action.payload
        },
        clearError: (state) => {
            state.errorInTags =''
        }
    }
, extraReducers:(builder)=>{
    builder
        .addCase(getAllTagsRequest.rejected, (state, action)=>{
            state.errorInTags= action.payload
        })
        .addCase(addNewTagsRequest.rejected, (state, action)=>{
            state.errorInTags= action.payload
        })
        .addCase(updateTagsRequest.rejected, (state, action)=>{
            state.errorInTags= action.payload
        })
        .addCase(singleTagsRequest.rejected, (state, action)=>{
            state.errorInTags= action.payload
        })
        .addCase(deleteTagsRequest.rejected, (state, action)=>{
            state.errorInTags= action.payload
        })
}
})


export const { setAllTags,setSingleTags, clearError } = tagsSlice.actions

export default tagsSlice.reducer