import Product from "../models/product.js";
import { imageUploadCloudinary } from "../utils/cloudinaryUpload.js";


// Add new product
export const addProduct = async (req, res) => {
    const { name, description, price, quantity, category } = req.body;
    

    try {
        let imageurl;

        // Upload image
        if(req.file) {
        imageurl = await imageUploadCloudinary(req.file.path);
        // console.log('Image uploaded to Cloudinary:', imageurl)
    }
    
    // Create new product
        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            category,
            image: imageurl || null
        })
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Creating product failed", error });
        console.error(error);
    }
}

//Update an exisiting product
export const updateProduct = async (req, res) => {
    const { id: productId } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true});
        if(!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message:"Product updated successfully"})
    } catch (error) {
        res.status(404).json({ message: "Product not found" });
    }
};

//Delete a product

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Deleting product failed", error });
        console.error(error);
    }
};

// Get all products

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Fetching products failed", error });
        console.error(error);
    }
};