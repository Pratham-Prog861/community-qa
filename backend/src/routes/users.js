import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getMe, updateMe, getUserById } from "../controllers/userController.js";

const router = Router();

// Get current user profile
router.get("/me", requireAuth, getMe);

// Update current user profile
router.patch("/me", requireAuth, updateMe);

// Get user by ID (public profile)
router.get("/:userId", getUserById);

export default router;
