import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import Filter from "bad-words";
import { useSelector } from "react-redux";

function ChangeBio() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  var filter = new Filter();
  filter.addWords("badword", "kill", "Badword", "loser");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const getUser = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/get-user`,
        {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
    };
    getUser();
  });

  const changeUserBio = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (bio.length <= 100 && bio.length > 0) {
      if (!filter.isProfane(bio)) {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/user/bio`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token":
                userStore?.token?.token || localStorage.getItem("token"),
            },
            body: JSON.stringify({
              bio: bio,
            }),
          }
        ).catch((err) => {
          console.log(err);
        });

        const data = await response.json();
        console.log(data);
        toast.success("Changed Biography Successfully!", {
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
        toast.error("Biography Contains Profanity!", {
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
    } else {
      toast.error("Biography length is wrong!", {
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
      <div className={ContentCSS.mainContainer}>
        <h1>Change your biography</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={changeUserBio}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Type your new bio: </label>
            <textarea
              className={ContentCSS.contactMessage}
              type="text"
              required
              value={bio}
              onChange={(event) => {
                setBio(event.target.value);
              }}
            />
            <div style={{ fontSize: "small", color: "grey" }}>
              Text Length: {bio.length}/150
            </div>
            <hr style={{ width: "350px" }} />
            <button className={ContentCSS.loginButton} disabled={isSubmitting}>
              Confirm & Change Biography
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangeBio;
