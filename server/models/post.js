import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  content: String,
  creator: String,
  tags: [String],
  comments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Posts = mongoose.model("Posts", postSchema);

export default Posts;
