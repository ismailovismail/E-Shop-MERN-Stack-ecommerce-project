import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, ProductState } from "./ProductType";
import axios from "axios";








const initialState: ProductState = {
    products: [],
    status: 'pending' || 'ideal' || 'error' || 'success',
    error: '',
    success: '',
    isSubmitting: 'false',
    singleProduct: null


}


export const getProductListAction = createAsyncThunk(
    "product/getProductListAction",
    async () => {

        try {
            const response = await axios.get<Product>('http://localhost:5000/api/product/all-products')
            return response?.data
        } catch (error: any) {
            return error?.response?.data?.message
        }

    }
)

export const getSingleProductAction = createAsyncThunk(
    "product/getSingleProductAction",
    async (slug: any, { rejectWithValue }) => {
        try {
            const response = await axios.get<Product>(`http://localhost:5000/api/product/single-product/${slug}`)
            return response?.data
        } catch (error: any) {
            rejectWithValue(error?.response?.data?.message)
        }
    }
)


export const createProductAction = createAsyncThunk(
    "product/createProductAction",
    async (data: any, { rejectWithValue }) => {
        try {

            const formData = new FormData()
            formData.append('name', data?.name)
            formData.append('description', data?.description)
            formData.append('price', data?.price)
            formData.append('stockCount', data?.stockCount)
            formData.append('category', data?.category)
            formData.append('photo', data?.photo)
            formData.append('shipping', data?.shipping)
            const config = {
                headers: {
                    "Authorization": data?.token,
                    "Content-Type": 'multipart/form-data'

                }
            }
            const response = await axios.post('http://localhost:5000/api/product/create-product', formData, config)
            if (response?.data?.success) {
                return response?.data?.message
            }


        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message)

        }
    }
)



const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        deleteMessage: (state) => {
            state.success = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProductListAction.pending, (state) => {
            state.status = 'pending'
        });
        builder.addCase(getProductListAction.fulfilled, (state, action) => {
            state.products = action.payload
            state.status = 'ideal'
        });
        builder.addCase(getProductListAction.rejected, (state, action) => {
            state.status = 'error'


        });
        builder.addCase(createProductAction.pending, (state) => {
            state.isSubmitting = 'true'
        });
        builder.addCase(createProductAction.fulfilled, (state, action) => {
            state.isSubmitting = 'false'
            state.success = action.payload
            state.error = ''


        });
        builder.addCase(createProductAction.rejected, (state, action) => {
            state.error = action.payload
            state.isSubmitting = 'false'
            state.success = ''


        });
        builder.addCase(getSingleProductAction.pending, (state) => {
            state.status = 'pending'
        });
        builder.addCase(getSingleProductAction.fulfilled, (state, action) => {
            state.status = 'ideal'
            state.error = ''
            state.singleProduct = action.payload

        });
        builder.addCase(getSingleProductAction.rejected, (state, action) => {
            state.error = action.payload
            state.status = 'error'
            state.success = ''
        })
    }
})

export const { deleteMessage } = productSlice.actions

export default productSlice.reducer