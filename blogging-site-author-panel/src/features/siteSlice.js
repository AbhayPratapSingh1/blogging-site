import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { siteAPI } from '../api/siteAPI'
import {  setMessage } from './appSlice'

export const getAllSitesRequest = createAsyncThunk("sites/getAllSitesRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await siteAPI.getAll(sendData)
        dispatch(setAllSites(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewSiteRequest = createAsyncThunk("sites/addNewSiteRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await siteAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleSiteRequest = createAsyncThunk("sites/singleSiteRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await siteAPI.single(sendData)
        dispatch(setsingleSite(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateSiteRequest = createAsyncThunk("sites/updateSiteRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await siteAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const deleteSiteRequest = createAsyncThunk("sites/deleteSiteRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await siteAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allSites: [],
    singleSite: {},
    errorInSite: ''
}


export const siteSlice = createSlice({
    name: "sites",
    initialState,
    reducers: {
        setAllSites: (state, action) => {
            state.allSites = action.payload
        },
        setsingleSite: (state, action) => {
            state.singleSite = action.payload
        },
        clearError: (state) => {
            state.errorInSite =''
        }
    }
, extraReducers:(builder)=>{
    builder.addCase(getAllSitesRequest.rejected, (state, action)=>{
        state.errorInSite= action.payload
    }),
    builder.addCase(addNewSiteRequest.rejected, (state, action)=>{
        state.errorInSite= action.payload
    }),    builder.addCase(updateSiteRequest.rejected, (state, action)=>{
        state.errorInSite= action.payload
    }),
    builder.addCase(singleSiteRequest.rejected, (state, action)=>{
        state.errorInSite= action.payload
    }),
    builder.addCase(deleteSiteRequest.rejected, (state, action)=>{
        state.errorInSite= action.payload
    })
}
})


export const { setAllSites,setsingleSite, clearError } = siteSlice.actions

export default siteSlice.reducer