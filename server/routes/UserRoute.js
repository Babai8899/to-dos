import { Router } from "express";

import { getUserByEmailId, updatePasswordByEmailId, updatePhoneByEmailId } from "../controllers/UserController.js";

import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();

router.use(authMiddleware); // Apply authentication middleware to all routes

router.get("/:emailId", getUserByEmailId);
router.put("/phone/:emailId", updatePhoneByEmailId);
router.put("/password/:emailId", updatePasswordByEmailId);

export default router;