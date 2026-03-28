import React, {useState} from 'react'
import { BrowserRouter,} from "react-router-dom";
import { Provider } from 'react-redux'
import {store } from "./store/store"
import Routes from "./routes"
import "./index.css"

export default function App() {

  return (
    <Provider store={store} ><BrowserRouter><Routes /></BrowserRouter>  </Provider>
  )
}