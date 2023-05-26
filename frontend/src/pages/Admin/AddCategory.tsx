import axios from 'axios'
import React, { useContext, useState } from 'react'
import AuthContext from '../../context/auth'
import { useNavigate } from 'react-router-dom'
import CategoryForm from '../../components/CategoryForm'

const AddCategory = () => {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const handleSubmit = async (data:any) => {
  
    setIsSubmitting(true)
    try {
      const config = {
        headers: {
          "Authorization": authContext?.token
        }
      }

      const response = await axios.post('http://localhost:5000/api/category/create-category', data, config)
      if (response?.data?.success) {
        setSuccess(response?.data?.message)
        setError('')
        setTimeout(() => {
           navigate('/dashboard/categories')
        }, 1000);
      }

    } catch (error: any) {
      setError(error?.response?.data?.message)
    }
    setIsSubmitting(false)

  }
  return (
    <>
      <section style={{ minHeight: '70vh' }} className="add-category d-flex justify-content-center align-items-center ">
        <div className="container-fluid row d-flex justify-content-center">
        <CategoryForm btnTitle={'Add Category'} title={'Add Category'} formSubmit = {(data:any)=>handleSubmit(data)} error={error} success={success} isSubmitting={isSubmitting} />
        </div>
      </section>
    </>
  )
}

export default AddCategory