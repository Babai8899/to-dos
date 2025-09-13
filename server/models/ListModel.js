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
    items: [
        {
            itemName: { type: String, required: true },
            completed: { type: Boolean, default: false },
        },
    ],
    createdOn: {
        type: String,
        default: () => new Date().toLocaleString(),
    },
    lastEditedOn: {
        type: String,
        default: () => new Date().toLocaleString(),
    },
    user: {
        type: String,
        required: true,
    }
});

const ListModel = mongoose.model('List', listSchema);
export default ListModel;