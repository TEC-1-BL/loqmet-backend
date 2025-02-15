import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import dotenv from 'dotenv';
import orderRouter from './routes/orderRoute.js';
import kitchenRoute from './routes/kitchenRoute.js';
import deliveryRouter from './routes/deliveryRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

dotenv.config();

//app config
const app = express();

//middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api routes
app.use('/api/food', foodRouter);
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/kitchen-owner', kitchenRoute);
app.use('/api/delivery', deliveryRouter);
app.use('/api/delivery', deliveryRoutes);

// sign-up route
app.post('/auth/signup', async (req, res) => {
  const { username, email, password, accountType } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      email,
      password,
      accountType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Export the app to be used by Vercel's serverless function
export default app;
