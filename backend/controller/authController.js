import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import Profile from "../models/profile.js";
import Address from "../models/address.js";



// user signup
export const signup = async (req, res) => {
    const { email , password } = req.body;
    try {
        //check if user already exisiting by email
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create and save new user
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error })
        console.error(error);
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
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Set Token in http only cookies
        res.cookie('token', token, {
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

// Add profile data
export const addProfileData = async (req, res) => {
    const { username, gender, addressDetails, phoneNumber } = req.body;
    
    try {
        const userId = req.user._id;

        // Check if the user already has a profile
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists" });
        }

        // Create address document
        const newAddress = new Address({
            ...addressDetails,
            user: userId
        });
        await newAddress.save();

        // Create profile document
        const newProfile = new Profile({
            username,
            gender,
            email: userId,
            address: newAddress._id,
            phoneNumber,
            userId
        })
        await newProfile.save();

        // Update the user with profile and address references
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { profile: newProfile._id},
            { new:true }
        ).populate('profile').populate({
            path: 'profile',
            populate: { path: 'address'}
        });
        res.status(200).json({ message: "Profile added successfully", user });
    } catch (error) { 
        res.status(500).json({ message: "Add profile data failed", error });
        console.error(error);
    }
}

// Get profile with user and address

export const getUserWithProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
        .populate({
            path:'profile',
            populate: { path: 'address'}
        });
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Get user with profile failed", error });
        console.error(error);
    }
}

// update user profile
export const updateProfileData = async(req, res) => {
    const { username, gender, addressDetails, phoneNumber } = req.body;

    try {
        const userId = req.user._id;

        //Find users's profile
        const profile = await Profile.findOneAndUpdate(
            { userId },
            { username, gender, phoneNumber },
            { new: true}
        );
        if(!profile) {
            return res.status(404).josn({ message: "Profile not found"});
        }

        // update the address if it exists
        const address = await Address.findOneAndUpdate(
            { user : userId},
            {...addressDetails},
            { new : true}
        );

        if(!address) {
            return res.status(404).json({ message: "Address not found"});
        }

        res.status(200).json({ message: "updated",
            profile: { ...profile.toObject(), address}
        })
        
    } catch (error) {
        res.status(500).json({ message: "Update profile data failed", error });
        console.error(error);
    }
}

//Get user address
export const getUserAddress = async (req, res) => {
    try {
        const userId = req.user._id
        //Find the user and populate the address
        const user = await User.findById(userId).populate('profile');

        if(!user || !user.profile || !user.profile.address) {
            return res.status(404).json({ message: "User not found or address not found" });
        }

        //Retrieve the addres details
        const address = await Address.findById(user.profile.address);
        if(!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json({ message: "Address fetched successfully", address });
    } catch (error) {
        res.status(500).json({ message: "Get user address failed", error });
        console.error(error);
    }
}

//Address update
export const updateAddressData = async (req, res) => {
    const { houseName, pinCode, locality, district, state } = req.body;
    const userId = req.user._id;
  
    try {
      // Update address for the user
      const updatedAddress = await Address.findOneAndUpdate(
        { user: userId },
        { houseName, pinCode, locality, district, state },
        { new: true }
      );
  
      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
  
      res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
      res.status(500).json({ message: "Failed to update address", error });
    }
  };
  
//Get user 
export const getUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const singleUser = await User.findOne({userId}).populate('Profile');
        if (!singleUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User fetched successfully", singleUser });
    } catch (error) {
        res.status(500).json({ message: "Get user failed", error });
        console.error(error);
    }
};

// Update profile

// export const updateProfile = async (req, res) => {
//     const userId = req.userId;
//     const { username, gender, address, phoneNumber } = req.body;

//     try {
//         const updatedProfile = await Profile.findByIdAndUpdate(
//             {userId},
//             { username, gender, address, phoneNumber },
//             { new: true, runValidators: true }
//         );
//         if (!updatedProfile) {
//             return res.status(404).json({ message: "Profile not found" });
//         }
//         res.status(200).json({ message: "Profile updated successfully", updatedProfile });
//     } catch (error) {
//         res.status(500).json({ message: "Update profile failed",error });
//         console.error(error);
//     }
// };

//Get user profile

// export const getUserProfile = async (req, res) => {
//     const userId = req.userId;

//     try {
//         const userProfile = await user.findById(userId);
//         if (!userProfile) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({ message: "User profile fetched successfully", userProfile });
//     } catch (error) {
//         res.status(500).json({ message: "Get user profile failed", error });
//         console.error(error);
//     }
// };

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

// To create or update a user profile

export const createOrUpdateProfile = async (req, res) => {


    try {
        const { username, gender, phone, address } = req.body;

       // Ensure userId is populated from the authenticated user's session
        const userId = req.user._id;// Retrieve userId from request, 

        const profile = await Profile.findOne({ userId });
        if(profile){
            // Update profile if it already exists
            profile.username = username;
            profile.gender = gender;
            profile.phone = phone;
            profile.address = address;
            await profile.save();
            res.status(200).json({ message: "Profile updated successfully", profile });
        } else {
            // Create new profile if it doesn't exist
            const newProfile = new Profile({ userId, username, gender, phone, address });
            await newProfile.save();
            res.status(201).json({ message: "Profile created successfully", profile });
        }
    } catch (error) {
        res.status(500).json({ message: "Profile creation failed", error });
        console.error(error);
    }
} 

// To get a user profile by userID

export const getUserProfileById = async (req, res) => {

    try {
        const userId = req.user._id;
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User profile fetched successfully", profile });
    } catch (error) {
        res.status(500).json({ message: "Get user profile failed", error });
        console.error(error);
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