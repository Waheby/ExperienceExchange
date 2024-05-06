import express from "express";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/comments.js";
const router = express.Router();

router.post("/all", getComments);
router.post("/new", createComment);
router.delete("/delete", deleteComment);

export default router;
