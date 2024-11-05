import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';


// PORT
const port = process.env.PORT || 3000;
dotenv.config();

connectDB();

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('api/wishlist', wishlistRoutes);
 
app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(port, () => {
    console.log(`Server running at ${port}`)
})
