import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", requireAuth, authController.me);

export const authRouter = router;

