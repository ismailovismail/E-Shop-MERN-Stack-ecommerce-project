import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import Spinner from '../components/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faS, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { prices } from '../data/prices'
import { Radio, Checkbox } from 'antd'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/cart'
import { toast } from 'react-toastify'
const Home = () => {
  library.add(faS, faShoppingCart, faEye, faCheck)
  const img = require('../assets/images/ecommerce-2.jpg')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadedProducts, setLoadedProducts] = useState<object[]>([])
  const [loadedCategories, setLoadedCategories] = useState<object[]>([])
  const [checkedProducts, setCheckedProducts] = useState<object[]>([])
  const [radio, setRadio] = useState<object[]>([])
  const [error, setError] = useState<string>()
  const [isFiltering, setIsFiltering] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const { addToProduct, cartItems } = useContext(CartContext)
  const getAllCategories = async () => {

    try {
      const response = await axios.get('http://localhost:5000/api/category/all-categories')
      if (response.status === 200) {
        setLoadedCategories(response?.data)
      }
    } catch (error: any) {
      setError(error?.response?.data?.message)
    }

  }

  useEffect(() => {
    getAllCategories()
    getTotal()
    getAllProducts()
  }, [])

  const getAllProducts = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:5000/api/product/product-list/${page}`)
      if (response.status === 200) {
        setIsLoading(false)
        setLoadedProducts(response?.data)


      }
    } catch (error: any) {
      setIsLoading(false)
      setError(error?.response?.data?.message)
    }
  }



  const getTotal = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product/product-count')
      setTotal(response?.data)

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    if (page === 1) return
    loadMore()
  }, [page])


  const loadMore = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:5000/api/product/product-list/${page}`)
      setIsLoading(false)
      setLoadedProducts([...loadedProducts, ...response?.data])
    } catch (error) {
      console.log(error);
      setIsLoading(false)

    }
  }



  const handleFilter = (checked: any, id: any) => {

    let all = [...checkedProducts]
    if (checked) {
      all.push(id)

    } else {
      all = all.filter((item: any) => item !== id)
    }
    setCheckedProducts(all)


  }



  useEffect(() => {
    if (checkedProducts.length || radio.length) {
      filterProducts()
      setPage(1)
    } else {
      getAllProducts()
    }
  }, [checkedProducts, radio])


  const filterProducts = async () => {
    setIsFiltering(true)
    try {
      const data: any = { checkedProducts, radio }
      const response = await axios.post('http://localhost:5000/api/product/filter-product', data)
      if (response?.status === 200) {
        setLoadedProducts(response?.data)
        setError('')
      }
    } catch (error: any) {
      setError(error?.response?.data)

    }
    setIsFiltering(false)


  }







  return (
    <>
      <Helmet>
        <title>E-Shop</title>
      </Helmet>
      <section style={{ minHeight: '70vh' }} className="home">
        <div className="main-image">
          <img className='main-home-img' src={img} alt="" />
        </div>
        <div className="products-filter">
          <div className="container-fluid">

            <div className=" filtering-component row p-3">
              <div className="filtering-part col-xl-3">
                <h1 className='fs-4' >Filter By Categories</h1>
                <div className="categories ">
                  {
                    loadedCategories?.map((item: any) => {
                      return <div key={item?._id} className="category d-flex gap-2">
                        <Checkbox className='fs-4 fw-light' onChange={(e: any) => handleFilter(e.target.checked, item?._id)}>
                          {item?.name}
                        </Checkbox>
                      </div>
                    })
                  }
                </div>
                <h1 className='fs-4 my-3'>Filter By Prices</h1>
                <div className="prices">

                  <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                    {
                      prices?.map((item: any) => {
                        return <div className="price-radio d-flex gap-2">
                          <div key={item._id} className="radio">
                            <Radio value={item?.array} className='fs-4 fw-light' >{item.name}</Radio>
                          </div>
                        </div>
                      })
                    }
                  </Radio.Group>
                </div>
                <button className='btn btn-outline-danger text-danger bg-white my-3' onClick={() => {
                  window.location.reload()

                }}  >Reset Filter</button>
              </div>
              <div className="all-products d-flex justify-content-center align-items-center col-xl-9">
                <div className="products d-flex align-items-center justify-content-center">
                  <div className="row d-flex justify-content-center align-items-center gap-4">
                    {
                      isLoading && <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center ">
                        <Spinner />
                      </div>
                    }
                    {
                      isFiltering && <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center ">
                        <Spinner />
                      </div>
                    }

                    {
                      error && <div style={{ minHeight: '70vh' }} className="error text-danger d-flex align-items-center justify-content-center ">
                        {error}
                      </div>
                    }

                    {
                      !error && !isFiltering && !isLoading && loadedProducts?.map((item: any) => {
                        return <div key={item?._id} className="card border-0  col-xl-3" style={{ width: "16rem" }} >
                          <img src={`http://localhost:5000/images/${item?.photo}`} className='img-fluid card-img-top' alt="" />
                          <div className="card-body p-0">
                            <h1 className="card-title fs-6">{item?.name}</h1>
                            <p className='card-text'>Category: {item?.category?.name}</p>
                            <p className='card-text lh-0'>{item?.price} $</p>
                            <div className="buttons d-flex my-2 gap-2">
                              {
                                cartItems.find((product: any) => product?._id === item?._id) ? <button disabled className='btn btn-outline-dark'> <FontAwesomeIcon icon={['fas', 'check']} /> </button> : <button className='btn btn-outline-dark' onClick={() => addToProduct(item,1)} >Add <FontAwesomeIcon icon={['fas', 'shopping-cart']} /> </button>
                              }
                              <Link to={`/single-product/${item?.slug}`} className='btn btn-outline-dark'>View Details <FontAwesomeIcon icon={['fas', 'eye']} /></Link>
                            </div>
                          </div>
                        </div>
                      })
                    }
                    {
                      loadedProducts && loadedProducts.length < total && checkedProducts.length === 0 && radio.length === 0 && (
                        <div className="center d-flex justify-content-center ">
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setPage(page + 1)
                          }} className='btn btn-outline-dark'>
                            Load More
                          </button>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

    </>
  )
}

export default Home