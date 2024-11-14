import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    houseName : {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    pinCode: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6,
        match: /^[0-9]{6}$/
    },
    locality: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    district: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    state: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

export default mongoose.model("Address", addressSchema);