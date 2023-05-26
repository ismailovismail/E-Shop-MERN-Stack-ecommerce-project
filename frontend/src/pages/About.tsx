import React from 'react'
import { Helmet } from 'react-helmet'
const About = () => {
  const aboutImg = require('../assets/images/about.webp')
  return (
    <>
      <Helmet>
        <title>About</title>
      </Helmet>
      <section style={{ minHeight: "110vh" }} className="about d-flex align-items-center ">
        <div className="container-fluid">
          <div className="about-part row d-flex align-items-center gap-3">
            <div className="image col-10 col-sm-7 col-md-6 col-xl-6 ">
              <img className='img-fluid' src={aboutImg} alt="" />
            </div>
            <div className="info col-md-5 col-xl-5">
              <h1>About us</h1>
              <p>
                Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet conse ctetur adipisicing elit.
              </p>
            </div>
          </div>
        </div>

      </section>


    </>
  )
}

export default About