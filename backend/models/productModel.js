const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,

    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    stockCount: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        
       
    },
    shipping: {
        type: Boolean
    }

}, { timestamps: true })

const validateProductForm = (product) => {
    const schema = Joi.object({
        photo:Joi.any(),
        name: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().required(),
        stockCount: Joi.number().required(),
        description: Joi.string().required(),
        shipping: Joi.boolean(),
        slug: Joi.string()
    })
    return schema.validate(product)
}

const Product = mongoose.model('Product', productSchema)

module.exports = { Product, validateProductForm }
