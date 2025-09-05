import { Router } from "express";
import { startChat, getChatHistory } from "../controllers/ChatController.js";

const router = Router();
// POST API for chat
router.post('/', startChat);
router.get('/history', getChatHistory);

export default router;