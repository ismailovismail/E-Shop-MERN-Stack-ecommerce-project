import React, { useContext, useState } from 'react'
import SearchContext from '../context/search'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import ModalComp from './ModalComp'

const SearchInput = () => {
    const {keyword,setKeyword,setResults,results} = useContext(SearchContext)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState<any>(false)
    const handleSubmit = async (e:React.SyntheticEvent) => {
             e.preventDefault()
            try {
                const response = await axios.get(`http://localhost:5000/api/product/search/${keyword}`)
                if (response?.status === 200) {
                    setResults(response?.data)
                    
                }
            } catch (error) {
                console.log(error);
            }
    }
    return (
        <>
            <form className="d-flex flex-column position-relative " role="search" onSubmit={handleSubmit}>
                <div className="input-search d-flex">
                 <ModalComp  />
                </div>
            </form>
        </>
    )
}

export default SearchInput