import Order from '../models/order.js'
import Product from '../models/product.js'
// Get total sales and revenue
export const getTotalSales = async (req, res) => {
    try {
        const orders = await Order.find({});
        const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
        res.status(200).json({ message: "Total Sales", totalSales, totalOrders : orders.length });
    } catch (error) {
        res.status(500).json({ message: "Fetching total sales failed", error });
        console.error(error);
    }
}// Get most popular products based on order frequency

export const getMostPopularProducts = async (req, res) => {
    try {
        const orders = await Order.find({});
        const productCount = {};

        orders.forEach(order => {
            order.products.forEach(product => {
                if(productCount[product.productId]) {
                    productCount[product.productId] += product.quantity;
                } else {
                    productCount[product.productId] = product.quantity;
                }
            });
        });

        const sortedProducts = Object.entries(productCount)
        .sort(([, a], [,b]) => b -a)
        .slice(0, 5)
        .map(([productId, count]) => ({ productId, count }));

        const popularProducts = await Product.find({ _id: { $in: sortedProducts.map(p => p.productId) } });
        res.status(200).json({ message: "Most Popular Products", popularProducts });
    } catch (error) {
        res.status(500).json({ message: "Fetching most popular products failed", error });
        console.error(error);      
    }
}

// Get sales for a specific product

export const getProductSales = async (req, res) => {
    const { productId } = req.params;

    try {
        const orders = await Order.find({ products: { $elemMatch: { productId } } });
        const totalSales = orders.reduce((total, order) => total + order.products.find(p => p.productId.toString() === productId).quantity * p.price, 0);
        res.status(200).json({ message: "Product Sales", totalSales });
    } catch (error) {
        res.status(500).json({ message: "Fetching product sales failed", error });
        console.error(error);      
    }
}

// Get sales for a specific date range

export const getSalesByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const orders = await Order.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
        res.status(200).json({ message: "Sales By Date Range", totalSales, totalOrders: orders.length });
    } catch (error) {
        res.status(500).json({ message: "Fetching sales by date range failed", error });
        console.error(error);
    }
}