import React from 'react'
import AppRouter from './routers/AppRouter'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <>
      <ToastContainer position='bottom-right'  />
      <AppRouter />
    </>
  )
}

export default App
