import Admin from "../models/admin.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createAdmin = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        //check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if(existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        };
        
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //create and save new admin
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();
        
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error });
        console.error(error);
    }
}

//Admin login
export const adminLogin = async(req, res) => {
    const { email, password } = req.body;

    try {
        //check if admin exists
        const admin = await Admin.findOne({ email });
        if(!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        
        //check if password matches
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        //generate JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //Set token in http only cookies
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: true, // Set to true for HTTPS only
            maxAge: 60 * 60 * 1000 // 1 hour
        })
        
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
        console.error(error);
    }
}
// Admin logout
export const adminLogout = (req, res) => {
    try {
        res.cookie('token', "", {
            expires: new Date(0),
            httpOnly: true,
            secure: true, // Set to true for HTTPS only
        })
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error });
        console.error(error);
    }
}