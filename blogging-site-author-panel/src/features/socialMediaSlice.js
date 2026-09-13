import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { socialMediaAPI } from '../api/socialMediaAPI'
import {  setMessage } from './appSlice'

export const getAllSocialMediaRequest = createAsyncThunk("socialMedia/getAllSocialMediaRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await socialMediaAPI.getAll(sendData)
        dispatch(setAllSocialMedia(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewSocialMediaRequest = createAsyncThunk("socialMedia/addNewSocialMediaRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await socialMediaAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleSocialMediaRequest = createAsyncThunk("socialMedia/singleSocialMediaRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await socialMediaAPI.single(sendData)
        dispatch(setSingleSocialMedia(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateSocialMediaRequest = createAsyncThunk("socialMedia/updateSocialMediaRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await socialMediaAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})
export const deleteSocialMediaRequest = createAsyncThunk("socialMedia/deleteSocialMediaRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await socialMediaAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allSocialMedias: [],
    singleSocialMedia: {},
    errorInSocialMedia: ''
}


export const socialMediaSlice = createSlice({
    name: "SocialMedia",
    initialState,
    reducers: {
        setAllSocialMedia: (state, action) => {
            state.allSocialMedias = action.payload
        },
        setSingleSocialMedia: (state, action) => {
            state.singleSocialMedia = action.payload
        },
        clearError: (state) => {
            state.errorInSocialMedia =''
        }
    }
, extraReducers:(builder)=>{
    builder
        .addCase(getAllSocialMediaRequest.rejected, (state, action)=>{
            state.errorInSocialMedia= action.payload
        })
        .addCase(addNewSocialMediaRequest.rejected, (state, action)=>{
            state.errorInSocialMedia= action.payload
        })
        .addCase(updateSocialMediaRequest.rejected, (state, action)=>{
            state.errorInSocialMedia= action.payload
        })
        .addCase(singleSocialMediaRequest.rejected, (state, action)=>{
            state.errorInSocialMedia= action.payload
        })
        .addCase(deleteSocialMediaRequest.rejected, (state, action)=>{
            state.errorInSocialMedia= action.payload
        })
}
})


export const { setAllSocialMedia,setSingleSocialMedia, clearError } = socialMediaSlice.actions

export default socialMediaSlice.reducer