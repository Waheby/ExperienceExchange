import mongoose from "mongoose";

const certificateSchema = mongoose.Schema({
  creator: String,
  skill: String,
  certificate: { type: String, required: true },
  description: String,
  status: { type: String, default: "ongoing" },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Certificate = mongoose.model("Certificates", certificateSchema);

export default Certificate;
