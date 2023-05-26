import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <>
      <footer className='bg-dark'>
        <div className="author p-5 ">
          <h1 className='fs-3 text-white text-center'>All right reserved  &copy; Ismailov </h1>
          <div className="page-links d-flex justify-content-center">
            <ul className='links d-flex gap-2'>
              <li>
                <Link to={'/aboutpg'} >About</Link>
              </li>
              <li>
                <Link to={'/contacts'}>Contact</Link>
              </li>
              <li>
                <Link to={'#'}>Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer