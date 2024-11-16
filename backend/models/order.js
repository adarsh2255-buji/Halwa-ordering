import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

// order schema 

const orderSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderItems: [orderItemSchema], //Array of items in the order
        shippindAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['COD', "Credit Card", "PayPal", "UPI"],
            default: "COD",
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Pending',
            required: true
        },
        totalPrice : {
            type: Number,
            required: true,
            min: 0
        },
        orderStatus: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered' ,'Pending', 'Cancelled'],
            default: 'Processing'
        },
        orderDate: {
            type: Date,
            default: Date.now()
        },

},{timestamps: true});

export default mongoose.model("Order", orderSchema);