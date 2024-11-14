import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    phoneNumber: {
        type: String, 
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        unique: true,
        sparse: true // This ensures uniqueness only for non-null values
    },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId
    },

}) 

export default mongoose.model("Profile", profileSchema);