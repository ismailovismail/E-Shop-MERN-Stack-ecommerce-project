const mongoose = require('mongoose');
const Joi = require('joi');
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, lowercase: true }
})

const validateCategory = (category) => {
    const schema = Joi.object({
        name:Joi.string().required(),
        slug:Joi.string()
    })
    return schema.validate(category)
}

const Category = mongoose.model('Category', categorySchema)

module.exports = { Category,validateCategory }