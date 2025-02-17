import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; 

const deliverySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    accountType: { type: String, required: true },
    phoneNumber: { type: String },
    location: { type: String },
    vehicleType: { type: String },
    availableFrom: { type: String },
    availableTo: { type: String },
    role: { type: String, default: 'Delivery' },
    deliveryzones: { type: [String] },
  },
  { timestamps: true }
);


deliverySchema.index({ nationalId: 1 }, { 
  unique: true, 
  sparse: true,  // Only index documents where nationalId exists
  background: true 
});

// Use existing model if already compiled, otherwise create a new one
const deliveryModel =
  mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);

export default deliveryModel;
