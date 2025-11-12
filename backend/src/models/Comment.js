import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true, index: true },
    answer: { type: Schema.Types.ObjectId, ref: "Answer", default: null, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 600 }
  },
  {
    timestamps: true
  }
);

CommentSchema.index({ createdAt: -1 });

export const Comment = mongoose.model("Comment", CommentSchema);

