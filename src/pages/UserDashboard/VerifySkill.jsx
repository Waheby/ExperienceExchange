import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";

function UploadForm() {
  let navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [skill, setSkill] = useState(null);
  const [description, setDescription] = useState(null);
  const [file, setFile] = useState("");

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
    console.log(file);
    const formData1 = new FormData();
    formData1.append("file", file);
    console.log(formData1);

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/new`,
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
    toast.success("Verification Request Sent!", {
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
        <h1>Upload a certificate relevant to your skill</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={uploadFile}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Upload Here: </label>
            <input
              className={ContentCSS.loginInput}
              name="file"
              type="file"
              required
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
            />
            <label htmlFor="text">Enter the Skill: </label>
            <input
              className={ContentCSS.loginInput}
              type="text"
              required
              value={skill}
              onChange={(event) => {
                setSkill(event.target.value);
              }}
            />
            <label htmlFor="text">Additional Information: </label>
            <textarea
              style={{ width: "300px" }}
              className={ContentCSS.contactMessage}
              type="text"
              required
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <hr style={{ width: "350px" }} />
            <button className={ContentCSS.loginButton}>
              Submit for verification
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UploadForm;
