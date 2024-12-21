const mongoose = require("mongoose");
const {Schema} = mongoose;
const { types } = require("joi"); // This line is not used and can be removed unless needed elsewhere


const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Corrected to use Date.now without parentheses for default value
    },
    author: {
        type: Schema.Types.ObjectId, // Added 'mongoose.' to correctly reference Schema
        ref: 'User',
    },
});

module.exports = mongoose.model("Review", reviewSchema);
