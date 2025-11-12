import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createFlag, getFlags, reviewFlag } from "../controllers/flagController.js";

const router = Router();

router.post("/", requireAuth, createFlag);
router.get("/", requireAuth, requireRole("admin"), getFlags);
router.patch("/:flagId/review", requireAuth, requireRole("admin"), reviewFlag);

export default router;
