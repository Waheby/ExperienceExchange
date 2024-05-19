import express from "express";
import multer from "multer";

import {
  getAllCertificates,
  uploadCertificate,
  modifyCertificate,
  getUserCertificate,
} from "../controllers/certificates.js";
const router = express.Router();

//IMAGE FILE UPLOAD FUNCTION===========================================
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log(file);
//     return cb(null, "/public/certs");
//   },
//   filename: function (req, file, cb) {
//     return cb(null, Date.now() + "_" + file.originalname);
//   },
// });
// const imageUpload = multer({ storage: storage });
//IMAGE FILE UPLOAD FUNCTION============================================

router.get("/all", getAllCertificates);
router.post("/cert", getUserCertificate);
router.post("/new", uploadCertificate);
router.post("/modify", modifyCertificate);

export default router;
