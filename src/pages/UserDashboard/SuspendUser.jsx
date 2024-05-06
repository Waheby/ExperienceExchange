import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";

function SuspendUser() {
  let navigate = useNavigate();
  const url = "http://localhost:5000";

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  //Deny entry to non-authorized users OR get user info
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
      } else {
        console.log("User Authenticated");
      }
    } else navigate("/login");

    const getUser = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/get-user`,
        {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
    };
    getUser();
  }, []);

  const suspendUser = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/admin/suspend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: username,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("User Suspended Successfully!", {
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

  const reinstateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/admin/reinstate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: username,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("User Reinstated Successfully!", {
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
      <div className={ContentCSS.mainContainer}>
        <h1>Suspend any user</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={suspendUser}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Enter a username to suspend: </label>
            <input
              className={ContentCSS.loginInput}
              type="text"
              required
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <hr style={{ width: "350px" }} />
            <button
              style={{ backgroundColor: "red", color: "white" }}
              className={ContentCSS.loginButton}
            >
              Confirm Suspension
            </button>
          </form>
          <h1 style={{ marginTop: "50px", textAlign: "center" }}>
            Reinstate any user
          </h1>
          <form
            style={{ marginTop: "10px" }}
            onSubmit={reinstateUser}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Enter username to remove suspension: </label>
            <input
              className={ContentCSS.loginInput}
              type="text"
              required
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <hr style={{ width: "350px" }} />
            <button
              style={{ backgroundColor: "green", color: "white" }}
              className={ContentCSS.loginButton}
            >
              Confirm Reinitialization
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SuspendUser;
