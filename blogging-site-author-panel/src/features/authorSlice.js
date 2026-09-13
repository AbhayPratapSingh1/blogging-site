import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authorAPI } from '../api/authorAPI'
import {  setMessage } from './appSlice'

export const getAllAuthorRequest = createAsyncThunk("author/getAllAuthorRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await authorAPI.getAll(sendData)
        dispatch(setAllAuthor(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewAuthorRequest = createAsyncThunk("author/addNewAuthorRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await authorAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleAuthorRequest = createAsyncThunk("author/singleAuthorRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await authorAPI.single(sendData)
        dispatch(setSingleAuthor(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateAuthorRequest = createAsyncThunk("author/updateAuthorRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await authorAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})
export const deleteAuthorRequest = createAsyncThunk("author/deleteAuthorRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await authorAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allAuthors: [],
    singleAuthor: {},
    errorInAuthor: ''
}


export const authorSlice = createSlice({
    name: "authors",
    initialState,
    reducers: {
        setAllAuthor: (state, action) => {
            state.allAuthors = action.payload
        },
        setSingleAuthor: (state, action) => {
            state.singleAuthor = action.payload
        },
        clearError: (state) => {
            state.errorInAuthor =''
        }
    }
, extraReducers:(builder)=>{
    builder
        .addCase(getAllAuthorRequest.rejected, (state, action)=>{
            state.errorInAuthor= action.payload
        })
        .addCase(addNewAuthorRequest.rejected, (state, action)=>{
            state.errorInAuthor= action.payload
        })
        .addCase(updateAuthorRequest.rejected, (state, action)=>{
            state.errorInAuthor= action.payload
        })
        .addCase(singleAuthorRequest.rejected, (state, action)=>{
            state.errorInAuthor= action.payload
        })
        .addCase(deleteAuthorRequest.rejected, (state, action)=>{
            state.errorInAuthor= action.payload
        })
}
})


export const { setAllAuthor,setSingleAuthor, clearError } = authorSlice.actions

export default authorSlice.reducer