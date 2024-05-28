import UsersEX from "../models/user.js";
import AnnouncementModel from "../models/announcement.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";

export const createAnnouncement = async (req, res) => {
  try {
    const Announcement = await AnnouncementModel.find({
      _id: "65f32a1c0bbfd43fe3d0dfcb",
    });

    const AnnouncementID = Announcement[0]._id;
    const NewAnnouncement = await AnnouncementModel.findOneAndUpdate(
      { _id: AnnouncementID },
      { $set: { content: req.body.content } }
    );

    await NewAnnouncement.save();

    res
      .status(200)
      .json({ status: 200, message: "Announcement Create Successful" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAnnouncement = async (req, res) => {
  try {
    const Announcement = await AnnouncementModel.find();

    res.status(200).json(Announcement);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const suspendUser = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;
    const user = await UsersEX.findOneAndUpdate(
      { username: req.body.username },
      { $set: { status: "suspended" } }
    );
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User Doesn't Exist" });
    }

    await user.save();
    return res
      .status(200)
      .json({ status: 200, message: "Suspend User Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const reinstateUser = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;
    const user = await UsersEX.findOneAndUpdate(
      { username: req.body.username },
      { $set: { status: "active" } }
    );
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User Doesn't Exist" });
    } else {
      await user.save();
      return res
        .status(200)
        .json({ status: 200, message: "Reinstate User Successful" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const token = req.headers["x-access-token"];
  const status = req.body.status;
  const username = req.body.username;

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const cert = await UsersEX.findOneAndUpdate(
      { username: username },
      { $set: { status: status } }
    );
    // console.log(cert);
    await cert.save();

    return res
      .status(200)
      .json({ status: 200, message: "Modify Cert Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
