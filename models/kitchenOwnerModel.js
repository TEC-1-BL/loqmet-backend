import mongoose from 'mongoose';

const kitchenOwnerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String},
    password: {type: String, required: true},
    accountType: { type: String, required: true },
    nationalId: { type: String,  default: undefined },
    phoneNumber: {type: String},
    age: {type: Number},
    experience: {type: String},
    availableFrom: {type: String},
    availableTo: {type: String},
    city: {type: String},
    gender: {type: String},
    healthCardImage: {type: String},
    isVerified: {type: Boolean, default: false},
    rating: {type: Number, default: 0, min: 0, max: 5},
    totalOrders: {type: Number, default: 0, min: 0},
    activeStatus: {type: Boolean, default: true},
    profileImage: {type: String},
    coverImage: {type: String},
    description: {type: String},
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'food' }],
    role: {type: String, default: 'kitchen_owner'},
    profilePhoto: {type: String},
    backgroundPhoto: {type: String},
    bio: {type: String},
    instagramLink: { type: String },
    facebookLink: { type: String }, 
}, {timestamps: true, minimize: false});

kitchenOwnerSchema.index({ nationalId: 1 }, { 
    unique: true, 
    sparse: true,  // Only index documents where nationalId exists
    background: true 
});

const kitchenOwnerModel = mongoose.models.kitchenOwner || mongoose.model('kitchenOwner', kitchenOwnerSchema);
export default kitchenOwnerModel;