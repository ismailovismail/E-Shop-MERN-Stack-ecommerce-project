import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>
          Not Found
        </title>
      </Helmet>
      <section style={{ minHeight: '70vh' }} className="notfound d-flex align-items-center justify-content-center flex-column">
        <h1 className='fs-1 fw-bold text-center'>404</h1>
        <p className='fs-1'>Oops ! Page Not Found</p>
        <Link className='btn btn-outline-dark' to='/'>Go Back</Link>
      </section>
    </>
  )
}

export default NotFound