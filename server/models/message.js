import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  fromUser: {
    type: String,
    required: true,
  },
  toUser: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Messages = mongoose.model("Messages", messageSchema);

export default Messages;
