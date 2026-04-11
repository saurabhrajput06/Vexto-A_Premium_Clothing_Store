import { useState } from 'react'
import { RouterProvider } from 'react-router'
import {router} from './app.route'
import './App.css'

function App() {

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
