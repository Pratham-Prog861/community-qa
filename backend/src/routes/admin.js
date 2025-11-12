import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import {
    banUser,
    unbanUser,
    deleteContent,
    getModerationLogs,
    getUsers
} from "../controllers/adminController.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.post("/users/:userId/ban", banUser);
router.post("/users/:userId/unban", unbanUser);
router.delete("/content/:contentType/:contentId", deleteContent);
router.get("/moderation-logs", getModerationLogs);
router.get("/users", getUsers);

export default router;
