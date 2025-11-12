import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { questionController } from "../controllers/questionController.js";
import { answerController } from "../controllers/answerController.js";
import { commentController } from "../controllers/commentController.js";

const router = Router();

router
  .route("/")
  .get(questionController.list)
  .post(requireAuth, questionController.create);

router
  .route("/:questionId")
  .get(questionController.detail)
  .patch(requireAuth, questionController.update)
  .delete(requireAuth, questionController.remove);

router
  .route("/:questionId/answers")
  .get(answerController.list)
  .post(requireAuth, answerController.create);

router
  .route("/:questionId/answers/:answerId")
  .patch(requireAuth, answerController.update)
  .delete(requireAuth, answerController.remove);

router.post("/:questionId/answers/:answerId/accept", requireAuth, answerController.accept);

router
  .route("/:questionId/comments")
  .get(commentController.listForQuestion)
  .post(requireAuth, commentController.createForQuestion);

router
  .route("/:questionId/answers/:answerId/comments")
  .get(commentController.listForAnswer)
  .post(requireAuth, commentController.createForAnswer);

router.delete("/comments/:commentId", requireAuth, commentController.remove);

export const questionRouter = router;

