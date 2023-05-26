import axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth'
import Spinner from '../../components/Spinner'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import moment from 'moment'
const User = () => {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const authContext = useContext(AuthContext)
    const [orders, setOrders] = useState<object[]>([])
    const [loadingOrders, setLoadingOrders] = useState<boolean>(false)

    const getUserInfo = useCallback(async () => {
        setIsLoading(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext?.token
                }
            }
            const response = await axios.get(`http://localhost:5000/api/auth/users/${authContext?.user?.id}`, config)
            if (typeof response?.data === 'object') {
                setData(response?.data)
            }

        } catch (error: any) {
            console.log(error?.response?.data?.message);

        }
        setIsLoading(false)

    }, [authContext?.user?.id, authContext?.token])
    const getOrders: any = useCallback(async () => {
        setLoadingOrders(true)
        try {
            const config = {
                headers: {
                    'Authorization': authContext?.token
                }
            }
            const response = await axios.get('http://localhost:5000/api/auth/orders', config)
            if (response.status === 200) {
                setOrders(response?.data)
            }
        } catch (error) {
            console.log(error);

        }
        setLoadingOrders(false)
    }, [authContext?.token])
    useEffect(() => {
        getUserInfo()
        getOrders()
    }, [authContext?.token, getUserInfo, getOrders])


    return (
        <>
            <Helmet>
                <title>
                    {`E-Shop | ${typeof data?.name === 'undefined' ? 'Loading...' : data?.name} `}
                </title>
            </Helmet>
            <section style={{ minHeight: '80vh' }} className="user d-flex align-items-center ">
                <div className="container-fluid">
                    <div className="profile row d-flex gap-5 p-5">
                        <div style={{ height: "fit-content" }} className="user-info rounded col-xl-4 bg-white d-flex flex-column p-2">
                            <h1 className='text-center'>User Informations</h1>
                            {isLoading && <div className="loading d-flex py-4 justify-content-center align-items-center ">
                                <Spinner />
                            </div>}
                            {
                                !isLoading && <ul>
                                    <li>Name: {data?.name}</li>
                                    <li>Email: {data?.email} </li>
                                    <li>Phone: {data?.phone} </li>
                                    <li>Address: {data?.address} </li>
                                </ul>

                            }
                            <Link to={'/dashboard/user-edit/edit-profile'} className='btn btn-primary' >Edit Informations </Link>
                        </div>
                        <div  className="order-list col-xl-7 rounded bg-white">
                            {
                                loadingOrders && <div style={{ minHeight: '40vh' }} className="loading-orders d-flex justify-content-center align-items-center ">
                                    <Spinner />
                                </div>
                            }
                            {!loadingOrders && <h1 className='text-center'>Orders</h1>}
                            <div className="list">
                                {
                                    orders?.length === 0 && !loadingOrders && <div style={{minHeight:'30vh'}} className='d-flex justify-content-center align-items-center'>
                                        <p className='text-center fs-3'>Order list empty</p>
                                    </div>
                                }
                                {
                                    !loadingOrders && orders?.map((item: any, i: number) => {
                                        return <><table className='table'>
                                            <thead>
                                                <tr>
                                                    <td scope='col'>#</td>
                                                    <td scope='col'>Status</td>
                                                    <td scope='col'>Buyer</td>
                                                    <td scope='col'>Date</td>
                                                    <td scope='col'>Payment</td>
                                                    <td scope='col'>Quantity</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>{i + 1}</th>
                                                    <th>{item?.status}</th>
                                                    <th>{item?.buyer?.name}</th>
                                                    <th>{moment(item?.creatAt).fromNow()}</th>
                                                    <th>{item?.payment?.success ? 'Success' : 'Failed'}</th>
                                                    <th>{item?.products?.length}</th>
                                                </tr>
                                            </tbody>
                                        </table><div className="container">
                                            </div>
                                            <div className="table-products d-flex flex-column justify-content-center">
                                                {
                                                    item?.products?.map((product: any) => {
                                                        return <div className="card border-0 mb-3" style={{ maxWidth: 540 }}>
                                                            <div className="row g-0">
                                                                <div className="col-md-4">
                                                                    <img src={`http://localhost:5000/images/${product?.photo}`} className="img-fluid rounded-start" alt="..." />
                                                                </div>
                                                                <div className="col-md-8">
                                                                    <div className="card-body">
                                                                        <h5 className="card-title">{product?.name}</h5>
                                                                        <p className='card-text'>{product?.description}</p>
                                                                        <p>Price:$ {product?.price} </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    })
                                                }
                                            </div>
                                        </>
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default User