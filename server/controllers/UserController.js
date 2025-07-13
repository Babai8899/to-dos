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

const updatePhoneByEmailId = async (req, res) => {
    
    const { emailId } = req.params;
    const { phone } = req.body;

    // Validate emailId and phone are not empty
    if (!emailId || !phone) {
        return res.status(400).json({ message: "Email ID and phone number are required" });
    }

    try {
        // Find user by emailId and update phone number
        const updatedUser = await UserModel.findOneAndUpdate(
            { emailId },
            { phone },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return updated user details excluding password
        const { password, ...userDetails } = updatedUser.toObject();
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error updating user phone:", error);
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

export {
    getUserByEmailId,
    updatePhoneByEmailId,
    updatePasswordByEmailId
};