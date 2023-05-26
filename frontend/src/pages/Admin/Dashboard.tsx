import React, { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faS, faUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import { useAppDispatch, useAppSelector } from '../../store/Hooks'
import { getProductListAction } from '../../store/ProductSlice'
import { RootState } from '../../store/store'
const Dashboard = () => {
  const authContext = useContext(AuthContext)
  library.add(faS, faUser)
  const [users, setUsers] = useState<object[]>([])
  const [categoeries, setCategories] = useState<object[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const products:any = useAppSelector((state: RootState) => state.product)
  const getUsers = useCallback(async () => {
    const config = {
      headers: {
        'Authorization': authContext?.token
      }
    }
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', config)
      setUsers(response?.data)
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    }
    setLoading(false)
  }, [authContext?.token])
  const getCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5000/api/category/all-categories')
      if (response?.status === 200) {
        setCategories(response?.data)
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);

    }
    setLoading(false)
  }, [])
  const getProductList = useCallback(()=>{
    dispatch(getProductListAction())

  },[dispatch])
  useEffect(() => {
    getUsers()
    getCategories()
    getProductList()
  }, [getUsers, getCategories, getProductList])

  return (
    <>
      <Helmet>
        <title>E-Shop | Admin</title>
      </Helmet>
      <section style={{ minHeight: '100vh' }} className="dashboard d-flex justify-content-center  align-items-center">
        <div className="container-fluid ">
          <div className="admin-panel d-flex justify-content-center gap-5 row">
            <div className="admin-details d-flex gap-3 col-xl-4">
              <div className="details col-xl-8">
                <h1>Admin Panel</h1>
                <ul>
                  <li>
                    Name: {authContext?.user?.name}
                  </li>
                  <li>
                    Email: {authContext?.user?.email}
                  </li>
                  <li>
                    Phone: {authContext?.user?.phone}
                  </li>
                  <li>
                    Role: {authContext?.user?.role}
                  </li>
                </ul>
              </div>
              <div className="user-icon col-xl-4 d-flex justify-content-center align-items-center">
                <FontAwesomeIcon style={{ fontSize: "30px" }} icon={['fas', 'user']} />
              </div>
            </div>
            <div className="cruds col-xl-6 d-flex justify-content-center gap-2 align-items-center p-2">
             <div className="products- d-flex flex-column gap-2">
             <Link to={'/dashboard/users'} className='fw-bold px-3 py-0 btn btn-outline-dark fs-3 text-decoration-none'>Users {
                loading ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : users?.length
              } </Link>
              <Link to={'/dashboard/products'} className='px-3 py-0 fw-bold btn btn-outline-dark fs-3  text-decoration-none'>Products {

                products.status === 'pending' ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : products.products.length

              }</Link>
             </div>
             <div className="orders-categories d-flex flex-column gap-2">
             <Link to={'/dashboard/categories'} className='px-3 py-0 fw-bold btn btn-outline-dark fs-3 text-decoration-none'>Categories {
                loading ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : categoeries?.length
              } </Link>
              <Link to={'/dashboard/orders'} className='px-3 py-0 fw-bold fs-3 text-decoration-none btn btn-outline-dark'>
                Orders
              </Link>
             </div>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}

export default Dashboard