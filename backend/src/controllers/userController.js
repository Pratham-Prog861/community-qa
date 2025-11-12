import createError from "http-errors";
import { User } from "../models/User.js";

export async function getMe(req, res, next) {
    try {
        const user = await User.findById(req.user.id)
            .select("-passwordHash -refreshTokens")
            .lean();

        if (!user) {
            throw createError.NotFound("User not found");
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
}

export async function updateMe(req, res, next) {
    try {
        const { name, bio, avatarUrl } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            throw createError.NotFound("User not found");
        }

        // Update allowed fields
        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        // Return updated user without sensitive fields
        const updatedUser = await User.findById(user._id)
            .select("-passwordHash -refreshTokens")
            .lean();

        res.json({ user: updatedUser });
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req, res, next) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select("-passwordHash -refreshTokens -email")
            .lean();

        if (!user) {
            throw createError.NotFound("User not found");
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
}
