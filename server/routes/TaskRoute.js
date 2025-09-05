import { Router } from "express";
import { createTask, getTasksByEmailId, getTaskById, getTasks, deleteTaskById, updateTaskById } from "../controllers/TaskController.js";

const router = Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:taskId', getTaskById);
router.put('/:taskId', updateTaskById);
router.delete('/:taskId', deleteTaskById);
router.get('/user/:emailId', getTasksByEmailId);

export default router