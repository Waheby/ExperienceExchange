import { useEffect, useRef, useState } from "react";
import NavCSS from "../assets/styles/Navbar/nav.module.css";
import AnnouncementBox from "./AnnouncementBox";
import { Link, useNavigate } from "react-router-dom";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logOut } from "../state/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "../state/user/userSlice";

function Navbar() {
  const userStore = useSelector(selectCurrentToken);

  const [mounted, setMounted] = useState(false);
  let navigate = useNavigate();
  const token = userStore?.token?.token || localStorage.getItem("token");
  const userInfo = useRef("");
  let isAdmin = false;
  const dispatch = useDispatch(); //to input data into state using reducer

  //testing for redux not complete yet
  const logout = async (e) => {
    e.preventDefault();
    dispatch(logOut());
    localStorage.removeItem("token");

    toast.success("Logged out Successfully!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate("/login");
  };

  if (token) {
    const user = jose.decodeJwt(token);
    return (
      <>
        <div className={NavCSS.navContainer}>
          <div className={NavCSS.logoContainer}>
            <img className={NavCSS.logoImg} src={"/LogoEX.png"} alt="Logo" />
          </div>
          <div className={NavCSS.buttonContainer}>
            <Link className={NavCSS.btnHome} to="/posts">
              Feed
            </Link>
            <Link className={NavCSS.btnHome} to="/search">
              Search
            </Link>
            {/* <Link className={NavCSS.btnHome} to="/ranking">
              Ranking
            </Link> */}
            <Link className={NavCSS.btnHome} to="/contact">
              Contact
            </Link>
          </div>
          <div className={NavCSS.othersContainer}>
            <div className={NavCSS.othersdiv1}>
              <Link
                style={{ width: "100px" }}
                className={NavCSS.btnHome}
                to={`/user/${user.username}`}
              >
                My Profile
              </Link>
            </div>
            <div className={NavCSS.othersdiv1}>
              <Link
                style={{ width: "100px" }}
                className={NavCSS.btnHome}
                to="/userdashboard"
              >
                Dashboard
              </Link>
            </div>
            <div className={NavCSS.othersdiv1}>
              <Link
                className={NavCSS.btnLogin}
                style={{ backgroundColor: "red", color: "white" }}
                to="/home"
                onClick={(e) => {
                  logout(e);
                  // localStorage.removeItem("token");
                }}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
        <hr style={{ width: "100%" }} />
        <AnnouncementBox />
      </>
    );
  } else
    return (
      <>
        <div className={NavCSS.navContainer}>
          <div className={NavCSS.logoContainer}>
            <img className={NavCSS.logoImg} src={"LogoEX.png"} alt="Logo" />
          </div>
          <div className={NavCSS.buttonContainer}>
            <Link className={NavCSS.btnHome} to="/home">
              Home
            </Link>
            <Link className={NavCSS.btnHome} to="/search">
              Search
            </Link>
            {/* <Link className={NavCSS.btnHome} to="/ranking">
              Ranking
            </Link> */}
            <Link className={NavCSS.btnHome} to="/contact">
              Contact
            </Link>
          </div>
          <div className={NavCSS.othersContainer}>
            <div id="loginContainer" className={NavCSS.othersdiv1}>
              <Link className={NavCSS.btnLogin} to="/login">
                Login
              </Link>
            </div>
            <div id="regContainer" className={NavCSS.othersdiv2}>
              <Link className={NavCSS.btnRegister} to="/register">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <hr style={{ width: "100%" }} />
        <AnnouncementBox />
      </>
    );
}

export default Navbar;
