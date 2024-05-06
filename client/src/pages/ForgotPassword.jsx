import { useState } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function forgotPassword() {
  const [email, setEmail] = useState("");

  const reset = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.warning(data.message, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Resetting Your Password</h1>
      <div className={ContentCSS.loginContainer}>
        <form onSubmit={reset} className={ContentCSS.loginFormContainer}>
          <label htmlFor="text">Enter Your Email: </label>
          <input
            className={ContentCSS.loginInput}
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton}>Reset</button>
          <a className={ContentCSS.loginForgot} href="/register">
            Don't have an account?
          </a>
        </form>
      </div>
    </>
  );
}

export default forgotPassword;
