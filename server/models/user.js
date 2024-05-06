import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  role: { type: String, default: "normal user" },
  status: { type: String, default: "active" },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, default: "Empty" },
  profileImage: { type: String, default: "DefaultProfile.svg" },
  rating: Number,
  posts: Number,
  comments: Number,
  skills: [String],
  rating: { type: Number, default: 0 },
  searches: [String],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const UsersEX = mongoose.model("UsersEX", userSchema);

export default UsersEX;
