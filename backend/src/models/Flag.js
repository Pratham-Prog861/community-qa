import mongoose from "mongoose";

const { Schema } = mongoose;

const FlagSchema = new Schema(
    {
        contentType: { type: String, enum: ["question", "answer", "comment"], required: true },
        contentId: { type: Schema.Types.ObjectId, required: true },
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: {
            type: String,
            enum: ["spam", "offensive", "low-quality", "duplicate", "off-topic", "other"],
            required: true
        },
        description: { type: String, trim: true, maxlength: 500 },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending"
        },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewedAt: { type: Date },
        reviewNote: { type: String, trim: true, maxlength: 500 }
    },
    {
        timestamps: true
    }
);

FlagSchema.index({ contentType: 1, contentId: 1 });
FlagSchema.index({ status: 1, createdAt: -1 });
FlagSchema.index({ reporter: 1 });

export const Flag = mongoose.model("Flag", FlagSchema);
