import createError from "http-errors";
import mongoose from "mongoose";
import { z } from "zod";
import { Comment } from "../models/Comment.js";
import { Question } from "../models/Question.js";
import { Answer } from "../models/Answer.js";
import { serializeComment } from "../utils/serializers.js";

const createCommentSchema = z.object({
  body: z.string().min(4).max(600)
});

export const commentController = {
  async listForQuestion(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const comments = await Comment.find({ question: questionId, answer: null })
        .sort({ createdAt: 1 })
        .populate("author", "name username avatarUrl reputation")
        .lean();

      res.json({ comments: comments.map((comment) => serializeComment(comment)) });
    } catch (error) {
      next(error);
    }
  },

  async createForQuestion(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const payload = createCommentSchema.parse(req.body);

      const question = await Question.findById(questionId);
      if (!question) {
        throw createError.NotFound("Question not found");
      }

      const comment = await Comment.create({
        question: questionId,
        author: req.user.id,
        body: payload.body
      });

      question.commentsCount += 1;
      question.lastActivityAt = new Date();
      await question.save();

      await comment.populate("author", "name username avatarUrl reputation");

      res.status(201).json({ comment: serializeComment(comment) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async listForAnswer(req, res, next) {
    try {
      const { questionId, answerId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId)) {
        throw createError.BadRequest("Invalid resource id");
      }

      const comments = await Comment.find({ question: questionId, answer: answerId })
        .sort({ createdAt: 1 })
        .populate("author", "name username avatarUrl reputation")
        .lean();

      res.json({ comments: comments.map((comment) => serializeComment(comment)) });
    } catch (error) {
      next(error);
    }
  },

  async createForAnswer(req, res, next) {
    try {
      const { questionId, answerId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId)) {
        throw createError.BadRequest("Invalid resource id");
      }

      const payload = createCommentSchema.parse(req.body);

      const [question, answer] = await Promise.all([
        Question.findById(questionId),
        Answer.findOne({ _id: answerId, question: questionId })
      ]);

      if (!question || !answer) {
        throw createError.NotFound("Question or answer not found");
      }

      const comment = await Comment.create({
        question: questionId,
        answer: answerId,
        author: req.user.id,
        body: payload.body
      });

      answer.commentsCount += 1;
      await answer.save();

      question.lastActivityAt = new Date();
      await question.save();

      await comment.populate("author", "name username avatarUrl reputation");

      res.status(201).json({ comment: serializeComment(comment) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { commentId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw createError.BadRequest("Invalid comment id");
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw createError.NotFound("Comment not found");
      }

      const isOwner = comment.author.toString() === req.user.id;
      if (!isOwner && req.user.role !== "admin") {
        throw createError.Forbidden("You cannot delete this comment");
      }

      await comment.deleteOne();

      if (comment.answer) {
        await Answer.findByIdAndUpdate(comment.answer, { $inc: { commentsCount: -1 } });
      } else {
        await Question.findByIdAndUpdate(comment.question, { $inc: { commentsCount: -1 } });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

