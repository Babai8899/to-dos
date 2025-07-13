import { Router } from "express";

import { login, refresh, register, logout } from "../controllers/AuthController.js";

const router = Router();

router.post("/register", register);
router.post("/", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;