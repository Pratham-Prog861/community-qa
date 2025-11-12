import createError from "http-errors";
import { z } from "zod";
import mongoose from "mongoose";
import { Question } from "../models/Question.js";
import { Answer } from "../models/Answer.js";
import { Comment } from "../models/Comment.js";
import { serializeAnswer, serializeComment, serializeQuestion } from "../utils/serializers.js";

const createQuestionSchema = z.object({
  title: z.string().min(8).max(160),
  body: z.string().min(16),
  tags: z.array(z.string().min(1)).max(8).optional()
});

const updateQuestionSchema = z.object({
  title: z.string().min(8).max(160).optional(),
  body: z.string().min(16).optional(),
  tags: z.array(z.string().min(1)).max(8).optional(),
  isClosed: z.boolean().optional()
});

function sanitizeTags(tags) {
  return (tags ?? [])
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag, index, arr) => !!tag && arr.indexOf(tag) === index)
    .slice(0, 8);
}

const SORT_MAP = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  votes: { voteScore: -1, createdAt: -1 },
  views: { viewCount: -1, createdAt: -1 },
  activity: { lastActivityAt: -1 }
};

export const questionController = {
  async create(req, res, next) {
    try {
      const payload = createQuestionSchema.parse(req.body);

      const question = await Question.create({
        title: payload.title,
        body: payload.body,
        tags: sanitizeTags(payload.tags),
        author: req.user.id
      });

      await question.populate("author", "name username avatarUrl reputation");

      res.status(201).json({ question: serializeQuestion(question) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async list(req, res, next) {
    try {
      const page = Math.max(parseInt(req.query.page ?? "1", 10) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit ?? "10", 10) || 10, 50);
      const search = (req.query.search ?? "").toString().trim();
      const tagsQuery = (req.query.tags ?? "").toString().trim();
      const sortKey = (req.query.sort ?? "newest").toString();

      const filter = {};
      if (search) {
        filter.$text = { $search: search };
      }

      if (tagsQuery) {
        const tags = tagsQuery
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean);
        if (tags.length) {
          filter.tags = { $all: tags };
        }
      }

      const sort = SORT_MAP[sortKey] ?? SORT_MAP.newest;

      const [items, total] = await Promise.all([
        Question.find(filter)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("author", "name username avatarUrl reputation")
          .lean(),
        Question.countDocuments(filter)
      ]);

      res.json({
        questions: items.map((question) => serializeQuestion(question)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async detail(req, res, next) {
    try {
      const { questionId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const question = await Question.findByIdAndUpdate(
        questionId,
        { $inc: { viewCount: 1 } },
        { new: true }
      )
        .populate("author", "name username avatarUrl reputation")
        .populate("acceptedAnswer")
        .lean();

      if (!question) {
        throw createError.NotFound("Question not found");
      }

      const [answers, comments] = await Promise.all([
        Answer.find({ question: questionId })
          .sort({ isAccepted: -1, voteScore: -1, createdAt: -1 })
          .populate("author", "name username avatarUrl reputation")
          .lean(),
        Comment.find({ question: questionId, answer: null })
          .sort({ createdAt: 1 })
          .populate("author", "name username avatarUrl reputation")
          .lean()
      ]);

      res.json({
        question: serializeQuestion(question),
        answers: answers.map((answer) => serializeAnswer(answer)),
        comments: comments.map((comment) => serializeComment(comment))
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const payload = updateQuestionSchema.parse(req.body);
      const question = await Question.findById(questionId);

      if (!question) {
        throw createError.NotFound("Question not found");
      }

      const isOwner = question.author.toString() === req.user.id;
      if (!isOwner && req.user.role !== "admin") {
        throw createError.Forbidden("You cannot update this question");
      }

      if (payload.title) question.title = payload.title;
      if (payload.body) question.body = payload.body;
      if (payload.tags) question.tags = sanitizeTags(payload.tags);
      if (payload.isClosed !== undefined) question.isClosed = payload.isClosed;
      question.lastActivityAt = new Date();

      await question.save();

      await question.populate("author", "name username avatarUrl reputation");

      res.json({ question: serializeQuestion(question) });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError.BadRequest(error.errors[0].message));
      }
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { questionId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        throw createError.BadRequest("Invalid question id");
      }

      const question = await Question.findById(questionId);
      if (!question) {
        throw createError.NotFound("Question not found");
      }

      const isOwner = question.author.toString() === req.user.id;
      if (!isOwner && req.user.role !== "admin") {
        throw createError.Forbidden("You cannot delete this question");
      }

      await Promise.all([
        Answer.deleteMany({ question: questionId }),
        Comment.deleteMany({ question: questionId })
      ]);

      await question.deleteOne();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

