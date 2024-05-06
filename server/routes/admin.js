import express from "express";
import {
  deletePost,
  suspendUser,
  createAnnouncement,
  reinstateUser,
  getAnnouncement,
} from "../controllers/admin.js";
const router = express.Router();

router.get("/delete", deletePost);
router.post("/suspend", suspendUser);
router.post("/reinstate", reinstateUser);
router.post("/announcement", createAnnouncement);
router.get("/get-announcement", getAnnouncement);

export default router;
