import NoteModel from "../models/NoteModel.js";
import NoteCounterModel from "../models/NoteCounter.js";

const createNote = async (req, res) => {
    const { title, description, createdOn, user } = req.body;
    // Validate required fields
    if (!title || !description || !user) {
        return res.status(400).json({ message: "Title, description, and user are required" });
    }
    // Set createdOn to today's date if not provided
    const today = new Date().toISOString().split('T')[0];
    const noteCreatedOn = createdOn ? createdOn : today;
    // Auto-generate noteId as NOTE001 using NoteCounter
    let noteId;
    try {
        const counter = await NoteCounterModel.findOneAndUpdate(
            { noteId: "NOTE001" },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        noteId = `NOTE${String(counter.count).padStart(3, '0')}`;
    } catch (error) {
        console.error("Error generating note ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    // Validate noteCreatedOn is a valid date
    const noteDate = new Date(noteCreatedOn);
    if (isNaN(noteDate.getTime())) {
        return res.status(400).json({ message: "createdOn must be a valid date" });
    }
    try {
        const newNote = new NoteModel({
            noteId,
            title,
            description,
            createdOn: noteCreatedOn,
            user
        });
        await newNote.save();
        return res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    createNote
};
