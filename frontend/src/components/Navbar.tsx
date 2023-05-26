import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faS, faUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import AuthContext from '../context/auth'
import axios from 'axios'
import SearchInput from './SearchInput'
import useCategory from '../hooks/useCategory'
import { CartContext } from '../context/cart'

library.add(faS, faUser)
const Navbar = () => {
    const navigate = useNavigate()
    const navImg = require('../assets/images/eshop.webp')
    const authContext = useContext(AuthContext)
    const [name, setName] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { categories } = useCategory()
    const { cartItems, setCartItems } = useContext(CartContext)

    const getUserName = useCallback(async () => {
        const config = {
            headers: {
                "Authorization": authContext?.token
            }
        }
        setIsLoading(true)
        try {
            const response = await axios.get(`http://localhost:5000/api/auth/users/${authContext?.user?.id}`, config)
            if (response?.status === 200) {
                setName(response?.data?.name)
            }
        } catch (error: any) {
            console.log(error?.response?.data?.message);

        }
        setIsLoading(false)
    }, [authContext?.user?.id, authContext?.token])

    useEffect(() => {
        getUserName()
    }, [getUserName, authContext?.token])

    return (
        <>
            <nav className="navbar bg-white  navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link to={'/'}>
                        <img width={70} src={navImg} alt="" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto  mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to={'/'} end className={'nav-link'} >Home</NavLink>
                            </li>
                            <li className='nav-ityem'>
                                <li className="nav-item dropdown">
                                    <Link to={'#'} className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Categories
                                    </Link>
                                    <ul className="dropdown-menu">
                                        {
                                            categories?.map((item: any) => {
                                                return <li>
                                                    <Link to={`/categories/${item?.slug}`} className='dropdown-item'>{item?.name} </Link>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </li>

                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={'/register'} >Register</NavLink>
                            </li>
                            {
                                !authContext.loggedIn && <li className='nav-item'>
                                    <NavLink to={'/loginpg'} className={'nav-link'}>Login</NavLink>
                                </li>
                            }
                            <li className='nav-item'>
                                <NavLink to={'/cart'} className={'nav-link'}>Cart ({cartItems.length})</NavLink>
                            </li>
                        </ul>
                        {
                            authContext?.loggedIn && <div className="dropdown my-2 mx-2">
                                <button className="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon icon={['fas', 'user']} /> {isLoading ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : name}
                                </button>
                                <ul className="dropdown-menu">

                                    <li>
                                        {
                                            authContext?.user?.role === 1 && <Link to={'/dashboard/admin'} className='dropdown-item'>Admin</Link>
                                        }
                                    </li>
                                    <li>
                                        {
                                            authContext?.token && <Link to={'/dashboard/user'} className='dropdown-item' >Profile</Link>
                                        }
                                    </li>
                                    <li>
                                        {
                                            authContext?.token && <Link to={'/dashboard/user-edit/edit-profile'} className='dropdown-item'>Edit Profile</Link>
                                        }
                                    </li>
                                    <li><button onClick={() => {
                                        if (window.confirm('Are you sure?') === true) {
                                            authContext.logout()
                                            navigate('/loginpg')
                                            setCartItems([])

                                        }
                                    }} className="dropdown-item">Logout</button></li>
                                </ul>
                            </div>

                        }

                        <SearchInput />

                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar