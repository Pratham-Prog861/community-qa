import mongoose from "mongoose";

const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        tags
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag, index, arr) => tag && arr.indexOf(tag) === index)
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voteScore: { type: Number, default: 0 },
    answersCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    acceptedAnswer: { type: Schema.Types.ObjectId, ref: "Answer" },
    isClosed: { type: Boolean, default: false },
    lastActivityAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ updatedAt: -1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ title: "text", body: "text" });

export const Question = mongoose.model("Question", QuestionSchema);

