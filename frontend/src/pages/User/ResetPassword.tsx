import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import AuthContext from '../../context/auth'
import { Helmet } from 'react-helmet'
const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const [success, setSuccess] = useState<any>(null)
  const [password, setPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const authContext = useContext(AuthContext)
  const existPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const changePassword = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const config = {
        headers: {
          "Authorization": authContext?.token
        }
      }
      const data = { password, newPassword }
      const response = await axios.post(`http://localhost:5000/api/auth/change-pwd/${authContext?.user?.id}`, data, config)
      if (response?.data?.success) {
        setSuccess(response?.data?.message)
        setError(null)
        setTimeout(() => {
          setSuccess(null)
        }, 5000);
        existPasswordRef.current?.classList.remove('is-invalid')
        newPasswordRef.current?.classList.remove('is-invalid')
      }
    } catch (error: any) {
      if (error?.response?.data?.message === 'Exist Password is not allowed to be empty') {
        existPasswordRef.current?.classList.add('is-invalid')
        existPasswordRef.current?.focus()
        newPasswordRef.current?.classList.remove('is-invalid')
        setError(error?.response?.data?.message)
      } else if (error?.response?.data?.message === 'New Password is not allowed to be empty') {
        existPasswordRef.current?.classList.remove('is-invalid')
        newPasswordRef.current?.classList.add('is-invalid')
        newPasswordRef.current?.focus()
        setError(error?.response?.data?.message)
      } else {
        existPasswordRef.current?.classList.remove('is-invalid')
        newPasswordRef.current?.classList.remove('is-invalid')
        setError(error?.response?.data?.message)
      }
    }
    setIsSubmitting(false)
  }
  return (
    <>
    <Helmet>
      <title>E-Shop | Change Password </title>
    </Helmet>
      <section className="change-pwd">
        <h1 className='fs-4 text-center'>Change Password</h1>
        <div className="pwd-form row d-flex justify-content-center ">
          <form onSubmit={changePassword} className='d-flex p-2 gap-2 flex-column col-xl-12'>
            <input ref={existPasswordRef} type="password" autoFocus onChange={(e) => setPassword(e.target.value)} placeholder='Exist Password' className='form-control' />
            <input ref={newPasswordRef} type="password" placeholder='New Password' onChange={(e) => setNewPassword(e.target.value)} className='form-control' />
            <button disabled={isSubmitting} className='btn btn-primary'>{isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Change Password'}</button>
            {error && <p className='alert alert-danger'>{error}</p>}
            {success && <p className='alert alert-success'>{success}</p>}
          </form>
        </div>
      </section>
    </>
  )
}

export default ResetPassword