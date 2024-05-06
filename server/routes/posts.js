import express from "express";
import { send } from "vite";
import {
  getPosts,
  createPost,
  getPost,
  postSearchUsername,
  postSearchSkills,
  deletePost,
  getUserPosts,
} from "../controllers/posts.js";
const router = express.Router();

router.get("/all", getPosts);
router.post("/post", getPost);
router.post("/new", createPost);
router.delete("/delete", deletePost);
router.post("/search-username", postSearchUsername);
router.post("/search-skill", postSearchSkills);
router.post("/history", getUserPosts);

export default router;
