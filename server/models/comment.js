import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema({
  content: String,
  creator: String,
  postId: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;
