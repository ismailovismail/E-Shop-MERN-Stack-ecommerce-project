import axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/auth'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
const Users = () => {
    const authContext = useContext(AuthContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<object[]>([])
    const getAllUsers = useCallback(async () => {
        setLoading(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext.token
                }
            }
            const response = await axios.get('http://localhost:5000/api/auth/users', config)
            setData(response?.data)
          console.log(response?.data);
          
        } catch (error) {
            console.log(error);

        }
        setLoading(false)

    }, [authContext.token])

    useEffect(() => {
        getAllUsers()
    }, [authContext?.token, getAllUsers])

    if (loading) {
        return <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center">
            <Spinner />
        </div>
    }

    return (
        <>

        <Helmet>
            <title>
                E-Shop | Users
            </title>
        </Helmet>
            <section style={{ minHeight: '70vh' }} className="users d-flex py-4">
                <div className="container-fluid">
                    <h1 className='text-center'>Users</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ID</th>
                                <th scope="col">Email</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((item: any, i: number) => {
                                    return <tr key={i} >
                                        <th scope="row">{i + 1}</th>
                                        <td>{item?._id.slice(0,5)}...</td>
                                        <td>{item?.email}</td>
                                        <td>
                                            <Link to={`/dashboard/users/${item?._id}`} className='btn btn-primary'>Edit</Link>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>


                </div>
            </section>
        </>
    )
}

export default Users