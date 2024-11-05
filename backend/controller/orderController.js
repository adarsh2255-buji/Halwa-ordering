import { response } from 'express';
import Product from '../models/product.js'
import Order from '../models/order.js';
import User from '../models/user.js';

// Create a new order
export const createOrder = async(req, res) => {
    const { products } = req.body;
    const userId = req.userId; 

    try {
        // Fetch user details to get address and phone number
        const user = await User.findById(userId);
        if(!user) {
            return res.status(401).json({ message: "user not found" });
        }
        const { phoneNumber, address } = user;
        if(!phoneNumber ||!address) {
            return res.status(400).json({ message: "Address and phone number are required" });
        }

        //Calculate total amount based on product prices
        let totalAmount = 0;
        for(const item of products) {
            const product = await Product.findById(item.productId);
            if(!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            totalAmount += product.price * item.quantity;
        }

        // Create and save the new order
        const newOrder = new Order({
            userId,
            products,
            totalAmount, 
            address,
            phoneNumber,
            status: 'Pending',
            paymentStatus: "Pending",
        })
        await newOrder.save();
        res.status(201).json({ message : "Order placed successfully", order : newOrder})
    } catch (error) {
        res.status(500).json({ message: "Order failed", error})
        console.error(error);
    }
}

// Get user orders
export const getUserOrders = async(req, res) => {
    const userId = req.userId;

    try {
        const orders = await Order.find({ userId }).populate('products.productId', 'name price' );
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Fetching orders failed", error });
        console.error(error);
    }
};

// Cancel order
export const cancelOrder = async(req, res) => {
    const { orderId } = req.params;
    const userId = req.userId;

    try {
        // find the order by id and make sure it belongs to the user
        const order = await Order.findOne({ _id: orderId, userId });
        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        //check if the order is already in a final state
        if(order.status === 'Cancelled' || order.status === 'Completed') {
            return res.status(400).json({ message: "Order cannot be cancelled" });
        }

        // update the order status to cancelled
        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Cancelling order failed", error });
        console.error(error);
    }
};

// Update order status (admin)

export const updateOrderStatus = async(req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status, updatedAt:Date.now() },
            { new: true }); 
        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Updating order status failed", error });
        console.error(error);
    }
};

//get all orders (Admin only)

export const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find().populate('userId', "email").populate('products.productId', 'name price' );
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Fetching orders failed", error });
        console.error(error);
    }
};