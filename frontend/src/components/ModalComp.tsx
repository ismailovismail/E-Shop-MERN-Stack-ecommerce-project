import React, { useContext, useState } from 'react';
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faS, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import SearchContext from '../context/search';
import axios from 'axios';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
const ModalComp: React.FC = () => {
  library.add(faS, faSearch)
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { keyword, setKeyword, results, setResults } = useContext(SearchContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    setKeyword('')
    setError('')
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {

      const response = await axios.get(`http://localhost:5000/api/product/search/${keyword}`)
      if (response.status === 200) {
        setResults(response?.data)
        setError('')
      }

    } catch (error:any) {
         
         setError(error?.response?.data)

    }
    setIsLoading(false)
  }

  const handleDelete = (id:string) => {
       setResults(
        results?.filter((item:any)=>{
          return item?._id !== id
        })
       )
  }

  return (
    <>
      <button className='btn mx-2 btn-outline-success d-flex align-items-center gap-2 ' onClick={showModal}>
        <FontAwesomeIcon icon={['fas', 'search']} />
        <input disabled className='form-control' type="search" name="" placeholder='Search...' id="" />
      </button>
      <Modal
        title="Search"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit} className="search-part d-flex gap-2 ">
          <input type="text" value={keyword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setKeyword(e.target.value)
          }} placeholder='Search product' className='form-control' />
          <button type='submit' disabled={!keyword} className='btn btn-outline-primary' >Search</button>
        </form>
        {
          isLoading && <div style={{ minHeight: '40vh' }} className="loading d-flex align-items-center justify-content-center ">
            <Spinner />
          </div>
        }
        {
          !error && !isLoading && results.length === 0 && <p className='text-center my-2' >
            No recent searches
          </p>
        }
        {
          error && <p className='text-danger text-center my-2 '>{error}</p>
        }
        {
          !error && !isLoading && results && results?.map((item: any,i) => {
            return <div className="card mb-3 my-2" style={{ maxWidth: 540,minHeight:80 }}>
              <div className="row g-0">
                <div className="col-md-4  d-flex align-items-center justify-content-center">
                  <img src={`http://localhost:5000/images/${item?.photo}`} width={100} className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="delete-btn d-flex justify-content-end">
                      <button onClick={()=>handleDelete(item?._id)} className='btn btn-outline-danger'>X</button>
                    </div>
                    <h1 className='card-title fs-4 '>{item?.name}</h1> 
                    <p className='card-text'>{item?.description}</p> 
                    <p className='card-text'>Category: {item?.category?.name}</p>
                    <p className='card-text'>$ {item?.price} </p>
                    <div className="buttons d-flex my-2 gap-2 ">
                    <button className='btn btn-outline-dark'>Add to cart <FontAwesomeIcon icon={['fas','shopping-cart']} /> </button>
                    <Link to={`/single-product/${item?.slug}`} onClick={()=>{
                      handleCancel()
                    }} className='btn btn-outline-dark'>View Details <FontAwesomeIcon icon={['fas','eye']} /> </Link>
                  </div>
                  </div>
                </div>
              </div>
            </div>

          })
        }
      </Modal>
    </>
  );
};

export default ModalComp;