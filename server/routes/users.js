import express from "express";
import multer from "multer";
import path from "path";
import { getPosts, createPost } from "../controllers/posts.js";
import {
  userLogin,
  userRegister,
  userUpdateUsername,
  userUpdateEmail,
  userResetPassword,
  userNewPassword,
  userUploadImage,
  userAddSkill,
  userGet,
  userBio,
  getAllUsers,
  userSearchUsername,
  userSearchSkills,
  messageGet,
  requestGet,
  messageCreate,
  requestCreate,
  requestModify,
  acceptedSessions,
  generateAccessToken,
  sessionModify,
  sessionDelete,
  userRatingChange,
  userSendContact,
  getRecommendedUsers,
  userUploadFace,
  userGetMatchingFace,
  userFaceLogin,
} from "../controllers/users.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

//IMAGE FILE UPLOAD CLOUDINARY===========================================

//IMAGE FILE UPLOAD FUNCTION===========================================
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log(file);
//     return cb(null, "../public/profile");
//   },
//   filename: function (req, file, cb) {
//     return cb(null, Date.now() + "_" + file.originalname);
//   },
// });
// const imageUpload = multer({
//   storage: storage,
// });

//AGORA TOKEN============================================
const nocache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};
//ROUTES============================================

router.get("/all", getAllUsers);
router.post("/get-user", userGet);
router.post("/login", userLogin);
router.post("/register", userRegister);
router.post("/username", userUpdateUsername);
router.post("/update/email", userUpdateEmail);
router.post("/reset-password", userResetPassword);
router.post("/new-password/:id/:token", userNewPassword);
router.post("/upload", userUploadImage);
router.post("/skill", userAddSkill);
router.post("/bio", userBio);
router.post("/recommended", getRecommendedUsers);
router.post("/search-username", userSearchUsername);
router.post("/search-skill", userSearchSkills);
router.get("/get-messages", messageGet);
router.get("/get-requests", requestGet);
router.get("/available-sessions", acceptedSessions);
router.post("/new-messages", messageCreate);
router.post("/new-request", requestCreate);
router.post("/modify-request", requestModify);
router.post("/modify-session", sessionModify);
router.delete("/delete-request", sessionDelete);
router.post("/rate", userRatingChange);
router.post("/contact", userSendContact);
router.post("/upload-face", userUploadFace);
router.post("/face-match", userGetMatchingFace);
router.post("/face-login", userFaceLogin);
export default router;
