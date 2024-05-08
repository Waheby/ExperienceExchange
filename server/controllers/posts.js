import PostModel from "../models/post.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";

export const getPosts = async (req, res) => {
  try {
    const Post = await PostModel.find();
    console.log(Post);

    res.status(200).json(Post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const Post = await PostModel.find({
      creator: req.body.username,
    });
    console.log(req.body.username);

    res.status(200).json(Post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const Post = await PostModel.findOneAndDelete({
      _id: req.body.postId,
    });
    console.log(req.body.postId);

    res.status(200).json({ status: 200, message: "Post Delete Successful" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const token = req.headers["x-access-token"];
  const bodyTags = req.body.tags;
  const emptyArr = []; //i need empty arr to use concat
  try {
    console.log(token);
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;
    const newPost = new PostModel({
      creator: username,
      tags: emptyArr.concat(bodyTags),
      content: req.body.content,
    });

    await newPost.save();

    return res
      .status(200)
      .json({ status: 200, message: "Post Create Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const Post = await PostModel.findOne({
      _id: req.body.postID,
    });
    console.log(Post);

    res.status(200).json(Post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postSearchUsername = async (req, res) => {
  const newest = req.body.sortByNewest;
  if (newest) {
    try {
      const Post = await PostModel.find({
        creator: { $regex: req.body.username },
      }).sort({ createdAt: -1 });
      console.log(Post);
      res.status(200).json(Post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    try {
      const Post = await PostModel.find({
        creator: { $regex: req.body.username },
      }).sort({ createdAt: 1 });
      console.log(Post);
      res.status(200).json(Post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const postSearchSkills = async (req, res) => {
  const newest = req.body.sortByNewest;
  if (newest) {
    const skill = req.body.skill;
    try {
      const Post = await PostModel.find({
        tags: { $regex: req.body.skill },
      }).sort({ createdAt: 1 });
      console.log(Post);

      res.status(200).json(Post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    const skill = req.body.skill;
    try {
      const Post = await PostModel.find({
        tags: { $regex: req.body.skill },
      }).sort({ createdAt: -1 });
      console.log(Post);

      res.status(200).json(Post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};
