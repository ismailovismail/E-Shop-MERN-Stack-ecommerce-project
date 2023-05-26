import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
const EditProfile = () => {
  return (
    <>
    <Helmet>
      <title>E-Shop | Edit Profile </title>
    </Helmet>
    <section style={{minHeight:'80vh'}} className="edit-profile d-flex align-items-center justify-content-center">
        <div className="container-fluid ">
          <div className="edit p-5 row d-flex justify-content-center align-items-center gap-5">
            <div className="settings rounded py-3 col-xl-3 d-flex align-items-center flex-column justify-content-center bg-white">
                <h1 className='text-center'>Settings</h1>
                <ul className='d-flex p-0 flex-column align-items-center'>
                    <li>
                        <NavLink className='text-decoration-none' to={'/dashboard/user-edit/edit-profile'}>Edit Profile</NavLink>
                    </li>
                    <li>
                        <NavLink className='text-decoration-none ' to={'/dashboard/user-edit/reset-password'}>Change Password</NavLink>
                    </li>
                </ul>
            </div>
            <div className="edit-pages rounded col-xl-6 bg-white">
                <Outlet/>
            </div>
          </div> 
        </div>
    </section>
    </>
  )
}

export default EditProfile