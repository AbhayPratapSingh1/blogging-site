import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { navigationAPI } from '../api/navigationAPI'
import {  setMessage } from './appSlice'

export const getAllNavigationRequest = createAsyncThunk("navigation/getAllNavigationRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await navigationAPI.getAll(sendData)
        dispatch(setAllNavigation(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const addNewNavigationRequest = createAsyncThunk("navigation/addNewNavigationRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await navigationAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleNavigationRequest = createAsyncThunk("navigation/singleNavigationRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await navigationAPI.single(sendData)
        dispatch(setSingleNavigation(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateNavigationRequest = createAsyncThunk("navigation/updateNavigationRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await navigationAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})
export const deleteNavigationRequest = createAsyncThunk("navigation/deleteNavigationRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await navigationAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allNavigations: [],
    singleNavigation: {},
    errorInNavigation: ''
}


export const navigationSlice = createSlice({
    name: "Navigation",
    initialState,
    reducers: {
        setAllNavigation: (state, action) => {
            state.allNavigations = action.payload
        },
        setSingleNavigation: (state, action) => {
            state.singleNavigation = action.payload
        },
        clearError: (state) => {
            state.errorInNavigation =''
        }
    }
, extraReducers:(builder)=>{
    builder.addCase(getAllNavigationRequest.rejected, (state, action)=>{
        state.errorInNavigation= action.payload
    }),
    builder.addCase(addNewNavigationRequest.rejected, (state, action)=>{
        state.errorInNavigation= action.payload
    }),    builder.addCase(updateNavigationRequest.rejected, (state, action)=>{
        state.errorInNavigation= action.payload
    }),
    builder.addCase(singleNavigationRequest.rejected, (state, action)=>{
        state.errorInNavigation= action.payload
    }),
    builder.addCase(deleteNavigationRequest.rejected, (state, action)=>{
        state.errorInNavigation= action.payload
    })
}
})


export const { setAllNavigation,setSingleNavigation, clearError } = navigationSlice.actions

export default navigationSlice.reducer