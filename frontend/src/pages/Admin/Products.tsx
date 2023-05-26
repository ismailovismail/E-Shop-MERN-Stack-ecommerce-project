import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/Hooks'
import { getProductListAction } from '../../store/ProductSlice'
import { RootState } from '../../store/store'
import { Link } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faS, faPlus } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
const Products = () => {
    library.add(faS,faPlus)
    const dispatch = useAppDispatch()
    const getProductList = useCallback(()=>{
        dispatch(getProductListAction())
    },[dispatch])
    useEffect(() => {
       getProductList()
    }, [getProductList])
    const products:any = useAppSelector((state: RootState) => state.product)
    if (products.status === 'pending') {
        return <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center">
            <Spinner />
        </div>
    }
    return (
        <>
            <section style={{ minHeight: '70vh' }} className='product-list py-4'>
                <div className="container-fluid">
                    <h1 className='text-center'>Products <Link to={'/dashboard/add-product'} className='btn btn-outline-dark' >Add <FontAwesomeIcon icon={['fas','plus']}/> </Link> </h1>
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

                                products?.products?.map((item: any, i: number) => {
                                    return <tr>
                                        <th key={i} scope='row'>{i + 1}</th>
                                        <td>{item?._id.slice(0, 5)}...</td>
                                        <td>{item?.name}</td>
                                        <td>
                                            <Link className='btn btn-primary' to={`/dashboard/products/${item?.slug}`}>Edit</Link>
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

export default Products