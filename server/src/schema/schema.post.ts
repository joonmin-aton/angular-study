import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    contents: { type: String, required: true },
    keywords: { type: Array, required: false },
    createdAt: { type: Date, required: false, default: () => new Date() },
    updatedAt: { type: Date, required: false },
})

export default mongoose.model("Post", postSchema);