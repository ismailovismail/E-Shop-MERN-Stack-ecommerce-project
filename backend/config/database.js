
const mongoose = require('mongoose')

const connectDB = async () => {

    try {
        const connect = await mongoose.connect('mongodb+srv://ismail:ismail123@cluster0.lkqsbcp.mongodb.net/ecommerce')
        console.log(`Connected to databse ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connectDB }
