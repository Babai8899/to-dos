import { Router } from "express";

import { getUserByEmailId, updatePasswordByEmailId, updatePhoneByEmailId, upload, uploadProfileImage } from "../controllers/UserController.js";

import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();

// router.use(authMiddleware); // Apply authentication middleware to all routes


// Authenticated profile image upload
router.post("/profile-image/:emailId", upload.single("profileImage"), uploadProfileImage);

router.get("/:emailId", getUserByEmailId);
router.put("/phone/:emailId", updatePhoneByEmailId);
router.put("/password/:emailId", updatePasswordByEmailId);

export default router;