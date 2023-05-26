const express = require('express');
const { requiredSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController, productCategoryController } = require('../controllers/categoryController');

const router = express.Router();

// create category method post 

router.post('/api/category/create-category', requiredSignIn, isAdmin, createCategoryController)


// update category method put

router.put('/api/category/update-category/:id', requiredSignIn, isAdmin, updateCategoryController)


// get all categories 

router.get('/api/category/all-categories', categoryController)

// get single category 

router.get('/api/category/single-category/:slug', singleCategoryController)

// delete category 

router.delete('/api/category/delete-category/:id', requiredSignIn, isAdmin, deleteCategoryController)


// category wise product

router.get('/api/category/product-category/:slug',productCategoryController)


module.exports = router