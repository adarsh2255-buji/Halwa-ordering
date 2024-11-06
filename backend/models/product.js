import mongoose from "mongoose";

// Review schema
const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes leading and trailing whitespaces
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Product price should be greater than or equal to 0
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0 // Product quantity should be greater than or equal to 0
    },
    image: {
        type: String,
        required: true
    },
    reviews: {
        type: [reviewSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})





const Product = mongoose.model("Product", productSchema);

export default Product;