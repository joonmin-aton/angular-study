import mongoose from "mongoose";
import dayjs from 'dayjs';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contents: { type: String, required: true },
    keywords: { type: Array, required: false },
    createdAt: { type: Date, required: false, default: dayjs().toDate() },
    updatedAt: { type: Date, required: false },
})

export default mongoose.model("Post", postSchema);