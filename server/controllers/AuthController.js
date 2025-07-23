import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
// import dotenv from "dotenv";
// dotenv.config();

const register = async (req, res) => {
    const { emailId, password, firstName, lastName, phone, dob } = req.body;
    //validate emailId, password, firstName, lastName, phone, dob are not empty
    if (!emailId || !password || !firstName || !lastName || !phone || !dob) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //validate email as a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    //check if emailId already exists
    const existingUser = await UserModel.find({ emailId });
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email ID already exists" });
    }

    //validate password as lenght min 8 and max 20 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character" });
    }
    //validate firstName and lastName as only alphabets and length min 2 and max 30 characters
    const nameRegex = /^[A-Za-z]{2,30}$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ message: "First name and last name must be 2-30 characters long and contain only alphabets" });
    }
    //validate phone as 10 digit number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Phone number must be a 10-digit number" });
    }

    //validate dob as a valid date and not in the future
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime()) || dobDate > new Date())
        return res.status(400).json({ message: "Date of birth must be a valid date and not in the future" });


    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user instance
        const newUser = new UserModel({
            emailId,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            dob
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    const { emailId, password } = req.body;

    //validate emailId and password are not empty
    if (!emailId || !password) {
        return res.status(400).json({ message: "Email ID and password are required" });
    }

    try {
        const user = await UserModel.findOne({ emailId });
        if (!user) {
            return res.status(401).json({ message: "Invalid email ID" });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // generate JWT token
        const accessToken = jwt.sign({ user: user }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1m' });

        //generate refresh token
        const refreshToken = jwt.sign({ user: user }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1h' });

        // Set the refresh token in a cookie
        res.
        cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            sameSite: 'Strict', // Adjust as necessary for your application
            maxAge: 1 * 60 * 1000 // 1 minutes
        }).
        cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            sameSite: 'Strict', // Adjust as necessary for your application
            maxAge: 1 * 60 * 60 * 1000 // 1 hour
        });

        res.status(200).json({
            message: "Login successful",
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, expressAsyncHandler((err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "forbidden" });
            }
            const user = decoded.user;
            // Generate a new access token
            const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1m' });

            // Set the new access token in a cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true, // Use secure cookies in production
                sameSite: 'Strict', // Adjust as necessary for your application
                maxAge: 1 * 60 * 1000 // 1 minute
            });
            
            res.status(200).json({ message: "Access token refreshed successfully" });
        }));

    } catch (error) {
        console.error("Error refreshing access token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
}

const logout = (req, res) => {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "Logged out successfully" });
}

const getUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = decoded.user;
        //exclude password from user details
        user.password = undefined; // Remove password from user object
        // Return user details
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(403).json({ message: "Forbidden" });
    }
}
export {
    register,
    login,
    refresh,
    logout,
    getUser
};