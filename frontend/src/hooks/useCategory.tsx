import axios from "axios";
import {useState, useEffect, useCallback} from 'react'

export default function useCategory(){
const [categories, setCategories] = useState<object[]>([])
 const [isLoading, setIsLoading] = useState<boolean>(false)
const getCategories = useCallback(async () => {
       setIsLoading(true)
    try {
        const response = await axios.get('http://localhost:5000/api/category/all-categories')
        setCategories(response?.data)
    } catch (error) {
        console.log(error);
        
    }
    setIsLoading(false)
},[])

useEffect(()=>{
    getCategories()
},[getCategories])

return { categories,isLoading }

}