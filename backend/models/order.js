import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', ],
        default: 'Pending'
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    paymentStatus: {
        tyep: String,
        enum: ["Pending", "Paid", "Failed"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model('Order', orderSchema);
export default Order; 