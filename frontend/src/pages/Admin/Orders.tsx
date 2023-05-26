import axios from 'axios'
import React from 'react'
import {useContext,useState,useEffect,useCallback} from 'react'
import AuthContext from '../../context/auth'
import moment from 'moment';
import { Select } from 'antd';
import Spinner from '../../components/Spinner';
const {Option}=Select
const Orders = () => {
   const authContext = useContext(AuthContext)
   const [orders, setOrders] = useState<object[]>([])
   const [status,setStatus] = useState<any>(['Not Process','Processing','Shipped','Delivered','Cancel'])
   const [changeStatus, setChangeStatus] = useState<string>('')
   const [isLoading, setIsLoading] = useState<boolean>(false)
    const getAllOrders = useCallback(async () => {
        setIsLoading(true)
        try {
            const config = {
                headers:{
                    'Authorization':authContext?.token
                }
            }
        const response = await axios.get('http://localhost:5000/api/auth/admin-orders',config)
        if (response?.status === 200) {
            setOrders(response?.data)
        }
        } catch (error) {
               console.log(error);
               
        }
        setIsLoading(false)
    },[authContext?.token])
    const handleChange = async (orderId:string,value:any) => {
        try {
            const config = {
                headers:{
                    'Authorization':authContext?.token
                }
            }
           
            const response = await axios.put(`http://localhost:5000/api/auth/order-status/${orderId}`,{status:value},config)
            if (response?.status === 200) {
                getAllOrders()
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(()=>{
        getAllOrders()
    },[getAllOrders])
      
    if (isLoading) {
        return <div style={{minHeight:'70vh'}} className="loading d-flex align-items-center justify-content-center">
            <Spinner/>
        </div>
    }
    return (
        <>
            <section style={{ minHeight: '70vh' }} className="py-4 admin-orders">
                <div className="container-fluid">
                    <h1 className='text-center'>Orders</h1>
                    <div className="orders-table">
                        {
                            orders?.map((item:any,i:number)=>{
                                return <> <table className="table">
                                <thead>
                                    <tr>
                                        <td scope='col'>#</td>
                                        <td scope='col'>Status</td>
                                        <td scope='col'>Buyer</td>
                                        <td scope='col'>Date</td>
                                        <td scope='col'>Payment</td>
                                        <td scope='col'>Quantity</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                      <td>{i+1}</td>
                                      <td>
                                        <Select bordered={false} onChange={(value)=>handleChange(item?._id,value)} defaultValue={item?.status} >
                                          {
                                            status?.map((item:any,i:number)=>{
                                                return <Option key={i} value={item}>{item}</Option>

                                            })
                                          }
                                        </Select>
                                      </td>
                                      <td>{item?.buyer?.name}</td>
                                      <td>{moment(item?.createdAt).fromNow()}</td>
                                      <td>{item?.payment?.success ? 'Success' : 'Failed'}</td>
                                      <td>{item?.products?.length}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {
                                item?.products?.map((product:any)=>{
                                    return  <div className="card border-0 mb-3" style={{ maxWidth: 540 }}>
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <div className="image d-flex justify-content-center ">
                                            <img width={100} src={`http://localhost:5000/images/${product?.photo}`} className="img-fluid rounded-start" alt="..." />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{product?.name}</h5>
                                                <p className='card-text'>{product?.description}</p>
                                                <p>Price:$ {product?.price} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                })
                            }
                            </>
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default Orders