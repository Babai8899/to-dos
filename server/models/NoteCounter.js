import mongoose from "mongoose";

const noteCounterSchema = new mongoose.Schema({
    noteId: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    }
});

const NoteCounterModel = mongoose.model("NoteCounter", noteCounterSchema);
export default NoteCounterModel;