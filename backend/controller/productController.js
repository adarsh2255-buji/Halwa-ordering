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
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true});
        if(!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message:"Product updated successfully", updatedProduct})
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

// Get product by id

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Fetching product failed", error });
        console.error(error);
    }
};

// Add review
export const addReview = async(req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    try {
        const product = await Product.findById(productId); 
        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        //Check the user has already reviewed the product
        const exisitingReview = product.reviews.find((review) => review.userId.toString() === userId);
        if(exisitingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        // Add the new review
        const newReview = { userId, username : req.username, rating, comment};
        product.reviews.push(newReview);
        await product.save();
        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        res.status(500).json({ message: "Adding review failed", error });
        console.error(error);        
    }
}

// Update review

export const updateReview = async(req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    try {
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }

        // Find and update the user's review
        const review = product.reviews.find((r) => r.userId.toString() === userId);
        if(!review){
            return res.status(404).json({ message: "Review not found" });
        }
        review.rating = rating;
        review.comment = comment;
        review.updateAt = Date.now()
        await product.save();
        res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Updating review failed", error });
        console.error(error);
    }
};

// Delete review

export const deleteReview = async(req, res) => {
    const { productId } = req.params;
    const userId = req.userId;

    try {
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        const reviewIndex = product.reviews.findIndex((review) => review.userId.toString() === userId);
        if(reviewIndex === -1){
            return res.status(404).json({ message: "Review not found" });
        }
        product.reviews.splice(reviewIndex, 1);
        await product.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Deleting review failed", error });
        console.error(error);
    }
}

// Get product reviews

export const getProductReviews = async(req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId).select('reviews');
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json( {reviews: product.reviews});
    } catch (error) {
        res.status(500).json({ message: "Fetching reviews failed", error });
        console.error(error);
    }
}