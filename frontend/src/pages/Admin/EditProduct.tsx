import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/Hooks'
import { RootState } from '../../store/store'
import { getSingleProductAction } from '../../store/ProductSlice'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import axios from 'axios'
import AuthContext from '../../context/auth'
const EditProduct = () => {
    const dispatch = useAppDispatch()
    const { slug } = useParams()
    const [name, setName] = useState<string>('')
    const [photo, setPhoto] = useState<any>(null)
    const [category, setCategory] = useState<any>(null)
    const [categories, setCategories] = useState<object[]>([])
    const [price, setPrice] = useState<any>(1)
    const [stockCount, setStockCount] = useState<any>(1)
    const [description, setDescription] = useState<string>('')
    const [shipping, setShipping] = useState<any>(false)
    const [previousUrl, setPreviousUrl] = useState<any>(null)
    const [selectedImg, setSelectedImg] = useState<any>(null)
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const authContext = useContext(AuthContext)
    const uploadRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const getSingleProduct = useCallback(async () => {

        const res: any = await dispatch(getSingleProductAction(slug))
        setName(res?.payload?.name)
        setPhoto(res?.payload?.photo)
        setCategory(res?.payload?.category?._id)
        setPrice(res?.payload?.price)
        setStockCount(res?.payload?.stockCount)
        setDescription(res?.payload?.description)
        setShipping(res?.payload?.shipping)
        setId(res?.payload?._id)
    }, [dispatch, slug])

    const getAllCategories = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/category/all-categories')
            if (response?.status === 200) {
                setCategories(response?.data)
            }
        } catch (error: any) {
            setError(error?.response?.data?.message)

        }
    }, [])

    useEffect(() => {
        getSingleProduct()
        getAllCategories()
        if (!selectedImg) {
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviousUrl(fileReader.result)
        }
        fileReader.readAsDataURL(selectedImg)

    }, [getSingleProduct, getAllCategories, selectedImg])

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext?.token,
                    "Content-Type": "multipart/form-data"
                }
            }
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('photo', selectedImg ? selectedImg : photo)
            formData.append('price', price)
            formData.append('category', category)
            formData.append('stockCount', stockCount)
            formData.append('shipping', shipping)


            const response = await axios.put(`http://localhost:5000/api/product/update-product/${id}`, formData, config)
            if (response?.data?.success) {
                setSuccess(response?.data?.message)
                setTimeout(() => {
                    navigate('/dashboard/products')
                }, 3000);
                setError('')
            }
        } catch (error: any) {
            setError(error?.response?.data?.message)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const config = {
                headers:{
                    "Authorization":authContext?.token
                }
            }
            const response = await axios.delete(`http://localhost:5000/api/product/delete-product/${id}`,config)
            if (response?.data?.success) {
                setSuccess(response?.data?.message)
                navigate("/dashboard/products")
                setError('')
            }
        } catch (error: any) {
            setError(error?.response?.data?.message)
        }
        setIsDeleting(false)
    }

    const status: any = useAppSelector((state: RootState) => state?.product?.status)
    if (status === 'pending') {
        return <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center">
            <Spinner />
        </div>
    }

    return (
        <>
            <section style={{ minHeight: "140vh" }} className="edit-product d-flex justify-content-center align-items-center">
                <div className="container-fluid row d-flex justify-content-center">
                    <div className="product-form p-2 bg-white rounded col-xl-4">
                        <form onSubmit={handleSubmit} className='d-flex flex-column p-2 gap-2 '>
                            <label htmlFor="">Photo</label>
                            <div className="image d-flex justify-content-center flex-column align-items-center">
                                {!previousUrl && photo === 'null' ? <p className='text-center'>Please pick on image</p> : ''}
                                <img width={100} src={previousUrl ? previousUrl : `http://localhost:5000/images/${photo}`} alt="" />
                            </div>
                            <input ref={uploadRef} type="file" onChange={(e: any) => {
                                if (e.target.files && e.target.files.length === 1) {
                                    setPhoto(e.target.files[0])
                                    setSelectedImg(e.target.files[0])

                                }
                            }} className='form-control' hidden />
                            <div className="image-options d-flex justify-content-center gap-2">
                                <button type='button' className='btn btn-outline-dark' onClick={(e) => {
                                    uploadRef.current?.click()

                                }} >Upload Image</button>
                                <button type='button' className='btn btn-outline-danger' onClick={(e) => {

                                    if (window.confirm('Delete photo?') === true) {
                                        setPhoto("null")
                                        setPreviousUrl(null)
                                    }
                                }} >Delete</button>
                            </div>
                            <label htmlFor="">Name</label>
                            <input type="text" className='form-control' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder='Name' name='name' />
                            <label htmlFor="">Select Category</label>
                            <select name="" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)} className='form-control' value={category} id="">
                                {
                                    categories?.map((item: any) => {
                                        return <option key={item?._id} value={item?._id}>{item?.name}</option>
                                    })
                                }
                            </select>
                            <label htmlFor="">Price $</label>
                            <input type="number" value={price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(parseInt(e.target.value))} className='form-control' />
                            <label htmlFor="">Stock Count</label>
                            <input type="number" value={stockCount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStockCount(parseInt(e.target.value))} className='form-control' />
                            <label htmlFor="">Description</label>
                            <textarea name="" id="" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} className='form-control'></textarea>
                            <div className="select-shipping d-flex gap-2">
                                <label htmlFor="">Select Shipping</label>
                                <input onChange={(e) => setShipping(e.target.checked)} type="checkbox" checked={shipping} />
                            </div>
                            <button type='submit' disabled={isSubmitting} className='btn btn-primary'>{isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Update Product'}</button>
                            <button type='button' className='btn btn-danger' disabled={isDeleting} onClick={handleDelete}  >Delete Product</button>
                            {
                                success && <p className='text-success'>{success}</p>
                            }
                            {
                                error && <p className='text-danger'>{error}</p>
                            }
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EditProduct