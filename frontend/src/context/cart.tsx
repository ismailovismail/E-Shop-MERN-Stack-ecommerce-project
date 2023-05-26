import React, { useEffect, useState } from 'react'


interface cartItems {
    cartItems: object[],
    setCartItems: React.Dispatch<React.SetStateAction<object[]>>
    addToProduct: (product: any,qty:any) => void,
    removeProduct: (product: any) => void,
    deleteProduct: (Product: any) => void
}

export const CartContext = React.createContext<cartItems>({
    cartItems: [],
    setCartItems: function (value: React.SetStateAction<object[]>) {
        throw new Error('Function not implemented')
    },
    addToProduct: function (product: any): void {
        throw new Error('Function not implemented.')
    },
    removeProduct: function (product: any): void {
        throw new Error('Function not implemented.')
    },
    deleteProduct: function (Product: any): void {
        throw new Error('Function not implemented.')
    }
})

export const CartProvider = ({ children }: any) => {
    const [cartItems, setCartItems] = useState<object[]>([])
    const addToProduct = (product: any,qty:any) => {
        const exist: any = cartItems.find((item: any) => item._id === product._id)
        if (exist) {
            const newCartItem = cartItems.map((item: any) => item._id === product._id ? { ...exist, qty: exist.qty + 1 } : item)
            setCartItems(newCartItem)
            localStorage.setItem('myCartItems', JSON.stringify(newCartItem))
        } else {
            const newCartItem = [...cartItems, { ...product, qty: qty  }]
            setCartItems(newCartItem)
            localStorage.setItem('myCartItems', JSON.stringify(newCartItem))
        }
    }

    const removeProduct = (product: any) => {
        const exist: any = cartItems.find((item: any) => item._id === product._id)
        if (exist.qty === 1) {
            const removedItems = cartItems.filter((item: any) => item._id !== product._id)
            setCartItems(removedItems)
            localStorage.setItem('myCartItems', JSON.stringify(removedItems))
        } else {
            const removedItems = cartItems.map((item: any) => item._id === product._id ? { ...exist, qty: exist.qty - 1 } : item)
            setCartItems(removedItems)
            localStorage.setItem('myCartItems', JSON.stringify(removedItems))
        }
    }

    const deleteProduct = (product: any) => {
        const deletedProduct = cartItems.filter((item: any) => item._id !== product._id)
        setCartItems(deletedProduct)
        localStorage.setItem('myCartItems', JSON.stringify(deletedProduct))
    }

    useEffect(() => {
        const cartItems = localStorage.getItem('myCartItems')
        if (typeof cartItems === 'string') {
            const parsedData = JSON.parse(cartItems)
            setCartItems(parsedData)
        }
    }, [])

    const data = {
        cartItems,
        setCartItems,
        addToProduct,
        removeProduct,
        deleteProduct
    }
    return (
        <CartContext.Provider value={data} >
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider