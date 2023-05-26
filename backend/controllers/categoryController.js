const { validateCategory, Category } = require('../models/categoryModel')
const slugify = require('slugify')
const { Product } = require('../models/productModel')

const createCategoryController = async (req, res) => {
    try {

        const { error } = validateCategory(req.body)
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message
            })
        }
        const existCategory = await Category.findOne({ name: req.body.name })
        if (existCategory) {
            return res.status(400).send({
                success: false,
                message: 'Already category exist'
            })
        }
        const name = req.body.name;
        const category = await new Category({ name, slug: slugify(name) }).save()
        res.status(200).send({
            success: true,
            message: 'Category created is successfully',
            category
        })



    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in category request',
            error
        })
    }
}

const updateCategoryController = async (req, res) => {

    try {
        const { error } = validateCategory(req.body)
        const { id } = req.params
        const { name } = req.body
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message
            })
        }
        const category = await Category.findByIdAndUpdate(id, { name:name, slug: slugify(name) }, { new: true })

        res.status(200).send({
            success: true,
            message: 'Category updated is successfully',
            category
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in category update request',
            error
        })
    }
}

const categoryController = async (req, res) => {

    try {
        const categories = await Category.find()
        if (!categories) {
            return res.status(404).send({
                success:false,
                message:'Error 404 not found'

            })
        }
        res.status(200).send(categories)
        
    } catch (error) {
        res.status(500).send({
            succes:false,
            message:"Error in category request",
            error
        })
    }
}

const singleCategoryController = async (req, res) => {

    try {
        const singleCategory = await Category.findOne({slug:req.params.slug})
        if (!singleCategory) {
            return res.status(404).send({
                success:false,
                message:"Error 404 not found"
            })
        }
        res.status(200).send(singleCategory)
    } catch (error) {
         
        res.status(500).send({
            success:false,
            message:'Error in single category request',
            error
        })
    } 
}

const deleteCategoryController = async (req, res) => {

    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success:true,
            message:'Category deleted is successfully',
            category
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error in delete request',
            error
        })
    }
}

const productCategoryController = async ( req, res ) => {
    try {
        const category = await Category.findOne({slug:req.params.slug})
        const products = await Product.find({category}).populate('category')
        res.status(200).send({
            success:true,
            products,
            category
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error in product category',
            error
        })
    }
}

module.exports = {
    createCategoryController,
    updateCategoryController,
    categoryController,
    singleCategoryController,
    deleteCategoryController,
    productCategoryController
}