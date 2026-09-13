import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAPI } from '../api/loginAPI'
import { setIsAuthenticated } from './appSlice'

export const doLoginRequest = createAsyncThunk("login/doLoginRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const { accessToken } = await loginAPI.login(sendData)

        localStorage.setItem('abToken', accessToken)
        dispatch(setIsAuthenticated(true))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

export const getuserRequest = createAsyncThunk("login/getuserRequest", async (sendData, { dispatch, rejectWithValue }) => {
    try {
        const data = await loginAPI.getuser()
        dispatch(setUser(data))
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response.data.message)
        }
    }
})

const initialState = {
    user: {},
    errorInUser: ''
}


export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        clearError: (state, action) => {
            state.errorInUser = ''
        }
    }
    , extraReducers: (builder) => {
        builder.addCase(getuserRequest.rejected, (state, action) => {
            console.log("getuser failed:", action.payload);
            state.errorInUser = action.payload
        }),
            builder.addCase(doLoginRequest.rejected, (state, action) => {
                state.errorInUser = action.payload
            })
    }
})


export const { setUser, clearError } = loginSlice.actions

export default loginSlice.reducer