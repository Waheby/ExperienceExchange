import { useState } from "react";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
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
      <img
        style={{
          width: "100%",
          minWidth: "1440px",
          maxWidth: "1900px",
          minHeight: "800px",
          zIndex: "-1",
          position: "absolute",
          marginTop: "-35px",
        }}
        src={`${
          import.meta.env.VITE_CLOUDINARY_URL
        }/v1729095996/blob-scene-haikei_4_nzxgvj.svg`}
        alt=""
      />
      <h1 style={{ textAlign: "center", marginTop: "200px" }}>
        Change Your Password
      </h1>
      <div className={ContentCSS.loginContainer}>
        <form
          onSubmit={reset}
          style={{ height: "200px" }}
          className={ContentCSS.loginFormContainer}
        >
          <label htmlFor="text">
            Enter the Email associated with this account:{" "}
          </label>
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
        </form>
      </div>
    </>
  );
}

export default ChangePassword;
