import { useState } from 'react'
import { RouterProvider } from 'react-router'
import {router} from './app.route'
import './App.css'
import {useSelector} from 'react-redux'
import {useAuth} from '../Features/Auth/Hook/UseAuth'
import { useEffect } from 'react'

function App() {
  const {handleGetMe} = useAuth();
  const {user,loading} = useSelector(state => state.auth)
  useEffect(() => {
    handleGetMe();
  },[])

  useEffect(() => {
    console.log("user:", user, "| loading:", loading);
  },[user, loading])

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
