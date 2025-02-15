import mongoose from "mongoose";  // Use 'import' instead of 'require'
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 600 },// Token expires in 600 seconds (10 minutes)
});

export default mongoose.model("token", tokenSchema);
