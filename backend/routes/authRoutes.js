const express = require('express')
const { registerController, loginController, getAllUsers, updateUsersController, getSingleUser, deleteUserController, forgotPasswordController, newPasswordController, getOrdersController, getAdminOrders, orderStatusController } = require('../controllers/authController');
const { requiredSignIn, isAdmin } = require('../middlewares/authMiddleware');


const router = express.Router();

// get all users
router.get('/api/auth/users', requiredSignIn, isAdmin, getAllUsers)

// get single user

router.get('/api/auth/users/:id', requiredSignIn, getSingleUser)

// register method post

router.post('/api/auth/register', registerController)

// login method post

router.post('/api/auth/login', loginController)

//  update method put

router.put('/api/auth/users/:id', requiredSignIn, updateUsersController)

// reset password method post
router.post('/api/auth/forgot-password',forgotPasswordController) 


// change password method post
router.post('/api/auth/change-pwd/:id',requiredSignIn,newPasswordController)

// delete method

router.delete('/api/auth/users/:id', requiredSignIn, deleteUserController)


// get orders

router.get('/api/auth/orders',requiredSignIn,getOrdersController)

// admin orders

router.get('/api/auth/admin-orders',requiredSignIn,isAdmin,getAdminOrders)


// order status

router.put('/api/auth/order-status/:orderId',requiredSignIn,isAdmin,orderStatusController)

module.exports = router