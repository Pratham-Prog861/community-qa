import createError from "http-errors";
import mongoose from "mongoose";
import { z } from "zod";
import { Answer } from "../models/Answer.js";
import { Question } from "../models/Question.js";
import { Comment } from "../models/Comment.js";
import { serializeAnswer } from "../utils/serializers.js";

const createAnswerSchema = z.object({
  body: z.string().min(16)
});

const updateAnswerSchema = z.object({
  body: z.string().min(16).optional()
});

export const answerController = {
  async list(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const answers = await Answer.find({ question: questionId })
        .sort({ isAccepted: -1, voteScore: -1, createdAt: -1 })
        .populate("author", "name username avatarUrl reputation")
        .lean();

      res.json({ answers: answers.map((answer) => serializeAnswer(answer)) });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const payload = createAnswerSchema.parse(req.body);

      const question = await Question.findById(questionId);
      if (!question) {
        throw createError.NotFound("Question not found");
      }
      if (question.isClosed) {
        throw createError.Conflict("Question has been closed");
      }

      const answer = await Answer.create({
        question: questionId,
        author: req.user.id,
        body: payload.body
      });

      question.answersCount += 1;
      question.lastActivityAt = new Date();
      await question.save();

      await answer.populate("author", "name username avatarUrl reputation");

      res.status(201).json({ answer: serializeAnswer(answer) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { answerId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(answerId)) {
        throw createError.BadRequest("Invalid answer id");
      }

      const payload = updateAnswerSchema.parse(req.body);

      const answer = await Answer.findById(answerId);
      if (!answer) {
        throw createError.NotFound("Answer not found");
      }

      const isOwner = answer.author.toString() === req.user.id;
      if (!isOwner && req.user.role !== "admin") {
        throw createError.Forbidden("You cannot update this answer");
      }

      if (payload.body) {
        answer.body = payload.body;
      }

      await answer.save();
      await answer.populate("author", "name username avatarUrl reputation");

      await Question.findByIdAndUpdate(answer.question, {
        lastActivityAt: new Date()
      });

      res.json({ answer: serializeAnswer(answer) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { questionId, answerId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId)) {
        throw createError.BadRequest("Invalid resource id");
      }

      const answer = await Answer.findOne({ _id: answerId, question: questionId });
      if (!answer) {
        throw createError.NotFound("Answer not found");
      }

      const question = await Question.findById(questionId);
      if (!question) {
        throw createError.NotFound("Question not found");
      }

      const isOwner = answer.author.toString() === req.user.id;
      const isQuestionOwner = question.author.toString() === req.user.id;
      if (!isOwner && !isQuestionOwner && req.user.role !== "admin") {
        throw createError.Forbidden("You cannot delete this answer");
      }

      const updates = [
        answer.deleteOne(),
        Comment.deleteMany({ answer: answerId }),
        Question.findByIdAndUpdate(questionId, {
          $inc: { answersCount: -1 },
          lastActivityAt: new Date()
        })
      ];

      if (question.acceptedAnswer?.toString() === answerId) {
        updates.push(
          Question.findByIdAndUpdate(questionId, {
            $unset: { acceptedAnswer: "" }
          })
        );
      }

      await Promise.all(updates);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async accept(req, res, next) {
    try {
      const { questionId, answerId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(answerId)) {
        throw createError.BadRequest("Invalid resource id");
      }

      const [question, answer] = await Promise.all([
        Question.findById(questionId),
        Answer.findOne({ _id: answerId, question: questionId })
      ]);

      if (!question || !answer) {
        throw createError.NotFound("Question or answer not found");
      }

      const isOwner = question.author.toString() === req.user.id;
      if (!isOwner && req.user.role !== "admin") {
        throw createError.Forbidden("Only the question author can mark an answer as accepted");
      }

      await Answer.updateMany(
        { question: questionId },
        { $set: { isAccepted: false } }
      );

      answer.isAccepted = true;
      await answer.save();

      question.acceptedAnswer = answer._id;
      question.lastActivityAt = new Date();
      await question.save();

      await answer.populate("author", "name username avatarUrl reputation");

      res.json({ answer: serializeAnswer(answer) });
    } catch (error) {
      next(error);
    }
  }
};

