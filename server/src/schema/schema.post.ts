import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
title: { type: String, required: true },
    contents: { type: String, required: true },
    keywords: { type: Array, required: false },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
})

module.exports = mongoose.model("Post", postSchema);