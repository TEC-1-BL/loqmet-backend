import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phoneNumber: { type: String },
    accountType: {type: String, required: true, },
    dateOfBirth: { type: String },
    gender: { type: String },
    location: { type: String },
    street: { type: String },
    apartmentType: { type: String },
    cartData:{type:Object,default:{}}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel;