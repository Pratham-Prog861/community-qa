import createError from "http-errors";
import { Flag } from "../models/Flag.js";
import { Question } from "../models/Question.js";
import { Answer } from "../models/Answer.js";
import { Comment } from "../models/Comment.js";

export async function createFlag(req, res, next) {
    try {
        const { contentType, contentId, reason, description } = req.body;

        if (!["question", "answer", "comment"].includes(contentType)) {
            throw createError.BadRequest("Invalid content type");
        }

        let content;
        if (contentType === "question") content = await Question.findById(contentId);
        else if (contentType === "answer") content = await Answer.findById(contentId);
        else content = await Comment.findById(contentId);

        if (!content) {
            throw createError.NotFound(`${contentType} not found`);
        }

        const existingFlag = await Flag.findOne({
            contentType,
            contentId,
            reporter: req.user.id,
            status: "pending"
        });

        if (existingFlag) {
            throw createError.BadRequest("You already flagged this content");
        }

        const flag = await Flag.create({
            contentType,
            contentId,
            reporter: req.user.id,
            reason,
            description
        });

        res.status(201).json({ flag });
    } catch (error) {
        next(error);
    }
}

export async function getFlags(req, res, next) {
    try {
        const { status = "pending", contentType, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (status) filter.status = status;
        if (contentType) filter.contentType = contentType;

        const [flags, total] = await Promise.all([
            Flag.find(filter)
                .populate("reporter", "username email")
                .populate("reviewedBy", "username")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Flag.countDocuments(filter)
        ]);

        res.json({
            flags,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
}

export async function reviewFlag(req, res, next) {
    try {
        const { flagId } = req.params;
        const { status, reviewNote } = req.body;

        if (!["reviewed", "resolved", "dismissed"].includes(status)) {
            throw createError.BadRequest("Invalid status");
        }

        const flag = await Flag.findById(flagId);
        if (!flag) {
            throw createError.NotFound("Flag not found");
        }

        flag.status = status;
        flag.reviewedBy = req.user.id;
        flag.reviewedAt = new Date();
        if (reviewNote) flag.reviewNote = reviewNote;

        await flag.save();

        res.json({ flag });
    } catch (error) {
        next(error);
    }
}
