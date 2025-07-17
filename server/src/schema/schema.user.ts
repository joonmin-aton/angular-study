import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    lastLoginAt: { type: Date, required: false },
    createdAt: { type: Date, required: false, default: Date.now() },
    updatedAt: { type: Date, required: false },
})

export default mongoose.model("User", userSchema);