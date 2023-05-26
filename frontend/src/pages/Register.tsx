import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/auth'
const Register = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const phoneRef = useRef<HTMLInputElement>(null)
    const addressRef = useRef<HTMLInputElement>(null)
    const answerRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const data = { name, email, password, phone, answer, address }
        setIsSubmitting(true)
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', data)
            if (response?.data?.success) {
                setMessage(response?.data?.message)
                setError('')
                setName('')
                setEmail('')
                setPassword('')
                setPhone('')
                setAddress('')
                setAnswer('')
                setTimeout(() => {
                    if (!authContext.token) {
                        navigate('/loginpg')
                    }
                }, 3000)
            } else {
                throw new Error(response?.data?.message)
            }

        } catch (error: any) {
            if (error?.response?.data?.message.includes('name')) {
                nameRef.current?.classList.add('is-invalid')
                nameRef.current?.focus()
                setError(error?.response?.data?.message)

            } else if (error?.response?.data?.message.includes('email')) {
                emailRef.current?.classList.add('is-invalid')
                emailRef.current?.focus()
                nameRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)

            } else if (error?.response?.data?.message.includes('password')) {
                passwordRef.current?.classList.add('is-invalid')
                passwordRef.current?.focus()
                emailRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)

            } else if (error?.response?.data?.message === "\"phone\" is not allowed to be empty") {
                phoneRef.current?.classList.add('is-invalid')
                phoneRef.current?.focus()
                passwordRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message === "\"address\" is not allowed to be empty") {
                addressRef.current?.classList.add('is-invalid')
                addressRef.current?.focus()
                phoneRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message === "\"answer\" is not allowed to be empty") {
                addressRef.current?.classList.remove('is-invalid')
                answerRef.current?.classList.add('is-invalid')
                answerRef.current?.focus()
            } else {
                setError(error?.response?.data?.message)
                nameRef.current?.classList.remove('is-invalid')
                emailRef.current?.classList.remove('is-invalid')
                passwordRef.current?.classList.remove('is-invalid')
                phoneRef.current?.classList.remove('is-invalid')
                addressRef.current?.classList.remove('is-invalid')
                answerRef.current?.classList.remove('is-invalid')
            }
        }
        setIsSubmitting(false)
    }
    return (
        <>
            <Helmet>
                <title>
                    Register
                </title>
            </Helmet>
            <section style={{ minHeight: '120vh' }} className="register d-flex justify-content-center align-items-center ">
                <div className="container-fluid row d-flex justify-content-center">
                    <div className="register-part p-2 row border bg-white col-10 col-md-7 col-xl-5 rounded">
                        <h1 className='text-center fw-bold'>Registration</h1>
                        <form onSubmit={handleSubmit} className='col-xl-12 d-flex flex-column gap-2'>
                            <label htmlFor="">Name</label>
                            <input type="text" value={name} autoFocus ref={nameRef} onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Name' />
                            <label htmlFor="">Email</label>
                            <input type="email" value={email} ref={emailRef} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Email' />
                            <label htmlFor="">Password</label>
                            <input type="password" value={password} ref={passwordRef} onChange={(e) => setPassword(e.target.value)} className='form-control' placeholder='Password' />
                            <label htmlFor="">Phone</label>
                            <input type="text" className='form-control' value={phone} ref={phoneRef} onChange={(e) => setPhone(e.target.value)} placeholder='Phone' />
                            <label htmlFor="">Address</label>
                            <input type="text" placeholder='Address' value={address} ref={addressRef} onChange={(e) => setAddress(e.target.value)} className='form-control' />
                            <label htmlFor="">Answer</label>
                            <input type="text" value={answer} ref={answerRef} onChange={(e)=>setAnswer(e.target.value)} placeholder='What is your favorite sport?' className='form-control' />
                            <button disabled={isSubmitting} className='btn btn-primary' type='submit' >{
                                isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : "Register"
                            }</button>
                            {error && <p className='alert alert-danger'>{error}</p>}
                            {message && <p className='alert alert-success'>{message}</p>}
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Register