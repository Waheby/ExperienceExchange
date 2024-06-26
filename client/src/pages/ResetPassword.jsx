import { useEffect, useState } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function resetPassword() {
  const [password, setPassword] = useState("");
  const { id, token } = useParams();
  let navigate = useNavigate();

  //Deny entry to non-authorized users
  // useEffect(() => {
  //   const newtoken = token;
  //   if (newtoken) {
  //     const user = jose.decodeJwt(newtoken);
  //     console.log(user);
  //     if (!user) {
  //       console.log("Unauthorized User");
  //       // localStorage.removeItem("token");
  //       navigate("/login");
  //     } else console.log("User Authenticated");
  //   } else navigate("/login");
  // });

  const reset = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/user/new-password/${id}/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);

    if (data.status == 200) {
      toast.success("Password Resetted successfully", {
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
        navigate("/login");
      }, 2000);
    } else {
      toast.error("Error with Token", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>New Password</h1>
      <div className={ContentCSS.loginContainer}>
        <form onSubmit={reset} className={ContentCSS.loginFormContainer}>
          <label htmlFor="text">Enter a new password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton}>Reset</button>
        </form>
      </div>
    </>
  );
}

export default resetPassword;
