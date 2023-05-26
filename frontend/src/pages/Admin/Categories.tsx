import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faS, faPlus } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import axios from 'axios'
const Categories = () => {
    library.add(faS, faPlus)
    const navigate = useNavigate()
    const [categoeries, setCategories] = useState<object[]>([])
    const [loading,setLoading] = useState<boolean>(false)
    const getCategories = useCallback( async () => {
        setLoading(true)
        try {
            const response = await axios.get('http://localhost:5000/api/category/all-categories')
            if (response?.status === 200) {
                setCategories(response?.data)
            }
        } catch (error:any) {
            console.log(error?.response?.data?.message);
            
        }
        setLoading(false)
    },[])

    useEffect(()=>{
        getCategories()
    },[getCategories])

    if (loading) {
        return <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center">
            <Spinner />
        </div>
    }

    return (
        <>
            <Helmet>
                <title>E-Shop | Categories </title>
            </Helmet>
            <section style={{ minHeight: '70vh' }} className="category-list py-4">
                <div className="container-fluid">
                    <h1 className='text-center'>Categories <button onClick={() => {
                        navigate('/dashboard/add-category')
                    }} className='btn btn-outline-dark'>Add <FontAwesomeIcon icon={['fas', 'plus']} /></button> </h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                               {
                                categoeries?.map((item:any,i:number)=>{
                                    return <tr>
                                        <th key={i} scope='row'>{i+1}</th>
                                        <td>{item?._id.slice(0,5)}...</td>
                                        <td>{item?.name}</td>
                                        <td>
                                            <Link className='btn btn-primary' to={`/dashboard/categories/${item?.slug}`}>Edit</Link>
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

export default Categories