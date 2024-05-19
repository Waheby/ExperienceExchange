import CertificateModel from "../models/certificate.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";

export const getAllCertificates = async (req, res) => {
  try {
    const certificate = await CertificateModel.find({
      status: "ongoing",
    });
    console.log(certificate);

    res.status(200).json(certificate);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserCertificate = async (req, res) => {
  const username = req.body.username;
  try {
    const certificate = await CertificateModel.find({
      fromUser: username,
    });
    console.log(certificate);

    res.status(200).json(certificate);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const uploadCertificate = async (req, res) => {
  const token = req.headers["x-access-token"];
  const certFile = req.body.file;
  const emptyArr = []; //i need empty arr to use concat
  try {
    console.log(token);
    const decodeToken = jwt.verify(token, "secretkey");
    const username = decodeToken.username;
    const newCert = new CertificateModel({
      creator: username,
      certificate: certFile.file,
      skill: req.body.skill,
      description: req.body.description,
    });

    await newCert.save();

    return res
      .status(200)
      .json({ status: 200, message: "Cert Create Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const modifyCertificate = async (req, res) => {
  const token = req.headers["x-access-token"];
  const status = req.body.status;
  const certId = req.body.id;

  try {
    const decodeToken = jwt.verify(token, "secretkey");
    const cert = await CertificateModel.findOneAndUpdate(
      { _id: certId },
      { $set: { status: status } }
    );
    console.log(certId);
    await cert.save();

    return res
      .status(200)
      .json({ status: 200, message: "Modify Cert Successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
