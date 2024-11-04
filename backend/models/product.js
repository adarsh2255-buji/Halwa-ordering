import mongoose from "mongoose";

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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model("Product", productSchema);

export default Product;