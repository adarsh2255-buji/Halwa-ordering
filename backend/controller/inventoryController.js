import Product from "../models/product.js";

//Get all product with stock info
export const getAllInventory = async (req, res) => {
    try {
        const products = await Product.find({}, 'name quantity price');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Fetching inventory failed", error });
        console.error(error);
    }
}

// Update stock for a specific product or restocking

export const updateStock = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.quantity += quantity;

        await product.save();

        res.status(200).json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Updating stock failed", error });
        console.error(error);
    }
}

// Check stock availability before placing an order

export const checkStock = async (req, res, next) => {
    const { products } = req.body;

    try {
        for(const item of products) {
            const product = await Product.findById(item.productId);
            if(!product || product.quantity < item.quantity) {
                return res.status(404).json({ message: `Product ${product.name} is out of stock or has insufficient quantity` });
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Checking stock failed", error });
        console.error(error);        
    }
}