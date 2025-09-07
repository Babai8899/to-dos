import NoteCounterModel from "../models/NoteCounter.js";
import NoteModel from "../models/NoteModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const getNotes = async (req, res) => {
    try {
        const notes = await NoteModel.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getNoteById = async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await NoteModel.findOne({ noteId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateNoteById = async (req, res) => {
    const { noteId } = req.params;
    const { title, description, createdOn } = req.body;
    try {
        const note = await NoteModel.findOneAndUpdate({ noteId }, { title, description, createdOn }, { new: true });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteNoteById = async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await NoteModel.findOneAndDelete({ noteId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getNotesByEmailId = async (req, res) => {
    const { emailId } = req.params;
    try {
        const notes = await NoteModel.find({ user: emailId });
        // Prepare CSV data
        const csvHeader = 'noteId,title,description,createdOn,user\n';
        const csvRows = notes.map(note => `${note.noteId},${note.title},${note.description},${note.createdOn},${note.user}`).join('\n');
        const csvContent = csvHeader + csvRows;
        // Write CSV to resources folder
        const filePath = path.join(__dirname, '../resources', `notes_${emailId}.csv`);
        fs.writeFileSync(filePath, csvContent);
        res.status(200).json({ message: 'CSV created', file: `resources/notes_${emailId}.csv`, notes });
    } catch (error) {
        console.error('Error fetching notes or writing CSV:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createNote,
    getNotes,
    getNoteById,
    updateNoteById,
    deleteNoteById,
    getNotesByEmailId
};
