export interface Product {
    _id: string,
    name: string,
    slug: string,
    description: string,
    price: number,
    category: string,
    stockCount: number,
    photo: any
}



export interface ProductState {
    products: Product[],
    status: string,
    error: any,
    success: any,
    isSubmitting: any,
    singleProduct:any
    
   
}