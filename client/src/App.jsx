import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AnnouncementBox from "./components/AnnouncementBox";
import Home from "./pages/Home";
import PostsPage from "./pages/PostsPage";
import Contact from "./pages/Contact";
import RankingPage from "./pages/RankingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Session from "./pages/Session";
import NoPage from "./pages/NoPage";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import NewPostForm from "./pages/UserDashboard/NewPostForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UploadForm from "./pages/UserDashboard/UploadForm";
import NewSkillForm from "./pages/UserDashboard/NewSkillForm";
import ChangeBio from "./pages/UserDashboard/ChangeBio";
import VerifySkill from "./pages/UserDashboard/VerifySkill";
import CheckVerify from "./pages/UserDashboard/CheckVerify";
import SuspendUser from "./pages/UserDashboard/SuspendUser";
import NewAnnouncement from "./pages/UserDashboard/NewAnnouncement";
import PostsHistory from "./pages/UserDashboard/PostsHistory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Navbar></Navbar>
          {/* <AnnouncementBox></AnnouncementBox> */}
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/posts" element={<PostsPage />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/ranking" element={<RankingPage />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/session" element={<Session />}></Route>
            <Route path="/search" element={<SearchResults />}></Route>
            <Route path="/user/:userId" element={<Profile />}></Route>
            <Route path="/posts/:postId" element={<PostDetails />}></Route>
            <Route path="/reset" element={<ForgotPassword />}></Route>
            <Route path="/reset/:id/:token" element={<ResetPassword />}></Route>
            <Route path="/userdashboard" element={<UserDashboard />}></Route>
            <Route
              path="/userdashboard/newpost"
              element={<NewPostForm />}
            ></Route>
            <Route
              path="/userdashboard/upload"
              element={<UploadForm />}
            ></Route>
            <Route
              path="/userdashboard/skill"
              element={<NewSkillForm />}
            ></Route>
            <Route path="/userdashboard/bio" element={<ChangeBio />}></Route>
            <Route
              path="/userdashboard/verify"
              element={<VerifySkill />}
            ></Route>
            <Route
              path="/userdashboard/check-verify"
              element={<CheckVerify />}
            ></Route>
            <Route
              path="/userdashboard/suspend"
              element={<SuspendUser />}
            ></Route>
            <Route
              path="/userdashboard/announcement"
              element={<NewAnnouncement />}
            ></Route>
            <Route
              path="/userdashboard/posts-history"
              element={<PostsHistory />}
            ></Route>
            <Route path="*" element={<NoPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer
        theme="colored"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
