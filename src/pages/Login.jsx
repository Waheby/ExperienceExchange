import { useState } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("Login Successful");
      toast.success("Login Success!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTimeout(() => {
        window.location.href = "/userdashboard";
      }, 2000);
    } else {
      console.log();
      toast.error(data.data, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsSubmitting(false);
    }
  };

  const faceLogin = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);

    // const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/user/login`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: username,
    //     password: password,
    //   }),
    // }).catch((err) => {
    //   console.log(err);
    // });

    // const data = await response.json();
    // console.log(data);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Login Page</h1>
      <div className={ContentCSS.loginContainer}>
        <form onSubmit={login} className={ContentCSS.loginFormContainer}>
          <label htmlFor="text">Username: </label>
          <input
            className={ContentCSS.loginInput}
            type="text"
            required
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label htmlFor="text">Password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <a className={ContentCSS.loginForgot} href="/reset">
            Forgot password?
          </a>
          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton} disabled={isSubmitting}>
            Login
          </button>
          <a className={ContentCSS.loginForgot} href="/register">
            Don't have an account?
          </a>
          <div
            style={{
              display: "flex",
              height: "30px",
              fontSize: "small",
              backgroundColor: "rgb(39, 62, 110)",
              color: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={ContentCSS.loginButton}
            onClick={(e) => faceLogin(e)}
          >
            <span style={{ textAlign: "center" }}>Face Recognition Login</span>
            <Icon
              icon="tabler:face-id"
              style={{ width: "40px", height: "40px", color: "white" }}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
