import React, { useCallback, useContext, useEffect, useState } from 'react'
import CategoryForm from '../../components/CategoryForm'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../../components/Spinner'
import AuthContext from '../../context/auth'

const EditCategory = () => {
    const { slug } = useParams()
    const [category, setCategory] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [id, setId] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()
    const getSingleCategory = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:5000/api/category/single-category/${slug}`)
            if (response?.status === 200) {

                if (typeof response?.data === 'object') {
                    setCategory(response?.data)
                }
                if (typeof response?.data?._id === 'string') {
                    setId(response?.data?._id)
                }


            }
        } catch (error: any) {
            console.log(error?.response?.data?.message);

        }
        setLoading(false)
    }, [slug])
    useEffect(() => {
        getSingleCategory()
    }, [getSingleCategory])

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext?.token
                }
            }
            const response = await axios.put(`http://localhost:5000/api/category/update-category/${id}`, data, config)
            if (response?.data?.success) {
                setSuccess(response?.data?.message)
                setTimeout(() => {
                    navigate('/dashboard/categories')
                }, 1000);
            }

        } catch (error: any) {
            setError(error?.response?.data?.message)
        }
        setIsSubmitting(false)
    }

    const deleteCategory = async () => {
        setIsDeleting(true)
        try {
          const config = {
            headers:{
                "Authorization":authContext?.token
            }
          }

           const response = await axios.delete(`http://localhost:5000/api/category/delete-category/${id}`,config)
           
             if (response?.data?.success) {
                setSuccess(response?.data?.message)
                navigate('/dashboard/categories')
             }

        } catch (error:any) {
              setError(error?.response?.data?.message)
        }
        setIsDeleting(false)
    }

    if (loading) {
        return <div style={{ minHeight: '70vh' }} className="loading d-flex align-items-center justify-content-center">
            <Spinner />
        </div>
    }
    return (
        <>
            <section style={{ minHeight: '70vh' }} className="edit-category d-flex justify-content-center align-items-center">
                <div className="container-fluid row d-flex justify-content-center">
                    <CategoryForm isDeleting={isDeleting} onDelete={() => deleteCategory} btnTitle={'Update Category'} title={'Update Category'} editCategory={category} formSubmit={(data: any) => handleSubmit(data)} loading={loading} isSubmitting={isSubmitting} success={success} error={error} />
                </div>
            </section>
        </>
    )
}

export default EditCategory