import { Router } from "express";
import { createNote, getNotes, getNoteById, updateNoteById, deleteNoteById, getNotesByEmailId } from "../controllers/NoteController.js";

const router = Router();

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:noteId', getNoteById);
router.put('/:noteId', updateNoteById);
router.delete('/:noteId', deleteNoteById);
router.get('/:emailId', getNotesByEmailId);

export default router;
