import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    Image: { type: String, required: true },
    category:{type:[String],required:true},
    prepTime: {type: Number,required: true, },
    flavors: [{
        name: { type: String},
        price: { type: Number, default: 0 } // Price for the flavor, default to 0 if no extra charge
    }],
    available: { type: Boolean, default: true }, 
    kitchenOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'kitchenOwner', required: true }

}, { timestamps: true });

const foodModel = mongoose.model.food || mongoose.model("food",foodSchema);

export default foodModel; 