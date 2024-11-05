import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
        match: /^\+?\d{1,15}$/,
        unique: true
    },
    address: {
        type: String,
        trim: true
    },
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
        validate: {
            validator: function (value) {
                // Regex for minimum 8 characters, at least one digit, and one special character
                return /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
            },
            message: 'Password must be at least 8 characters long and include at least one number and one special character.'
        }
    }
})

export default mongoose.model("User", userSchema);