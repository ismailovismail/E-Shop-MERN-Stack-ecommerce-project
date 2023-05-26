import axios from 'axios'
import React, { useRef, useState } from 'react'

const Forgot = () => {
    const [message, setMessage] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const answerRef = useRef<HTMLInputElement>(null)
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const data = { email, answer, password }
        setIsSubmitting(true)
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', data)
            if (response?.data?.success) {
                setMessage(response?.data?.message)
                setError('')
            } else {
                throw new Error(response?.data?.message)
            }
        } catch (error: any) {
            if (error?.response?.data?.message === "\"email\" is not allowed to be empty") {
                emailRef.current?.classList.add('is-invalid')
                emailRef.current?.focus()
                answerRef.current?.classList.remove('is-invalid')
                passwordRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message === "\"answer\" is not allowed to be empty") {
                answerRef.current?.classList.add('is-invalid')
                answerRef.current?.focus()
                emailRef.current?.classList.remove('is-invalid')
                passwordRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message === "\"password\" is not allowed to be empty") {
                passwordRef.current?.classList.add('is-invalid')
                passwordRef.current?.focus()
                answerRef.current?.classList.remove('is-invalid')
                emailRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message === 'Invalid email or answer') {
                emailRef.current?.classList.add('is-invalid')
                answerRef.current?.classList.add('is-invalid')
                passwordRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            }else {
                setError(error?.response?.data?.message)
            }
        }
        setIsSubmitting(false)

    }
    return (
        <>
            <section style={{ minHeight: '70vh' }} className="forgot d-flex align-items-center">
                <div className="container-fluid row d-flex justify-content-center">
                    <div className="login-part p-2 bg-white rounded col-8 col-sm-7 col-md-6 col-lg-5 col-xl-4 ">
                        <h1 className='text-center fw-bold'>Reset Password</h1>
                        <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
                            <input ref={emailRef} type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className={`form-control`} />
                            <input ref={answerRef} type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder='What is your favorite sport?' className='form-control' />
                            <input ref={passwordRef} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='New Password' className={`form-control`} />
                            <button className='btn btn-primary' disabled={isSubmitting} type='submit'>{isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Reset Password'}</button>
                            {error && <p className='alert alert-danger'>{error}</p>}
                            {message && <p className='alert alert-success'>{message}</p>}
                        </form>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Forgot