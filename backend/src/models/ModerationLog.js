import mongoose from "mongoose";

const { Schema } = mongoose;

const ModerationLogSchema = new Schema(
    {
        action: {
            type: String,
            enum: ["ban", "unban", "delete-content", "restore-content", "close-question", "reopen-question"],
            required: true
        },
        moderator: { type: Schema.Types.ObjectId, ref: "User", required: true },
        targetUser: { type: Schema.Types.ObjectId, ref: "User" },
        targetContentType: { type: String, enum: ["question", "answer", "comment"] },
        targetContentId: { type: Schema.Types.ObjectId },
        reason: { type: String, trim: true, maxlength: 500 },
        metadata: { type: Schema.Types.Mixed }
    },
    {
        timestamps: true
    }
);

ModerationLogSchema.index({ moderator: 1, createdAt: -1 });
ModerationLogSchema.index({ targetUser: 1, createdAt: -1 });
ModerationLogSchema.index({ action: 1, createdAt: -1 });

export const ModerationLog = mongoose.model("ModerationLog", ModerationLogSchema);
