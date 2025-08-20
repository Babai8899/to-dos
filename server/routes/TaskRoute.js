import { Router } from "express";
import { createTask } from "../controllers/TaskController.js";

const router = Router();

router.post('/', createTask);

export default router