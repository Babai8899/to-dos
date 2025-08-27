import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    noteId: {
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
        required: true,
        trim: true,
    },
    createdOn: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    }
});

const NoteModel = mongoose.model("Note", noteSchema);

export default NoteModel;
