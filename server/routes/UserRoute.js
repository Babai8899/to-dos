import { Router } from "express";

import { getUserByEmailId, updatePasswordByEmailId, updateDetailsByEmailId, upload, uploadProfileImage, getProfileImage } from "../controllers/UserController.js";

import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();

// router.use(authMiddleware); // Apply authentication middleware to all routes


// Authenticated profile image upload
router.post("/profile-image/:emailId", upload.single("profileImage"), uploadProfileImage);
router.get("/profile-image/:emailId", getProfileImage);

router.get("/:emailId", getUserByEmailId);
router.put("/details/:emailId", updateDetailsByEmailId);
router.put("/password/:emailId", updatePasswordByEmailId);

export default router;