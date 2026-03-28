import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    message: "",
    loading: false,
    profileMenu: false,
    tableMenu: false,
    viewMenu: true,
    multiSelectMenu:false,
}


export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        },
        toggleProfileMenu: (state, action) => {
            state.profileMenu = action.payload
        },
        toggleMultiSelectMenu: (state, action) => {
            state.multiSelectMenu = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setMessage: (state, action) => {
            state.message = action.payload
        },
        toggleTableMenu: (state,action) => {
            state.tableMenu = action.payload
        },
        toggleViewMenu: (state, action) => {
            state.viewMenu = action.payload
        },
    }
})


export const { setIsAuthenticated, toggleProfileMenu, setLoading, setMessage , toggleTableMenu, toggleViewMenu, toggleMultiSelectMenu} = appSlice.actions

export default appSlice.reducer