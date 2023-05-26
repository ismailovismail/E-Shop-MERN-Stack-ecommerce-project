import axios from "axios"
import { Product } from "./ProductType"


export const getProductList = async () => {
    return await axios.get<Product>('http://localhost:5000/api/product/all-products')
}