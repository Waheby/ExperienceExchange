import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

function NewAnnouncement() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  //Deny entry to non-authorized users OR get user info
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
      } else {
        console.log("User Authenticated");
      }
    } else navigate("/login");

    const getAnnouncement = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/get-announcement`,
        {
          method: "GET",
          headers: {
            "x-access-token":
              userStore?.token?.token || localStorage.getItem("token"),
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
    };
    getAnnouncement();
  });

  const CreateAnnouncement = async (e) => {
    e.preventDefault();

    if (input.length <= 150 && input.length > 0) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/announcement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token":
              userStore?.token?.token || localStorage.getItem("token"),
          },
          body: JSON.stringify({
            content: input,
            creator: username,
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
      toast.success("Announcement is Created Successfully!", {
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
        window.location.reload();
      }, 2000);
    } else {
      toast.error("Announcement length is wrong!", {
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
        <h1 style={{ marginTop: "100px" }}>Publish an Announcement</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={CreateAnnouncement}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Enter a message: </label>
            <textarea
              style={{ width: "300px", height: "100px" }}
              className={ContentCSS.loginInput}
              type="text"
              required
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
            <div style={{ fontSize: "small", color: "grey" }}>
              Text Length: {input.length}/150
            </div>
            <hr style={{ width: "350px" }} />
            <button
              style={{ backgroundColor: "green", color: "white" }}
              className={ContentCSS.loginButton}
            >
              Confirm Announcement
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewAnnouncement;
