import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    username: {
        type: String,
        match: /^[a-zA-Z0-9]+$/,
        minlength: 3,
        maxlength: 30,
        trim: true, // Removes leading and trailing whitespaces
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    phone: {
        type: String, 
        match: /^\+?\d{1,15}$/,
        unique: true,
        sparse: true // This ensures uniqueness only for non-null values
    },
    address: {
        type: String,
        trim: true
    },

}) 

export default mongoose.model("Profile", profileSchema);