import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas, faEnvelope, faPhoneVolume, faHeadphones } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import { Helmet } from 'react-helmet';
const Contact = () => {
    const contactImg = require('../assets/images/contect.jpg')
    library.add(fas, faEnvelope, faPhoneVolume, faHeadphones)
    return (
        <>
            <Helmet>
                <title>Contact</title>
            </Helmet>

            <section style={{ minHeight: '90vh' }} className="contact d-flex align-items-center">
                <div className="container-fluid ">
                    <div className="contact-part row d-flex gap-2">
                        <div className="image col-md-6 col-xl-6">
                            <img src={contactImg} alt="" />
                        </div>
                        <div className="info-part col-md-5 col-xl-5">
                            <h1 className='bg-dark text-white text-center'>Contact us</h1>
                            <p>any query info about product feel free to call anytime we 24/7 available</p>
                            <div className="contact-list">
                                <ul className='list d-flex flex-column gap-2 '>
                                    <li>
                                        <FontAwesomeIcon icon={['fas', 'envelope']} /> : www.help@e-shop.com
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={['fas', 'phone-volume']} /> : 012-345-67-89
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={['fas', 'headphones']} /> : 1800-0000-0000 (tool free)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Contact