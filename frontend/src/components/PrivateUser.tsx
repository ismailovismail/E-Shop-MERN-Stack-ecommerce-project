import React from 'react'
import { useLocation } from 'react-router-dom';
import { Outlet,Navigate } from 'react-router-dom';
const PrivateUser = () => {
    const location = useLocation()
    const userData = localStorage.getItem('userData');
    let user;
    if (typeof userData === 'string') {
        user = JSON.parse(userData)
    }
  return (
    <>
    {
        user?.token ? <Outlet/> : <Navigate to={'/loginpg'}  state={{from:location}} replace  />
    }
    
    </>
  )
}

export default PrivateUser