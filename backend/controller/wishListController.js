import User from "../models/user";

//Add to wishlist for user
export const addToWishlist = async (req, res) => {
    const userId = req.userId;
    const { productId } = req.body;

    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        //Check if the product has already been added
        if(user.wishlist.includes(productId)){
            return res.status(400).json({ message: "Product already added to wishlist" });
        }

        //Add product to wishlist
        user.wishlist.push(productId);
        await user.save();
        res.status(201).json({ message: "Product added to wishlist successfully", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Adding product to wishlist failed", error });
        console.error(error);
        
    }
};

//Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    const userId = req.userId;
    const { productId } = req.body;

    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        //Remove product from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({ message: "Product removed successfully", wishlist: user.wishlist })
    } catch (error) {
        res.status(500).json({ message: "Removing product from wishlist failed", error });
        console.error(error);   
    }
};

//Get user wishlist
export const getWishlist = async (req, res) => {
    const userId = req.userId;

    try {
        //populate wishlist with product details
        const user = await User.findById(userId).populate('wishlist', 'title price imageUrl');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Fetching wishlist failed", error });
        console.error(error);
    }
}