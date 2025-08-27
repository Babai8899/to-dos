import { Router } from "express";
import { createNote } from "../controllers/NoteController.js";

const router = Router();

router.post('/', createNote);

export default router;
