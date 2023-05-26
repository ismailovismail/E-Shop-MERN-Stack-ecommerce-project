import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faS, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import Slider from 'react-slick'
import { CartContext } from '../context/cart'
const CategoryProduct = () => {
    library.add(faS, faShoppingCart, faEye,faCheck)
    const { slug } = useParams()
    const {addToProduct,cartItems} = useContext(CartContext)
    const [products, setProducts] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [category, setCategory] = useState<any>(null)
    const getProductByCategory: any = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`http://localhost:5000/api/category/product-category/${slug}`)
            if (response?.data?.success) {
                setProducts(response?.data?.products)
                setCategory(response?.data?.category)
            }
        } catch (error: any) {
            console.log(error);

        }
        setIsLoading(false)
    }, [slug])
    useEffect(() => {
        getProductByCategory()
    }, [getProductByCategory])
    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 4,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000
    };
    if (isLoading) {
        return <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center">
            <Spinner />
        </div>
    }
    return (
        <>

        <Helmet>
            <title>
                E-Shop | {slug?.toUpperCase()}
            </title>
        </Helmet>
            <section style={{ minHeight: '70vh' }} className="category-product">
                <div className="container-fluid py-5">
                    <h1 className='text-center fs-4'>{category?.name} ({products?.length}) </h1>
                    <div className="products row d-flex  gap-3">
                        <Slider  {...settings} >
                            {
                                products?.map((item: any) => {
                                    return <div className="card border-0" style={{ width: '22rem' }} >
                                        <div className="image d-flex justify-content-center ">
                                            <img style={{ width: '250px', height: '250px' }} src={`http://localhost:5000/images/${item?.photo}`} className='img-fluid card-img-top' alt="" />
                                        </div>
                                        <div className="card-body">
                                            <h1 className='card-title fs-5'>{item?.name}</h1>
                                            <p className='card-text my-0'>Category: {item?.category?.name}</p>
                                            <p className='card-text my-0'>$ {item?.price}</p>
                                            <div className="buttons d-flex my-2 gap-2">
                                                {
                                                    cartItems.find((product:any)=>product?._id === item._id) ? <button disabled className='btn btn-outline-dark'><FontAwesomeIcon icon={['fas','check']} /></button> : <button onClick={()=>addToProduct(item,1)} className='btn btn-outline-dark'>Add to cart <FontAwesomeIcon icon={['fas', 'shopping-cart']} /> </button>
                                                }
                                                <Link to={`/single-product/${item?.slug}`} className='btn btn-outline-dark'>View Details <FontAwesomeIcon icon={['fas', 'eye']} /> </Link>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CategoryProduct