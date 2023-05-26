import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Cart from '../pages/Cart'
import NotFound from '../pages/NotFound'
import Contact from '../pages/Contact'
import About from '../pages/About'
import { AuthProvider } from '../context/auth'
import Private from '../components/Private'
import Dashboard from '../pages/Admin/Dashboard'
import Users from '../pages/Admin/Users'
import EditUser from '../pages/Admin/EditUser'
import Forgot from '../pages/Forgot'
import User from '../pages/User/User'
import PrivateUser from '../components/PrivateUser'
import EditProfile from '../pages/User/EditProfile'
import UserInfo from '../pages/User/UserInfo'
import ResetPassword from '../pages/User/ResetPassword'
import Categories from '../pages/Admin/Categories'
import AddCategory from '../pages/Admin/AddCategory'
import EditCategory from '../pages/Admin/EditCategory'
import Products from '../pages/Admin/Products'
import AddProduct from '../pages/Admin/AddProduct'
import EditProduct from '../pages/Admin/EditProduct'
import { SearchProvider } from '../context/search'
import ProductDetails from '../pages/ProductDetails'
import CategoryProduct from '../pages/CategoryProduct'
import CartProvider from '../context/cart'
import Orders from '../pages/Admin/Orders'
const AppRouter = () => {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <SearchProvider>
                        <CartProvider>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/aboutpg' element={<About />} ></Route>
                        <Route path='/categories/:slug' element={<CategoryProduct />} ></Route>
                        <Route path='/loginpg' element={<Login />} ></Route>
                        <Route path='/forgotpwd' element={<Forgot />} ></Route>
                        <Route path='/register' element={<Register />} ></Route>
                        <Route path='/cart' element={<Cart />}></Route>
                        <Route path='/contacts' element={<Contact />} ></Route>
                        <Route path='/single-product/:slug' element={<ProductDetails/>}  ></Route>
                        <Route path='/dashboard' element={<Private />} >
                            <Route path='admin' element={<Dashboard />}></Route>
                            <Route path='users' element={<Users />} ></Route>
                            <Route path='users/:id' element={<EditUser />} ></Route>
                            <Route path='categories' element={<Categories/>} ></Route>
                            <Route path='categories/:slug' element={<EditCategory/>}  ></Route>
                            <Route path='add-category' element={<AddCategory/>} ></Route>
                            <Route path='products' element={<Products/>} ></Route>
                            <Route path='products/:slug' element={<EditProduct/>} ></Route>
                            <Route path='add-product' element={<AddProduct/>} ></Route>
                            <Route path='orders' element={<Orders/>} ></Route>
                        </Route>
                        <Route path='/dashboard' element={<PrivateUser />}>
                            <Route path='user' element={<User />} ></Route>
                            <Route path='user-edit/' element={<EditProfile/>} >
                                <Route path='edit-profile' element={<UserInfo/>} ></Route>
                                <Route path='reset-password' element={<ResetPassword/>} ></Route>
                            </Route>
                        </Route>
                        <Route path='*' element={<NotFound />} ></Route>
                    </Routes>
                    <Footer />
                    </CartProvider>
                    </SearchProvider>
                </AuthProvider>
            </BrowserRouter>

        </>
    )
}

export default AppRouter