import axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../../context/auth'
import Spinner from '../../components/Spinner'
import { Helmet } from 'react-helmet'
const EditUser = () => {
    const { id } = useParams()
    const authContext = useContext(AuthContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<number>()
    const [password, setPassword] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const navigate = useNavigate()
    const getSingleUser = useCallback(async () => {
        setLoading(true)
        try {
            const config = {
                headers: {
                    "Authorization": authContext?.token
                }
            }
            const response = await axios.get(`http://localhost:5000/api/auth/users/${id}`, config)

            if (typeof response?.data === 'object') {
                setName(response?.data?.name)
                setEmail(response?.data?.email)
                setRole(response?.data?.role)
                setPassword(response?.data?.password)
                setPhone(response?.data?.phone)
                setAddress(response?.data?.address)
                setAnswer(response?.data?.answer)
            }





        } catch (error: any) {
            console.log(error?.response?.data?.message);

        }
        setLoading(false)
    }, [id, authContext?.token])
    useEffect(() => {
        getSingleUser()


    }, [authContext?.token, getSingleUser])
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const data = { name, email, password, phone, address, role, answer }
        setIsSubmitting(true)
        try {
            const config = {
                headers: {
                    'Authorization': authContext?.token
                }
            }
            const response = await axios.put(`http://localhost:5000/api/auth/users/${id}`, data, config)
            if (response?.data?.success) {
                navigate('/dashboard/users')
            } else {
                throw new Error(response?.data?.message)
            }
        } catch (error: any) {
            setError(error?.response?.data?.message)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async () => {
        const config = {
            headers: {
                "Authorization": authContext?.token
            }
        }
        setIsDeleting(true)
        try {
            const response = await axios.delete(`http://localhost:5000/api/auth/users/${id}`, config)
            if (response?.data?.success) {
                navigate('/users')
            } else {
                throw new Error(response?.data?.message)
            }
        } catch (error: any) {
            setError(error?.response?.data?.message)
        }
        setIsDeleting(false)
    }

    if (loading) {
        return <div style={{ minHeight: '80vh' }} className="loading d-flex justify-content-center align-items-center">
            <Spinner />
        </div>
    }
    return (
        <>
           <Helmet>
            <title>
                E-Shop | Edit User
            </title>
           </Helmet>
            <section style={{ minHeight: '120vh' }} className="edit-user d-flex justify-content-center align-items-center">
                <div className="container-fluid row d-flex justify-content-center">
                    <div className="register-part p-2 row border bg-white col-10 col-md-7 col-xl-5 rounded">
                        <h1 className='text-center fw-bold'>Update User</h1>
                        <form onSubmit={handleSubmit} className='col-xl-12 d-flex flex-column gap-2'>
                            <label htmlFor="">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Name' />
                            <label htmlFor="">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Email' />
                            <label htmlFor="">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' placeholder='Password' />
                            <label htmlFor="">Phone</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' placeholder='Phone' />
                            <label htmlFor="">Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Address' className='form-control' />
                            <label htmlFor="">Answer</label>
                            <input type="text" value={answer} onChange={(e)=>setAnswer(e.target.value)} placeholder='What is your favorite sport?' className='form-control' />
                            <label htmlFor="">Role</label>
                            <select className='form-control' onChange={(e) => setRole(parseInt(e.target.value))} value={role} >
                                <option value="1">1</option>
                                <option value="0">0</option>
                            </select>
                            <button disabled={isSubmitting} className='btn btn-primary' type='submit' > {isSubmitting ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Update'} </button>
                            <button onClick={handleDelete} disabled={isDeleting} className='btn btn-danger'>{loading ? <img width={20} src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" alt="" /> : 'Delete'}</button>
                            {
                                error && <p className='alert alert-danger'>{error}</p>
                            }
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default EditUser