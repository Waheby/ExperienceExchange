import mongoose from "mongoose";

const exchangeSchema = mongoose.Schema({
  channel: {
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
  status: {
    type: String,
    default: "ongoing",
  },
  content: {
    type: String,
  },
  channelToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Exchanges = mongoose.model("Exchanges", exchangeSchema);

export default Exchanges;
