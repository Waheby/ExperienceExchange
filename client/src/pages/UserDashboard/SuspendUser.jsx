import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Collapse, Modal, Popover } from "antd";

function SuspendUser() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  const url = "http://localhost:5000";

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [openMessage, setOpenMessage] = useState(false);

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
          method: "GET",
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
  }, []);

  const suspendUser = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/admin/suspend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token":
            userStore?.token?.token || localStorage.getItem("token"),
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
    if (data.status === 200) {
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
    } else {
      toast.error(data.message, {
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

  const reinstateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/admin/reinstate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token":
            userStore?.token?.token || localStorage.getItem("token"),
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
    if (data.status === 200) {
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
    } else {
      toast.error(data.message, {
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

  const showModalMessage = async (e) => {
    e.preventDefault();
    setOpenMessage(true);
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
        }/v1729095996/blob-scene-haikei_5_feadwg.svg`}
        alt=""
      />
      <div className={ContentCSS.mainContainer}>
        <h1>Suspend any user</h1>
        <div className={ContentCSS.registerContainer}>
          <form className={ContentCSS.contactFormContainer}>
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
            <Popover
              content={
                <form
                  className={ContentCSS.contactFormContainer}
                  style={{ boxShadow: "none", height: "150px" }}
                >
                  <span style={{ fontSize: "20px" }}>
                    Are you sure you want to suspend user ?
                  </span>
                  <div style={{ marginTop: "50px" }}>
                    <button
                      style={{
                        width: "20%",
                        backgroundColor: "red",
                        color: "white",
                      }}
                      className={ContentCSS.loginButton}
                      onClick={(e) => suspendUser(e)}
                    >
                      CONFIRM
                    </button>
                  </div>
                </form>
              }
              title=""
              trigger="click"
            >
              <button
                style={{ backgroundColor: "red", color: "white" }}
                className={ContentCSS.loginButton}
                onClick={showModalMessage}
              >
                Confirm Suspension
              </button>
            </Popover>
          </form>
        </div>
        <h1 style={{ marginTop: "50px", textAlign: "center" }}>
          Reinstate any user
        </h1>
        <div className={ContentCSS.registerContainer}>
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
            <Popover
              content={
                <form
                  className={ContentCSS.contactFormContainer}
                  style={{ boxShadow: "none", height: "150px" }}
                >
                  <span style={{ fontSize: "20px" }}>
                    Are you sure you want to restore user ?
                  </span>
                  <div style={{ marginTop: "50px" }}>
                    <button
                      style={{
                        width: "20%",
                        backgroundColor: "red",
                        color: "white",
                      }}
                      className={ContentCSS.loginButton}
                      onClick={(e) => reinstateUser(e)}
                    >
                      CONFIRM
                    </button>
                  </div>
                </form>
              }
              title=""
              trigger="click"
            >
              <button
                style={{ backgroundColor: "green", color: "white" }}
                className={ContentCSS.loginButton}
                onClick={showModalMessage}
              >
                Confirm Reinitialization
              </button>
            </Popover>
          </form>
        </div>
      </div>
    </>
  );
}

export default SuspendUser;
