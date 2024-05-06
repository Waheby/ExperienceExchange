import CommentModel from "../models/comment.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";

export const getComments = async (req, res) => {
  try {
    const Comment = await CommentModel.find({
      postId: req.body.postID,
    });
    console.log(Comment);

    res.status(200).json(Comment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    console.log(token);
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;
    const newComment = new CommentModel({
      creator: username,
      content: req.body.content,
      postId: req.body.postID,
    });

    await newComment.save();

    return res
      .status(200)
      .json({ status: 200, message: "Comment Create Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const Comment = await CommentModel.findOneAndDelete({
      _id: req.body.postId,
    });
    console.log(req.body.postId);

    res.status(200).json({ status: 200, message: "Comment Delete Successful" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
