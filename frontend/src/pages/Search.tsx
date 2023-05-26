import React, { useContext } from 'react'
import SearchContext from '../context/search'
import ModalComp from '../components/ModalComp'

const Search = () => {
    const {results} = useContext(SearchContext)
  return (
    <>
    <section className='py-3' style={{minHeight:'70vh'}} >
        <h1 className='text-center'>Search Results ({results.length}) </h1>
    </section>
    </>
  )
}

export default Search