import { Router } from "express";
import { healthRouter } from "./system/health.js";
import { authRouter } from "./auth.js";
import { questionRouter } from "./questions.js";
import adminRouter from "./admin.js";
import flagRouter from "./flags.js";
import userRouter from "./users.js";

export function registerRoutes(app) {
  const router = Router();

  router.use("/health", healthRouter);
  router.use("/auth", authRouter);
  router.use("/questions", questionRouter);
  router.use("/admin", adminRouter);
  router.use("/flags", flagRouter);
  router.use("/users", userRouter);

  app.use("/api", router);
}

