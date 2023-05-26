const { User, validateLogin, validateRegister, validateUpdate, validateForgotPassword, validateNewPassword } = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/authHelper')
const jwt = require('jsonwebtoken');
const { Order } = require('../models/orderModel');

const registerController = async (req, res) => {

    try {

        const { validateRegister } = require('../models/userModel')

        const { error } = validateRegister(req.body)

        if (error) {
            return res.status(400).send({ success: false, message: error.details[0].message })
        }


        const existingUser = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Already registered please login"
            })
        }
        const { hashPassword } = require('../helpers/authHelper')
        const { name, email, password, phone, address, answer } = req.body

        const hashedPassword = await hashPassword(password)

        const user = await new User({ name, email, password: hashedPassword, phone, address, answer }).save()

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in registration',
            error
        })
    }
}

const loginController = async (req, res) => {

    try {

        const { error } = validateLogin(req.body)

        if (error) {
            return res.status(400).send({ success: false, message: error.details[0].message })
        }

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Email or password is invalid"

            })
        }

        const { comparePassword } = require('../helpers/authHelper')

        const { password } = req.body

        const passwordMatch = await comparePassword(password, user.password)

        if (!passwordMatch) {
            return res.status(400).send({
                success: false,
                message: "Email or password is invalid"
            })
        }

        // token
        const jwt_secret = 'BSDJOVBSDC'
        const token = await jwt.sign({ _id: user._id }, jwt_secret, {
            expiresIn: '7d'
        })

        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }

}

const forgotPasswordController = async (req, res) => {

    try {
        const { error } = validateForgotPassword(req.body)
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message
            })
        }
        const { email, answer } = req.body
        const user = await User.findOne({ email, answer })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email or answer'
            })
        }

        const hashedPassword = await hashPassword(req.body.password)
        user.password = hashedPassword
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Change password is successfully'
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in password reset request'
        })
    }
}

const newPasswordController = async (req, res) => {
    try {
        const { error } = validateNewPassword(req.body)
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message
            })
        }
        const user = await User.findById(req.params.id)
        const { password } = req.body
        const passwordMatch = await comparePassword(password, user.password)
        if (!passwordMatch) {
            return res.status(400).send({
                success: false,
                message: 'Exist password is invalid'
            })
        }
        const hashedPassword = await hashPassword(req.body.newPassword)
        user.password = hashedPassword
        await user.save()
        res.status(200).send({
            success: true,
            message: "Change password is successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Change password request is failed'
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users) {
            return res.status(400).send({
                success: false,
                message: 'Bad request',
            })
        }
        res.send(users)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in get all users request',
            error
        })
    }
}

const getSingleUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Bad request"
            })
        }
        res.status(200).send(user)


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in get single user request',
            error
        })
    }

}



const updateUsersController = async (req, res) => {
    try {
        const { error } = validateUpdate(req.body)
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message
            })
        }
        const user = await User.findById(req.params.id)
        const hashedPassword = await hashPassword(req.body.password)
        user.name = req.body.name
        user.email = req.body.email
        user.password = hashedPassword
        user.phone = req.body.phone
        user.address = req.body.address
        user.role = req.body.role
        user.answer = req.body.answer

        const result = await user.save()

        res.status(200).send({
            success: true,
            result,
            message: "Changes saved successfully"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in update users request',
            error
        })
    }
}

const deleteUserController = async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'User is not defined'
            })
        }

        res.status(200).send({
            success: true,
            user
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in delete user request',
            error
        })
    }
}

const getOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id }).populate('products').populate('buyer', 'name')
        res.json(orders)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error while getting orders',
            error
        })
    }
}

const getAdminOrders = async (req, res) => {
    try {

        const allOrders = await Order.find({}).populate('products').populate('buyer', 'name').sort({ createdAt: '-1' })
        res.json(allOrders)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in admin orders',
            error
        })
    }
}

const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in updating order',
            error
        })
    }
}

module.exports = {
    registerController,
    loginController,
    getAllUsers,
    updateUsersController,
    getSingleUser,
    deleteUserController,
    forgotPasswordController,
    newPasswordController,
    getOrdersController,
    getAdminOrders,
    orderStatusController
}