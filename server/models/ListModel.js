import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
    listId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    items: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    user: {
        type: String,
        required: true,
    }
});