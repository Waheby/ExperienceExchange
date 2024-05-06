import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import PostModel from "./routes/posts.js";
import UsersModel from "./routes/users.js";
import CertsModel from "./routes/certificates.js";
import AdminModel from "./routes/admin.js";
import CommentModel from "./routes/comments.js";

import path from "path";
import { fileURLToPath } from "url";

// resolving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();
app.use(cors());

// app.use(
//   cors({
//     origin: ["https://experience-exchange-frontend.vercel.app"],
//     methods: ["POST", "GET"],
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", (req, res) => {
  res.send("Server is connected");
});
app.use("/post", PostModel);
app.use("/user", UsersModel);
app.use("/certificate", CertsModel);
app.use("/admin", AdminModel);
app.use("/comment", CommentModel);

//use client app
app.use(express.static(path.join(__dirname, "/client/dist")));

// render client for any path
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/dist/index.html"))
);

// app.use(bodyParser.json({ limit: "30mb", extended: true })); //for image upload
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //for image upload

const CONNECTION_URL =
  "mongodb+srv://AdminExEx:donthackme22@atlascluster.wzsvziu.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

mongoose
  .connect(CONNECTION_URL)
  .then(() => console.log(`Database Running`))
  .catch((error) => console.log(error.message));
