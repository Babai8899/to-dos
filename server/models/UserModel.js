import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    anniversary: {
        type: Date,
        required: false
    },
    securityQuestion: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;