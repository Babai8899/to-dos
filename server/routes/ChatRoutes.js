import { Router } from "express";
import { startChat, getChatHistoryByEmailId } from "../controllers/ChatController.js";

const router = Router();
// POST API for chat
router.post('/', startChat);
router.get('/history/:emailId', getChatHistoryByEmailId);

export default router;