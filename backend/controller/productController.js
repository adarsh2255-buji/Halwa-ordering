import Product from "../models/product.js";
import { imageUploadCloudinary } from "../utils/cloudinaryUpload";


// Add new product
export const addProduct = async (req, res) => {
    const { name, description, price, quantity, category } = req.body;
    let imageurl;

    // Upload image

    if(req.file) {
        imageurl = await imageUploadCloudinary(req.file.path);
        console.log('Image uploaded to Cloudinary:', imageurl)
    }

    try {
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