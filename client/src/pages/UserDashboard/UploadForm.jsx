import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";

function UploadForm() {
  let navigate = useNavigate();
  const url = "http://localhost:5000";
  const [username, setUsername] = useState(null);
  const [file, setFile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Deny entry to non-authorized users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      setUsername(user.username);
      console.log(user);
      if (!user) {
        console.log("Unauthorized User");
        localStorage.removeItem("token");
        navigate("/login");
      } else console.log("User Authenticated");
    } else navigate("/login");
  });

  const uploadFile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(file);
    const formData1 = new FormData();
    formData1.append("file", file);
    console.log(formData1);

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/upload`,
      {
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data; boundary=-------",
          "x-access-token": localStorage.getItem("token"),
        },
        body: formData1,
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("Changed Profile Picture Successfully!", {
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
      navigate("/userdashboard");
    }, 2000);
  };

  return (
    <>
      <div className={ContentCSS.mainContainer}>
        <h1>Change your profile picture</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={uploadFile}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Uplaod Here: </label>
            <input
              className={ContentCSS.loginInput}
              name="file"
              type="file"
              required
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
            />
            <hr style={{ width: "350px" }} />
            <button className={ContentCSS.loginButton} disabled={isSubmitting}>
              Upload New Picture
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UploadForm;