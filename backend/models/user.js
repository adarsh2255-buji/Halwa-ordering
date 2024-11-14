import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        select: false, // Password is not returned in the response
    },
    profile : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
    ]
}) 

export default mongoose.model("User", userSchema);