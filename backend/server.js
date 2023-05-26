const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/database')
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
connectDB()

const app = express();

// middlewares
app.use(express.json());
app.use(cors())
app.use(morgan('dev'));


// routes
app.use(authRoutes)
app.use(categoryRoutes)
app.use(productRoutes)
app.use('/images',express.static('./images'))


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT} port`);
})

