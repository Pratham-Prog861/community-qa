import createError from "http-errors";
import { User } from "../models/User.js";
import { ModerationLog } from "../models/ModerationLog.js";
import { Question } from "../models/Question.js";
import { Answer } from "../models/Answer.js";
import { Comment } from "../models/Comment.js";

export async function banUser(req, res, next) {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            throw createError.NotFound("User not found");
        }

        if (user.role === "admin") {
            throw createError.BadRequest("Cannot ban admin users");
        }

        user.isBanned = true;
        await user.save();

        await ModerationLog.create({
            action: "ban",
            moderator: req.user.id,
            targetUser: userId,
            reason
        });

        res.json({ message: "User banned successfully", user });
    } catch (error) {
        next(error);
    }
}

export async function unbanUser(req, res, next) {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            throw createError.NotFound("User not found");
        }

        user.isBanned = false;
        await user.save();

        await ModerationLog.create({
            action: "unban",
            moderator: req.user.id,
            targetUser: userId,
            reason
        });

        res.json({ message: "User unbanned successfully", user });
    } catch (error) {
        next(error);
    }
}

export async function deleteContent(req, res, next) {
    try {
        const { contentType, contentId } = req.params;
        const { reason } = req.body;

        let content;
        if (contentType === "question") {
            content = await Question.findByIdAndDelete(contentId);
        } else if (contentType === "answer") {
            content = await Answer.findByIdAndDelete(contentId);
        } else if (contentType === "comment") {
            content = await Comment.findByIdAndDelete(contentId);
        } else {
            throw createError.BadRequest("Invalid content type");
        }

        if (!content) {
            throw createError.NotFound(`${contentType} not found`);
        }

        await ModerationLog.create({
            action: "delete-content",
            moderator: req.user.id,
            targetContentType: contentType,
            targetContentId: contentId,
            reason,
            metadata: { deletedContent: content }
        });

        res.json({ message: `${contentType} deleted successfully` });
    } catch (error) {
        next(error);
    }
}

export async function getModerationLogs(req, res, next) {
    try {
        const { action, moderator, targetUser, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (action) filter.action = action;
        if (moderator) filter.moderator = moderator;
        if (targetUser) filter.targetUser = targetUser;

        const [logs, total] = await Promise.all([
            ModerationLog.find(filter)
                .populate("moderator", "username email")
                .populate("targetUser", "username email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            ModerationLog.countDocuments(filter)
        ]);

        res.json({
            logs,
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

export async function getUsers(req, res, next) {
    try {
        const { search, role, isBanned, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } }
            ];
        }
        if (role) filter.role = role;
        if (isBanned !== undefined) filter.isBanned = isBanned === "true";

        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-passwordHash -refreshTokens")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            User.countDocuments(filter)
        ]);

        res.json({
            users,
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
