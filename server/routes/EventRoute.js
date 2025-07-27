import { Router } from "express";
import { createEvent } from "../controllers/EventContoller.js";

const router = Router();

router.post('/', createEvent);

export default router