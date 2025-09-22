import React from 'react'
import {createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from 'react-router-dom'
import {Login,Register} from './components/auth/Index'
import AuthLayout from './layouts/AuthLayout'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<AuthLayout/>}>
        <Route path='/' element={<Register/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        </Route>
      </>
    )
  )
  return <RouterProvider router={router}/>
}

export default App