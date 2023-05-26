const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, },
    address: { type: String, required: true },
    answer: { type: String, required: true },
    role: { type: Number, default: 0 }
}, { timestamps: true })

const validateRegister = (user) => {
    const schema = Joi.object({
        name: Joi.string().required('Name is required').min(5).max(16),
        email: Joi.string().email().required('Email is required'),
        password: Joi.string().required().min(5),
        phone: Joi.string().required().min(8),
        address: Joi.string().required(),
        answer:Joi.string().required()
    })
    return schema.validate(user)
}

const validateUpdate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required('Name is required').min(5).max(16),
        email: Joi.string().email().required('Email is required'),
        password: Joi.string().required().min(5),
        phone: Joi.string().required().min(8),
        address: Joi.string().required(),
        answer: Joi.string().required(),
        role: Joi.number()
    })
    return schema.validate(user)
}


const validateLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required('Email is required'),
        password: Joi.string().required('Password is required')
    })
    return schema.validate(user)
}

const validateForgotPassword = (user) => {
  const schema = Joi.object({
    email:Joi.string().required().email(),
    answer:Joi.string().required(),
    password:Joi.string().required().min(5)
  })
  return schema.validate(user)
}

const validateNewPassword = (user) => {
      const schema = Joi.object({
        password:Joi.string().required().messages({
            "string.empty":"Exist Password is not allowed to be empty"
        }),
        newPassword:Joi.string().required().min(5).messages({
            "string.empty":"New Password is not allowed to be empty",
            'string.min':'New Password length must be at least 5 characters long'
        })
      })
      return schema.validate(user)
}

const User = mongoose.model('User', userSchema)

module.exports = { User, validateRegister, validateLogin, validateUpdate, validateForgotPassword, validateNewPassword }