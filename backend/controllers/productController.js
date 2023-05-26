
const { default: slugify } = require('slugify')
const { validateProductForm, Product } = require('../models/productModel')
const braintree = require('braintree')
const { Order } = require('../models/orderModel')

const productCreateController = async (req, res) => {

    try {
        const { error } = validateProductForm(req.body)

        if (error) {
            return res.status(400).send({
                succes: false,
                message: error.details[0].message
            })
        }

        const { name, description, price, category, stockCount, shipping } = req.body

        const photo = req.file.filename

        const product = await new Product({
            name,
            description,
            price,
            category,
            stockCount,
            photo,
            shipping,
            slug: slugify(name)
        }).save()

        res.status(200).send({
            success: true,
            message: 'Product created successfully',
            product
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in creating product"
        })
    }
}


const getProductsController = async (req, res) => {

    try {
        const products = await Product.find().populate('category')
        if (!products) {
            return res.status(400).send({
                success: false,
                message: 'Not Found 400'
            })
        }
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in get all products',
            error
        })
    }
}

const getSingleProductController = async (req, res) => {

    try {

        const product = await Product.findOne({ slug: req.params.slug }).populate('category')

        if (!product) {
            return res.status(400).send({
                success: false,
                message: 'Not Found 400'
            })
        }

        res.status(200).send(product)

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in single product',
            error
        })
    }
}



const updateProductController = async (req, res) => {

    try {
        const { error } = validateProductForm(req.body)

        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message
            })
        }

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(400).send({
                success: false,
                message: 'Not Found 400'
            })
        }

        const { name, description, price, stockCount, category, shipping } = req.body

        let photo = req.body.photo

        if (req.file) {
            photo = req.file.filename
        }

        product.name = name
        product.slug = slugify(name)
        product.description = description
        product.price = price
        product.stockCount = stockCount
        product.category = category
        product.photo = photo
        product.shipping = shipping

        const updatedProduct = await product.save()

        res.status(200).send({
            success: true,
            message: 'Changes saved successfully',
            updatedProduct
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in update product',
            error
        })
    }

}


const deleteProductController = async (req, res) => {

    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
            product
        })

    } catch (error) {

        res.status(500).send({
            success: false,
            message: 'Error in delete product',
            error
        })

    }
}


const productFilterController = async (req, res) => {

    try {

        const { checkedProducts, radio } = req.body
        let args = {}
        if (checkedProducts.length > 0) {
            args.category = checkedProducts
        }

        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }

        const products = await Product.find(args).populate('category')
        if (products.length === 0) {
            return res.status(404).json('Not Found Product 404')
        }

        res.status(200).send(products)

    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error in while filtering products'
        })
    }

}

const productCountController = async (req, res) => {

    try {
        const total = await Product.find().estimatedDocumentCount({})
        res.status(200).json(total)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in product count',
            error
        })
    }
}


const productListController = async (req, res) => {

    try {

        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await Product.find({}).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).populate('category')
        res.status(200).send(products)

    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error in per page',
            error
        })
    }
}


const searchProductController = async (req, res) => {

    try {
        const { keyword } = req.params
        const results = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).populate('category')

        if (results.length === 0) {
            return res.status(404).json('Not found product 404')
        }

        res.json(results)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in search product",
            error
        })
    }


}

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "3vd84br3rws39jd5",
    publicKey: "4gm89f29qfnqbfzd",
    privateKey: "328cf73c184f7ca8b37c4792b334785d",
});


const brainTreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(response)
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const brainTreePaymentController = async (req, res) => {

    try {
        const { cartItems, nonce } = req.body

        let total = 0;

        total = cartItems.reduce((a, c) => a + c.price, 0)

        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new Order({
                        products: cartItems,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )

    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    productCreateController,
    getProductsController,
    getSingleProductController,
    updateProductController,
    deleteProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    brainTreeTokenController,
    brainTreePaymentController
}