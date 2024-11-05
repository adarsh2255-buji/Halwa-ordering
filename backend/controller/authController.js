import user from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


// user signup
export const signup = async (req, res) => {
    const { email , password } = req.body;
    try {
        //check if user already exisiting by email
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create and save new user
        const newUser = new user({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error })
    }
}

// user login
 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the user exists
        const existingUser = await user.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set Token in http only cookies
        res.cookie('authToken', token, {
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

// Update profile

export const updateProfile = async (req, res) => {
    const { username, gender, address, email, phoneNumber } = req.body;
    const userId = req.userId;

    try {
        const updatedProfile = await user.findByIdAndUpdate(
            userId,
            { username, gender, address, email, phoneNumber },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: "Profile updated successfully", updatedProfile });
    } catch (error) {
        res.status(500).json({ message: "Update profile failed",error });
        console.error(error);
    }
};

//Get user profile

export const getUserProfile = async (req, res) => {
    const userId = req.userId;

    try {
        const userProfile = await user.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User profile fetched successfully", userProfile });
    } catch (error) {
        res.status(500).json({ message: "Get user profile failed", error });
        console.error(error);
    }
};

// Update password

export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId; // Assuming user ID is set after JWT authentication

    try {
        // Find the user by ID
        const userCheck = await user.findById(userId).select('+password');
        if (!userCheck) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, userCheck.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        userCheck.password = hashedNewPassword;
        await userCheck.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Password update failed", error });
        console.error(error)
    }
};

// logout

export const logout = (req, res) => {
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