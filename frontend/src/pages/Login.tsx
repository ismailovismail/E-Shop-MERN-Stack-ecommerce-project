import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import AuthContext from '../context/auth'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = { email, password }
      const response = await axios.post('http://localhost:5000/api/auth/login', data)
      if (response?.data?.success) {
        console.log(response?.data);
        emailRef.current?.classList.remove('is-invalid')
        passwordRef.current?.classList.remove('is-invalid')
        setError(null)
        authContext?.login(response?.data?.user, response?.data?.token)
        navigate('/')
      } else {
        throw new Error(response?.data?.message)
      }
    } catch (error: any) {
      if (error?.response?.data?.message === "\"email\" is not allowed to be empty" || error?.response?.data?.message === "\"email\" must be a valid email") {
        emailRef.current?.classList.add('is-invalid')
        emailRef.current?.focus()
        setError(error?.response?.data?.message)
      } else if (error?.response?.data?.message === "\"password\" is not allowed to be empty") {
        passwordRef.current?.classList.add('is-invalid')
        passwordRef.current?.focus()
        emailRef.current?.classList.remove('is-invalid')
        setError(error?.response?.data?.message)
      } else {
        emailRef.current?.classList.add('is-invalid')
        passwordRef.current?.classList.add('is-invalid')
        passwordRef.current?.focus()
        emailRef.current?.focus()
        setError(error?.response?.data?.message)
      }

    }
    setIsSubmitting(false)
  }
  return (
    <>
      <Helmet>
        <title>
          Login
        </title>
      </Helmet>
      <section style={{ minHeight: '70vh' }} className="login d-flex justify-content-center align-items-center ">
        <div className="container-fluid row d-flex justify-content-center">
          <div className="login-part p-2 bg-white rounded col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 ">
            <h1 className='text-center fw-bold'>Login</h1>
            <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
              <input type="text" value={email} ref={emailRef} onChange={(e) => setEmail(e.target.value)} autoFocus placeholder='Email' className={`form-control`} />
              <input type="password" value={password} ref={passwordRef} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className={`form-control`} />
              <button className='btn btn-primary' disabled={isSubmitting} type='submit'>{isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Login'}</button>
              {error && <p className='alert alert-danger'>{error}</p>}
            </form>
            <div className="forgot-btn d-flex justify-content-center">
              <Link to={'/forgotpwd'} className='text-dark' >Forgot password?</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login