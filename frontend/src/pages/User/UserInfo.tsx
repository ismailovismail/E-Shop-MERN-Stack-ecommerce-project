import axios from 'axios'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../../context/auth'
import Spinner from '../../components/Spinner'

const UserInfo = () => {
    const authContext = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [success, setSuccess] = useState<any>()
    const [error, setError] = useState<any>()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [role, setRole] = useState<number>()
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const phoneRef = useRef<HTMLInputElement>(null)
    const addressRef = useRef<HTMLInputElement>(null)
    const getSingleUser = useCallback(async () => {
        setIsLoading(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext?.token
                }
            }
            const response = await axios.get(`http://localhost:5000/api/auth/users/${authContext?.user?.id}`, config)
            if (response?.status === 200) {
                setName(response?.data?.name)
                setEmail(response?.data?.email)
                setPhone(response?.data?.phone)
                setAddress(response?.data?.address)
                setAnswer(response?.data?.answer)
                setPassword(response?.data?.password)
                setRole(response?.data?.role)

            }




        } catch (error: any) {
            console.log(error?.response?.data?.message);

        }
        setIsLoading(false)
    }, [authContext?.user?.id, authContext?.token])
    useEffect(() => {
        getSingleUser()

    }, [getSingleUser])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext?.token
                }
            }
            const data = { name, email, password, phone, address, answer, role }
            const response = await axios.put(`http://localhost:5000/api/auth/users/${authContext?.user?.id}`, data, config)
            if (response?.data?.success) {
                setSuccess(response?.data?.message)
                setError(null)
                setTimeout(() => {
                    setSuccess(null)
                }, 5000);
            }
            emailRef.current?.classList.remove('is-invalid')
            nameRef.current?.classList.remove('is-invalid')
            phoneRef.current?.classList.remove('is-invalid')
            addressRef.current?.classList.remove('is-invalid')
        } catch (error: any) {
            if (error?.response?.data?.message.includes('name')) {
                nameRef.current?.classList.add('is-invalid')
                nameRef.current?.focus()
                emailRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message.includes('email')) {
                nameRef.current?.classList.remove('is-invalid')
                emailRef.current?.classList.add('is-invalid')
                emailRef.current?.focus()
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message.includes('phone')) {
                phoneRef.current?.classList.add('is-invalid')
                phoneRef.current?.focus()
                emailRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            } else if (error?.response?.data?.message.includes('address')) {
                addressRef.current?.classList.add('is-invalid')
                addressRef.current?.focus()
                phoneRef.current?.classList.remove('is-invalid')
                setError(error?.response?.data?.message)
            }
        }
        setIsSubmitting(false)
    }

    return (
        <>

            <section className="edit-form d-flex justify-content-center row">
                {
                    isLoading && <div className='loading d-flex py-5 justify-content-center align-items-center'>
                        <Spinner />
                    </div>
                }
                {
                    !isLoading && <form onSubmit={handleSubmit} className='p-2 col-xl-12 d-flex flex-column gap-2'>
                        <div className="name d-flex flex-column gap-2 ">
                            <label htmlFor="">Name</label>
                            <input ref={nameRef} type="text" value={name} onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Name' />
                        </div>
                        <div className="email d-flex flex-column gap-2">
                            <label htmlFor="">Email</label>
                            <input ref={emailRef} type='text' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Email' />
                        </div>
                        <div className="phone d-flex flex-column gap-2">
                            <label htmlFor="">Phone</label>
                            <input ref={phoneRef} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' placeholder='Phone' />
                        </div>
                        <div className="address d-flex flex-column gap-2">
                            <label htmlFor="">Address</label>
                            <input ref={addressRef} type="text" value={address} onChange={(e) => setAddress(e.target.value)} className='form-control' placeholder='Address' />
                        </div>
                        <button disabled={isSubmitting} type='submit' className='btn btn-primary'>{isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Save'}</button>
                        {error && <p className='alert alert-danger'>{error}</p>}
                        {success && <p className='alert alert-success'>{success}</p>}
                    </form>
                }

            </section>

        </>
    )
}

export default UserInfo