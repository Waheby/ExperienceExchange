import express from "express";
import {
  getPosts,
  createPost,
  getPost,
  postSearchUsername,
  postSearchSkills,
  deletePost,
  getUserPosts,
  getRecommendedPosts,
} from "../controllers/posts.js";
const router = express.Router();

router.get("/all", getPosts);
router.post("/recommended", getRecommendedPosts);
router.post("/post", getPost);
router.post("/new", createPost);
router.delete("/delete", deletePost);
router.post("/search-username", postSearchUsername);
router.post("/search-skill", postSearchSkills);
router.post("/history", getUserPosts);

export default router;
