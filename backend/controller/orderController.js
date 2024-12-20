import Product from '../models/product.js'
import Order from '../models/order.js';
import User from '../models/user.js';
import Address from '../models/address.js'
// Create a new order
export const createOrder = async(req, res) => {
    const { orderItems, shippingAddressId, paymentMethod } = req.body;
     
    try {
        const userId = req.user._id;

        //validate address
        const address = await Address.findById(shippingAddressId);;
        if(!address) {
            return res.status(400).json({ message: "Address is required" });
        }

        //Calculate total amount based on product prices
        let totalAmount = 0;
        for(const item of orderItems) {
            const product = await Product.findById(item.productId);
            if(!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock or has insufficient quantity` });
            }
            totalAmount += product.price * item.quantity;
        }
        // Create and save the new order
        const order = new Order({
            user : userId,
            orderItems,
            totalAmount, 
            shippingAddress: shippingAddressId,
            totalPrice,
        })
        await order.save();
        res.status(201).json({ message : "Order placed successfully", order : newOrder})
    } catch (error) {
        res.status(500).json({ message: "Order failed", error})
        console.error(error);
    }
}

// Get all orders for a user
export const getUserOrders = async(req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({ user : userId })
        .populate('orderItems.product', 'name price' )
        .populate('shippingAddress', 'houseName locality district state pinCode')
        .sort({ orderDate: -1 });

        if(orders.length === 0) {
            return res.status(200).json({ message: "No orders found" });
        }
        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ message: "Fetching orders failed", error });
        console.error(error);
    }
};

//Get order details by order ID

export const getOrderById = async(req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id)
        .populate('user', 'username email')
        .populate('orderItems.product', 'name price' )
        .populate('shippingAddress', 'houseName locality district state pinCode')
       

        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order fetched successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Fetching order details failed", error });
        console.error(error);
    }
};

// Update order status (Admin feature)

export const updateOrderStatus = async(req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    try {
        const order = await Order.findById(id);
        
        if(!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.orderStatus = orderStatus;

        if(orderStatus === "Delivered") {
            order.deliveredAt = new Date();
            order.paymentStatus = 'Paid'
        }

        await order.save();
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Updating order status failed", error });
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

// export const updateOrderStatus = async(req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     try {
//         const order = await Order.findByIdAndUpdate(
//             orderId, 
//             { status, updatedAt:Date.now() },
//             { new: true }); 
//         if(!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }
//         res.status(200).json({ message: "Order status updated successfully", order });
//     } catch (error) {
//         res.status(500).json({ message: "Updating order status failed", error });
//         console.error(error);
//     }
// };

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