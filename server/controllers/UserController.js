import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

const getUserByEmailId = async (req, res) => {
    const { emailId } = req.params;

    // Validate emailId is not empty
    if (!emailId) {
        return res.status(400).json({ message: "Email ID is required" });
    }

    try {
        // Find user by emailId
        const user = await UserModel.findOne({ emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user details excluding password
        const { password, ...userDetails } = user.toObject();
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateDetailsByEmailId = async (req, res) => {
    const { emailId } = req.params;
    const { phone, anniversaryDate } = req.body;

    // Validate emailId is not empty and at least one field to update is provided
    if (!emailId || (!phone && !anniversaryDate)) {
        return res.status(400).json({ message: "Email ID and at least one field (phone or anniversaryDate) is required" });
    }

    // Build update object dynamically
    const updateFields = {};
    if (phone) updateFields.phone = phone;
    if (anniversaryDate) updateFields.anniversaryDate = anniversaryDate;

    try {
        // Find user by emailId and update provided fields
        const updatedUser = await UserModel.findOneAndUpdate(
            { emailId },
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return updated user details excluding password
        const { password, ...userDetails } = updatedUser.toObject();
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updatePasswordByEmailId = async (req, res) => {
    const { emailId } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Validate emailId, oldPassword, and newPassword are not empty
    if (!emailId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Email ID, old password, and new password are required" });
    }

    try {
        // Find user by emailId
        const user = await UserModel.findOne({ emailId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided old password with the hashed password in the database
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: "Invalid old password" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

import multer from "multer";

// Multer setup for single image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.params.emailId;
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }
        const user = await UserModel.findOne({ emailId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.profileImage = req.file.buffer;
        await user.save();
        res.status(200).json({ message: "Profile image uploaded successfully" });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProfileImage = async (req, res) => {
    try {
        const userId = req.params.emailId;
        const user = await UserModel.findOne({ emailId: userId });
        if (!user || !user.profileImage) {
            return res.status(404).json({ message: "Profile image not found" });
        }
        res.set("Content-Type", "image/jpeg");
        res.send(user.profileImage);
    } catch (error) {
        console.error("Error fetching profile image:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
    getUserByEmailId,
    updateDetailsByEmailId,
    updatePasswordByEmailId,
    upload,
    uploadProfileImage,
    getProfileImage
};