import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { categoryAPI } from '../api/categoryAPI'
import {  setMessage } from './appSlice'

export const getAllCategoryRequest = createAsyncThunk("category/getAllCategoryRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data = await categoryAPI.getAll(sendData)
        dispatch(setAllCategory(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


export const addNewCategoryRequest = createAsyncThunk("category/addNewCategoryRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await categoryAPI.addNew(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const singleCategoryRequest = createAsyncThunk("category/singleCategoryRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await categoryAPI.single(sendData)
        dispatch(setSingleCategory(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})



export const updateCategoryRequest = createAsyncThunk("category/updateCategoryRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await categoryAPI.update(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})
export const deleteCategoryRequest = createAsyncThunk("category/deleteCategoryRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data= await categoryAPI.delete(sendData)
        dispatch(setMessage(data.message))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})


const initialState = {
    allCategories: [],
    singleCategory: {},
    errorInCategory: ''
}


export const categorySlice = createSlice({
    name: "Categorys",
    initialState,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategories = action.payload
        },
        setSingleCategory: (state, action) => {
            state.singleCategory = action.payload
        },
        clearError: (state) => {
            state.errorInCategory =''
        }
    }
, extraReducers:(builder)=>{
    builder
        .addCase(getAllCategoryRequest.rejected, (state, action)=>{
            state.errorInCategory= action.payload
        })
        .addCase(addNewCategoryRequest.rejected, (state, action)=>{
            state.errorInCategory= action.payload
        })
        .addCase(updateCategoryRequest.rejected, (state, action)=>{
            state.errorInCategory= action.payload
        })
        .addCase(singleCategoryRequest.rejected, (state, action)=>{
            state.errorInCategory= action.payload
        })
        .addCase(deleteCategoryRequest.rejected, (state, action)=>{
            state.errorInCategory= action.payload
        })
}
})


export const { setAllCategory,setSingleCategory, clearError } = categorySlice.actions

export default categorySlice.reducer