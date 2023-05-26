import axios from 'axios'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/Hooks'
import { createProductAction } from '../../store/ProductSlice'
import { RootState } from '../../store/store'
import AuthContext from '../../context/auth'
import { useNavigate } from 'react-router-dom'


const AddProduct = () => {
    interface ProductTypes {
        name: string,
        category: string,
        price: number,
        stockCount: number,
        description: string,
        photo: any,
        shipping: boolean
    }
    const [product, setProduct] = useState<ProductTypes>({
        name: '',
        category: '',
        price: 0,
        stockCount: 0,
        description: '',
        photo: '',
        shipping: false

    })
    const [categories, setCategories] = useState<object[]>([])
    const [previousUrl, setPreviousUrl] = useState<any>(null)
    const [success,setSucces] = useState<string>('')
    const [error, setError] = useState<string>('')
    const dispatch: any = useAppDispatch()
    const token: any = useContext(AuthContext)?.token
    const products:any = useAppSelector((state: RootState) => state?.product)
    const nameRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const getAllCategories = useCallback(async () => {

        try {
            const response = await axios.get('http://localhost:5000/api/category/all-categories')
            if (response?.status === 200) {
                setCategories(response?.data)
            }

        } catch (error: any) {
            console.log(error?.response?.data?.message);

        }

    }, [])

    useEffect(() => {
        getAllCategories()
        console.log(product);
        
        if (!product.photo) {
            return
        }

        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviousUrl(fileReader.result)
        }
        fileReader.readAsDataURL(product.photo)

      

    }, [getAllCategories, product.photo,product])

    const handleChange = (e: React.ChangeEvent<any>) => {
        setProduct({ ...product, [e.target.name]: e.target.value })

    }
    const handlePhoto = (e: React.ChangeEvent<any>) => {
        if (e.target.files && e.target.files.length === 1) {
            setProduct({ ...product, photo: e.target.files[0] })
        }else {
            setProduct({...product,photo:''})
        }
    }

    const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: parseInt(e.target.value) })
    }


    const handleShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.checked })
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        
        e.preventDefault()
        try {
            const name = product.name
            const description = product.description
            const price = product.price
            const stockCount = product.stockCount
            const photo = product.photo
            const shipping = product.shipping
            const category = product.category
            const data = { name, description, price, stockCount, photo, shipping, category, token }
    
          const response = await  dispatch(createProductAction(data))
           console.log(response);
           
          
          
         
          if (response.meta.requestStatus === 'fulfilled'){
            setSucces(response?.payload)
            setTimeout(() => {
                navigate('/dashboard/products')
            }, 3000);
            setError('')
          }else {
            setError(response?.payload)
          }
           
           
        } catch (error) {
            console.log(error);
            
        }
  



    }



    return (
        <>
            <section style={{ minHeight: "120vh" }} className="add-product d-flex align-items-center">
                <div className="container-fluid row d-flex justify-content-center">
                    <div className="add-product-form bg-white rounded col-xl-4">
                        <h1 className='text-center'>Add Product</h1>
                        <form onSubmit={(e)=>{
                            handleSubmit(e)
                        }} className='d-flex p-2 flex-column gap-2'>
                            <label htmlFor="">Upload Image</label>
                            <div className="image-upload d-flex gap-2">
                                <input type="file" name='photo' accept='.png, .jpg, .jpeg' onChange={handlePhoto} className={`uploader ${error.includes('photo') ? 'is-invalid' : '' }  form-control `} />
                                {
                                  product.photo && previousUrl ? <img width={50} src={previousUrl} alt="" /> : null 
                                }
                            </div>
                            <label htmlFor="">Name</label>
                            <input type="text" ref={nameRef} value={product?.name} name='name' onChange={handleChange} placeholder='Name' className={` ${error.includes('name') ? 'is-invalid' : ''} form-control`} />
                            <label htmlFor="">Select Category</label>
                            <select name="category" onChange={handleChange} value={product?.category} className={` ${error.includes('category') ? 'is-invalid' : '' } form-control`} id="">
                                <option value="">- Select Category</option>
                                {
                                    categories.map((item: any) => {
                                        return <option key={item?._id} id={item?._id} value={item?._id}>{item?.name}</option>
                                    })
                                }
                            </select>
                            <label htmlFor="">Price $</label>
                            <input type="number" value={product?.price} name='price' min={0} onChange={handleNumber} placeholder='Price' className='form-control' />
                            <label htmlFor="">Stock Count</label>
                            <input type="number" name='stockCount' value={product?.stockCount} min={0} onChange={handleNumber} placeholder='Stock Count' className='form-control' />
                            <label htmlFor="">Description</label>
                            <textarea name="description" value={product?.description} onChange={handleChange} placeholder='Description' className={`${error.includes('description') ? 'is-invalid' : '' }  form-control`} ></textarea>
                            <div className="shipping d-flex gap-2">
                                <label htmlFor="">Select shipping</label>
                                <input type="checkbox" checked={product?.shipping} name='shipping' onChange={handleShipping} id="" />
                            </div>
                            <button disabled={products?.isSubmitting === 'true'} type='submit' className='btn btn-primary'>{
                                products?.isSubmitting === 'true' ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Add Product'
                            }</button>
                            {
                                success && <p className='text-success' >{success}</p>
                            }
                            {
                                error && <p className='text-danger' >{error}</p>
                            }
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddProduct