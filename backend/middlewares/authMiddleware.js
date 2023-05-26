
const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel')

const requiredSignIn = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).send({
            success:false,
            message:'Not defined token'
        })
    }
    try {
        const jwt_secret = 'BSDJOVBSDC';
        const decode = jwt.verify(req.headers.authorization, jwt_secret);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"Invalid token",
            error
        })
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = { requiredSignIn, isAdmin }