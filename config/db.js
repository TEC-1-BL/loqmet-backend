import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://theeblayan7:hxfkIFgNsCB6VSTb@cluster0.grlp2.mongodb.net/food_dele').then(()=>console.log("DB Connected"));
}