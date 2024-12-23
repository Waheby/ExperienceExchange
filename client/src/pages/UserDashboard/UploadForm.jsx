import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import { Cloudinary } from "@cloudinary/url-gen";
import { useSelector } from "react-redux";

function UploadForm() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  const url = "http://localhost:5000";
  const [username, setUsername] = useState(null);
  const [file, setFile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Deny entry to non-authorized users
  useEffect(() => {
    const token = userStore?.token?.token || localStorage.getItem("token");
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
    formData1.append("upload_preset", "experienceexchange");
    // console.log(file.name.includes(".jpg"));
    if (
      file.name.includes(".jpg") ||
      file.name.includes(".png") ||
      file.name.includes(".gif") ||
      file.name.includes(".jpeg") ||
      file.name.includes(".PNG") ||
      file.name.includes(".svg")
    ) {
      const responseCloudinary = await fetch(
        "https://api.cloudinary.com/v1_1/dpsa9tlr5/upload",
        {
          method: "POST",
          body: formData1,
        }
      ).catch((err) => {
        console.log(err);
        setIsSubmitting(false);
      });

      const dataCloudinary = await responseCloudinary.json();
      console.log(dataCloudinary);

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token":
              userStore?.token?.token || localStorage.getItem("token"),
          },
          body: JSON.stringify({
            file: file.name,
          }),
        }
      ).catch((err) => {
        console.log(err);
        setIsSubmitting(false);
      });

      const data = await response.json();
      console.log(data);
      setIsSubmitting(false);
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
    } else {
      toast.error("Wrong File Format!", {
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
      <div className={ContentCSS.mainContainer}>
        <h1>Change your profile picture</h1>
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
