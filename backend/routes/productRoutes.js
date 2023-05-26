const express = require('express');

const router = express.Router();

const { requiredSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { productCreateController, getProductsController, getSingleProductController, updateProductController, deleteProductController, productFilterController, productCountController, productListController, searchProductController, brainTreeTokenController, brainTreePaymentController } = require('../controllers/productController');
const upload = require('../middlewares/imageUpload');


// create-product 

router.post('/api/product/create-product', requiredSignIn, isAdmin, upload.single('photo'), productCreateController)

// get products

router.get('/api/product/all-products', getProductsController)

// get single product 

router.get('/api/product/single-product/:slug', getSingleProductController)

// update product

router.put('/api/product/update-product/:id', requiredSignIn, isAdmin, upload.single('photo'), updateProductController)

// delete product 

router.delete('/api/product/delete-product/:id', requiredSignIn, isAdmin, deleteProductController)

// filter products 
router.post('/api/product/filter-product', productFilterController)

// product count get 
router.get('/api/product/product-count', productCountController)

// product per page

router.get('/api/product/product-list/:page', productListController)

// search product

router.get('/api/product/search/:keyword',searchProductController)

// payment routes

router.get('/api/product/braintree/token',brainTreeTokenController)

// payments 

router.post('/api/product/braintree/payment',requiredSignIn,brainTreePaymentController)

module.exports = router;