import UsersEX from "../models/user.js";
import ExchangeModel from "../models/exchange.js";
import MessageModel from "../models/message.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import agora from "agora-access-token";
import bcrypt from "bcryptjs";

const { RtcTokenBuilder, RtcRole } = agora;

export const userGet = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    await UsersEX.find({
      username: req.body.username || jwt.verify(token, "secretkey").username,
    }).then((user) => {
      if (user.length == 0) {
        res.status(400).json({ message: "User Dont Exist" });
      } else {
        // console.log(user);
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const checkUser = await UsersEX.findOne({
      username: req.body.username,
    });

    console.log(checkUser);

    if (checkUser != null) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        checkUser.password
      );

      if (isValidPassword) {
        if (checkUser.status != "suspended") {
          const token = jwt.sign(
            {
              username: checkUser.username,
              role: checkUser.role,
              image: checkUser.profileImage,
              email: checkUser.email,
              rating: checkUser.rating,
              skill: checkUser.skills,
            },
            "secretkey"
          );
          return res.status(200).json({ status: 200, token: token });
        } else {
          return res
            .status(401)
            .json({ status: 401, data: "User is Suspended" });
        }
      } else {
        return res.status(401).json({ status: 401, data: "Wrong Credentials" });
      }
    } else {
      return res.status(401).json({ status: 401, data: "Wrong Credentials" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userRegister = async (req, res) => {
  UsersEX.findOne({
    $or: [
      {
        email: req.body.email,
      },
      {
        username: req.body.username,
      },
    ],
  })
    .then(async (user) => {
      if (user) {
        let errors = {};
        if (user.username == req.body.username) {
          errors = "User Name already exists";
        } else {
          errors = "Email already exists";
        }
        return res.status(400).json({ status: 400, data: errors });
      } else {
        const hash = await bcrypt.hash(req.body.password, 13);

        const newUser = new UsersEX({
          username: req.body.username,
          email: req.body.email,
          password: hash,
        });

        newUser
          .save()
          .then((user) => res.status(200).json({ status: 200, data: user }))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

export const userUpdateUsername = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;
    const findUser = await UsersEX.findOneAndUpdate(
      { username: username },
      { $set: { username: req.body.username } }
    );
    findUser.save();
    return res
      .status(200)
      .json({ status: 200, message: "Update Username Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userUpdateEmail = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const email = decodeToken.email;
    const findUser = await UsersEX.findOneAndUpdate(
      { email: email },
      { $set: { email: req.body.email } }
    );
    return res
      .status(200)
      .json({ status: 200, message: "Update Email Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userResetPassword = async (req, res) => {
  const email = req.body.email;
  try {
    UsersEX.findOne({ email: email }).then((user) => {
      if (!user) {
        res.status(404).json({ message: "User Dont Exist" });
      } else {
        const token = jwt.sign({ id: user._id }, "secretkey", {
          expiresIn: "1h",
        });

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "12s161629@gmail.com",
            pass: "hfrn zxvn vuox bxcn",
          },
        });

        var mailOptions = {
          from: "12s161629@gmail.com",
          to: email,
          subject: "Resetting Your Password",
          text: `Experience Exchange: Hello There, Click this link to reset password:   https://experienceexchange-client.netlify.app/reset/${user._id}/${token}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            return res
              .status(200)
              .json({ status: 200, message: "Successfully sent reset email" });
          }
        });
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userNewPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    jwt.verify(token, "secretkey", async (err, decodeToken) => {
      if (err) {
        res.status(401).json({ message: "Token Error" });
      } else {
        await UsersEX.findOneAndUpdate(
          { _id: id },
          { $set: { password: password } }
        ).then((user) => {
          return res
            .status(200)
            .json({ status: 200, message: "Update Password Successful" });
        });
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userUploadImage = async (req, res) => {
  const token = req.headers["x-access-token"];
  const filename = req.body.file;

  try {
    jwt.verify(token, "secretkey", async (err, decodeToken) => {
      if (err) {
        res.status(401).json({ message: "Token Error" });
      } else {
        console.log(decodeToken.username);
        const user = await UsersEX.findOneAndUpdate(
          { username: decodeToken.username },
          { $set: { profileImage: filename } }
        );
        if (!user) {
          res.status(400).json({ message: "User Dont Exist" });
        } else {
          res.status(200).json({ message: "Update Image Successful" });
        }
        console.log(user);
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userAddSkill = async (req, res) => {
  const token = req.headers["x-access-token"];
  const bodySkills = req.body.skills;

  try {
    console.log(token);
    const decodeToken = jwt.verify(token, "secretkey");
    const user = await UsersEX.findOneAndUpdate(
      { username: decodeToken.username },
      { $push: { skills: bodySkills } }
    );

    await user.save();

    return res
      .status(200)
      .json({ status: 200, message: "Add Skill Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const userBio = async (req, res) => {
  const token = req.headers["x-access-token"];
  const bio = req.body.bio;

  try {
    console.log(token);
    const decodeToken = jwt.verify(token, "secretkey");
    const user = await UsersEX.findOneAndUpdate(
      { username: decodeToken.username },
      { $set: { bio: bio } }
    );

    await user.save();

    return res
      .status(200)
      .json({ status: 200, message: "Change Bio Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const User = await UsersEX.find();

    res.status(200).json(User);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const userSearchUsername = async (req, res) => {
  const token = req.headers["x-access-token"];
  const decodeToken = jwt.verify(token, "secretkey");

  try {
    const addSearchTermToUser = await UsersEX.findOneAndUpdate(
      { username: decodeToken.username },
      { $push: { searches: req.body.username } }
    );

    const User = await UsersEX.find({
      username: { $regex: req.body.username },
    });
    console.log(User);

    await addSearchTermToUser.save();
    res.status(200).json(User);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const userSearchSkills = async (req, res) => {
  const token = req.headers["x-access-token"];
  const decodeToken = jwt.verify(token, "secretkey");

  try {
    const addSearchTermToUser = await UsersEX.findOneAndUpdate(
      { username: decodeToken.username },
      { $push: { searches: req.body.skill } }
    );

    const User = await UsersEX.find({ skills: { $regex: req.body.skill } });
    console.log(req.body);

    await addSearchTermToUser.save();
    res.status(200).json(User);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const messageGet = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;

    await MessageModel.find({
      toUser: username || req.body.username,
    })
      .limit(4)
      .sort({ _id: -1 })
      .then((user) => {
        if (user.length == 0) {
          res.status(400).json({ message: "No Messages found" });
        } else {
          res.status(200).json(user);
        }
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const messageCreate = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    jwt.verify(token, "secretkey", async (err, decodeToken) => {
      if (err) {
        res.status(401).json({ status: 401, message: "You are Not logged in" });
      } else {
        const message = await new MessageModel({
          toUser: req.body.toUser,
          fromUser: req.body.fromUser,
          content: req.body.content,
        });
        await message.save();
        console.log(message);
        return res.status(200).json(message);
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
  }
};

export const requestCreate = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    jwt.verify(token, "secretkey", async (err, decodeToken) => {
      if (err) {
        res.status(401).json({ status: 401, message: "You are Not logged in" });
      } else {
        const request = await ExchangeModel.findOne({
          $and: [
            {
              status: "ongoing",
            },
            {
              fromUser: req.body.fromUser,
            },
            {
              toUser: req.body.toUser,
            },
          ],
        });

        if (request) {
          return res
            .status(400)
            .json({ message: "Request to this user already exist" });
        } else {
          const exchange = await new ExchangeModel({
            toUser: req.body.toUser,
            fromUser: req.body.fromUser,
            channel: req.body.channel,
            content: req.body.content,
          });
          await exchange.save();
          console.log(exchange);
          return res.status(200).json(exchange);
        }
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
  }
};

export const requestModify = async (req, res) => {
  const token = req.headers["x-access-token"];
  const status = req.body.status;
  const id = req.body.id;

  try {
    const decodeToken = jwt.verify(token, "secretkey");

    if (status === "deny") {
      const request = await ExchangeModel.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } }
      );
      await request.save();
      return res
        .status(200)
        .json({ status: 200, message: "Deny Request Successful" });
    } else if (status === "accept") {
      const APP_ID = "7a26c47116cf4606a08da84ce7d9cb47";
      const APP_CERTIFICATE = "7dfa56d42b0e41ec95328e403a8f0c01";

      //define channel name
      const channelName = "test";
      if (!channelName) {
        return res.status(500).json({ error: "channel is required" });
      }

      //define uid
      let uid = 0;

      //define role
      let role = RtcRole.PUBLISHER;

      //define expire time
      let expireTime = 14000;
      // calculate privilege expire time
      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTime + expireTime;

      const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        role,
        privilegeExpireTime
      );

      const request = await ExchangeModel.findOneAndUpdate(
        { _id: id },
        { $set: { channelToken: token, status: status } }
      );
      await request.save();

      //return token
      return res.status(200).json({ token: token });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const requestGet = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;

    await ExchangeModel.find({
      toUser: username || req.body.username,
      status: "ongoing",
    }).then((user) => {
      if (user.length == 0) {
        res.status(400).json({ message: "No Requests found" });
      } else {
        console.log(user);
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const acceptedSessions = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;

    await ExchangeModel.find({
      $and: [
        { status: "accept" },
        { $or: [{ toUser: username }, { fromUser: username }] },
      ],
    }).then((user) => {
      if (user.length == 0) {
        res.status(400).json({ message: "No Accepted Sessions found" });
        console.log(user);
      } else {
        console.log(user);
        res.status(200).json(user);
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const generateAccessToken = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const APP_ID = "7a26c47116cf4606a08da84ce7d9cb47";
  const APP_CERTIFICATE = "7dfa56d42b0e41ec95328e403a8f0c01";

  //define channel name
  const channelName = "test";
  if (!channelName) {
    return res.status(500).json({ error: "channel is required" });
  }

  //define uid
  let uid = 0;

  //define role
  let role = RtcRole.PUBLISHER;

  //define expire time
  let expireTime = 14000;
  // calculate privilege expire time
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  //return token
  return res.json({ token: token });
};

export const sessionModify = async (req, res) => {
  const token = req.headers["x-access-token"];
  const sessionToken = req.body.token;
  const id = req.body.id;

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const request = await ExchangeModel.findOneAndUpdate(
      { _id: id },
      { $set: { channelToken: sessionToken } }
    );
    await request.save();
    return res
      .status(200)
      .json({ status: 200, message: "Stored Token Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const sessionDelete = async (req, res) => {
  const token = req.headers["x-access-token"];
  const id = req.body.id;

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const request = await ExchangeModel.findOneAndDelete({ _id: id });
    return res
      .status(200)
      .json({ status: 200, message: "Delete Request Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
