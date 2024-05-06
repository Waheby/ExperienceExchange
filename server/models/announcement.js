import mongoose from "mongoose";

const announcementSchema = mongoose.Schema({
  creator: String,
  content: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Announcement = mongoose.model("Announcements", announcementSchema);

export default Announcement;
