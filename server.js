import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoutes.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from './routes/cartRoute.js'
import dotenv from 'dotenv'
import orderRouter from "./routes/orderRoute.js"
import kitchenRoute from "./routes/kitchenRoute.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

//app config
const app = express()
const port = process.env.PORT || 4000

//middleware
app.use(express.json())
app.use(cors())
dotenv.config();

// Add this to verify env variables are loaded
console.log('Email Config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER?.substring(0, 3) + '...',
    hasPassword: !!process.env.EMAIL_PASS
});

//db connection
connectDB();

// Drop nationalId index if it exists
try {
    await mongoose.connection.collection('kitchenowners').dropIndex('nationalId_1');
    console.log('Successfully dropped nationalId index');
} catch (error) {
    console.log('No nationalId index to drop or already dropped');
}

// api endpoint
app.use("/api/food", foodRouter)
app.use('/uploads', express.static('uploads'))
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/kitchen-owner", kitchenRoute)
app.use("/api/delivery", deliveryRouter); 
app.use('/api/delivery', deliveryRoutes); 

app.post('/auth/signup', async (req, res) => {
    const { username, email, password, accountType } = req.body;

    try {
        // تحقق من وجود المستخدم بالفعل
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // إنشاء مستخدم جديد
        const newUser = new User({
            username,
            email,
            password, // تأكد من تشفير كلمة المرور
            accountType, // إضافة نوع الحساب
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})
// mongodb+srv://restubissanproject:BBT5CU%25%24MF@testcluster.au5ew.mongodb.net/?
