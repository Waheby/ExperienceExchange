import { useEffect, useRef, useState } from "react";
import NavCSS from "../assets/styles/Navbar/nav.module.css";
import { Link, useNavigate } from "react-router-dom";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const [mounted, setMounted] = useState(false);
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userInfo = useRef("");
  let isAdmin = false;
  const url = "http://localhost:5000";

  if (token) {
    const user = jose.decodeJwt(token);
    return (
      <>
        <div className={NavCSS.navContainer}>
          <div className={NavCSS.logoContainer}>
            <img
              className={NavCSS.logoImg}
              src={"../public/LogoEX.png"}
              alt="Logo"
            />
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
              <Link className={NavCSS.btnLogin} to={`/user/${user.username}`}>
                My Profile
              </Link>
            </div>
            <div className={NavCSS.othersdiv1}>
              <Link className={NavCSS.btnLogin} to="/userdashboard">
                Dashboard
              </Link>
            </div>
            <div className={NavCSS.othersdiv1}>
              <Link
                className={NavCSS.btnLogin}
                style={{ backgroundColor: "red", color: "white" }}
                to="/home"
                onClick={() => {
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
                }}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else
    return (
      <>
        <div className={NavCSS.navContainer}>
          <div className={NavCSS.logoContainer}>
            <img
              className={NavCSS.logoImg}
              src={"../public/LogoEX.png"}
              alt="Logo"
            />
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
      </>
    );
}

export default Navbar;
