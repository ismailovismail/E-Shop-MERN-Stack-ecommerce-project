import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom'


export default function Private() {
  const location = useLocation()
  let userData;
  const data = localStorage.getItem('userData')
  if (typeof data === 'string') {
    userData = JSON.parse(data)
  }



  return (
    <>
      {
        userData?.user?.role === 1 ?
          <Outlet /> :
          userData?.user && userData?.user?.role === 0 ?
            <Navigate to={'/'} state={{ from: location }} replace /> :
            <Navigate to={'/loginpg'} state={{ from: location }} replace />
      }
    </>
  )
}


