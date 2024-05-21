import { useEffect, useState } from "react";
import NavCSS from "../assets/styles/Navbar/nav.module.css";

import Navbar from "../components/Navbar";
import Post from "../components/Post";
import ContentCSS from "../assets/styles/Content/content.module.css";
import {
  Route,
  Router,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import * as jose from "jose";
import { Icon } from "@iconify/react";
import { ToastContainer, toast } from "react-toastify";
import { Collapse, Modal, Popover } from "antd";

function Profile() {
  let navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("");
  const [contentInfo, setContentInfo] = useState("");
  const [user, setUser] = useState([""]);
  const [certificates, setCertificates] = useState([""]);
  const [openMessage, setOpenMessage] = useState(false);
  const [openExchange, setOpenExchange] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const userID = params.userId;

  const getUserCerts = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/user-cert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: userID,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setCertificates(data);
    console.log(user);
  };

  const getUser = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/get-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: userID,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setUser(data);
    console.log(user);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/new-messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          toUser: userID,
          fromUser: username,
          content: content,
        }),
      }
    ).catch((err) => {
      console.log(err);
      toast.success(err, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });

    const data = await response.json();
    if (data.status >= 400) {
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
    } else {
      toast.success("Message Sent!", {
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
    console.log(data);
    setContent("");
  };

  const calculateAverageRating = (rating) => {
    // console.log(rating);
    if (rating != null) {
      const sum = rating.reduce((partialSum, a) => partialSum + a, 0);
      const count = rating.length;
      const average = (sum / count).toFixed(1);
      return average;
    } else return rating;
  };

  const sendRequest = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/new-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          toUser: userID,
          fromUser: username,
          channel: channel,
          content: contentInfo,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    if (data.status >= 400) {
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
    } else {
      toast.success("Exchange Request Sent!", {
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
    console.log(data);
    setContentInfo("");
    setChannel("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      setUsername(user.username);
      // setRating(user.rating);
      // console.log(user.username);
    }
    getUser();
    getUserCerts();
  }, []);
  // console.log(username);

  const showModalMessage = () => {
    setOpenMessage(true);
  };
  const showModalExchange = () => {
    setOpenExchange(true);
  };
  const handleOkMessage = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenMessage(false);
      setOpenExchange(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleOkExchange = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenMessage(false);
      setOpenExchange(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenMessage(false);
    setOpenExchange(false);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Profile Page</h1>
      <div
        style={{ flexDirection: "row", marginTop: "70px" }}
        className={ContentCSS.postsPageMainContainer}
      >
        <div
          style={{ height: "680px", width: "900px" }}
          className={ContentCSS.detailedPostContainer}
        >
          <div
            style={{ marginTop: "15px" }}
            className={ContentCSS.detailedPostTop}
          >
            {user[0].profileImage ? (
              <img
                style={{
                  borderRadius: "150px",
                  marginTop: "-70px",
                  width: "150px",
                  height: "150px",
                }}
                className={ContentCSS.detailedPostImg}
                src={`${import.meta.env.VITE_CLOUDINARY_URL}/${
                  user[0].profileImage
                }`}
                alt="profile pic"
              />
            ) : (
              <img
                style={{ width: "110px", height: "110px" }}
                className={ContentCSS.detailedPostImg}
                src={`${
                  import.meta.env.VITE_CLOUDINARY_URL
                }/DefaultProfile.svg`}
                alt="profile pic"
              />
            )}

            <div
              style={{ fontSize: "xxx-large", margin: "15px" }}
              className={ContentCSS.detailedPostUsername}
            >
              {user[0].username}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              textAlign: "center",
              justifyContent: "center",
              wordBreak: "break-all",
            }}
          >
            <p
              style={{
                fontSize: "larger",
                textAlign: "center",
              }}
            >
              {user[0].bio}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "center",
              margin: "auto",
              width: "50%",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                margin: "auto",
                width: "200px",
              }}
            >
              <div
                style={{
                  fontSize: "xx-large",
                  fontWeight: "bold",
                }}
              >
                {calculateAverageRating(user[0].rating)}
              </div>
              <div
                style={{
                  fontSize: "larger",
                }}
              >
                Rating
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                margin: "auto",
                width: "200px",
              }}
            >
              <div
                style={{
                  fontSize: "xx-large",
                  fontWeight: "bold",
                }}
              >
                {user[0].skills ? user[0].skills.length : 0}
              </div>
              <div
                style={{
                  fontSize: "larger",
                }}
              >
                Skills
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                margin: "auto",
                width: "200px",
              }}
            >
              <div
                style={{
                  fontSize: "xx-large",
                  fontWeight: "bold",
                }}
              >
                {certificates.length ? certificates.length : 0}
              </div>
              <div
                style={{
                  fontSize: "larger",
                }}
              >
                Certified Skills
              </div>
            </div>
          </div>

          <Collapse
            accordion
            style={{ margin: "20px" }}
            items={[
              {
                key: "1",
                label: "Skills",
                children: (
                  <p
                    style={{
                      fontSize: "larger",
                      textAlign: "center",
                    }}
                  >
                    {user[0].skills
                      ? user[0].skills.join(" - ")
                      : user[0].skills}
                  </p>
                ),
              },
              {
                key: "2",
                label: "Certified Skills",
                children: (
                  <div
                    style={{
                      fontSize: "larger",
                      textAlign: "center",
                    }}
                  >
                    {certificates.map((certificate, id) => {
                      return <span key={id}>{certificate.skill} - </span>;
                    })}
                  </div>
                ),
              },
            ]}
            defaultActiveKey={["1"]}
            onChange={(key) => {
              console.log(key);
            }}
          />
          {username == userID ? (
            <></>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "center",
                justifyContent: "center",
                margin: "auto",
                width: "40%",
                marginBottom: "30px",
              }}
            >
              <Popover
                content={
                  <form
                    onSubmit={sendMessage}
                    className={ContentCSS.contactFormContainer}
                    style={{ boxShadow: "none" }}
                  >
                    <label htmlFor="text">Type your message: </label>
                    <textarea
                      className={ContentCSS.contactMessage}
                      name="message"
                      id="message"
                      cols="40"
                      rows="10"
                      required
                      maxLength="400"
                      style={{ resize: "none" }}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                      }}
                    ></textarea>
                    <div style={{ fontSize: "small", color: "grey" }}>
                      Text Length: {content.length}/400
                    </div>
                    <hr style={{ width: "350px" }} />

                    <button
                      style={{ width: "60%" }}
                      className={ContentCSS.loginButton}
                    >
                      Confirm Message to {user[0].username}
                    </button>
                  </form>
                }
                title=""
                trigger="click"
              >
                <button
                  style={{ width: "90%", padding: "20px", margin: "20px" }}
                  className={NavCSS.btnLogin}
                  onClick={showModalMessage}
                >
                  Send Message
                </button>
              </Popover>
              <Popover
                content={
                  <form
                    onSubmit={sendRequest}
                    className={ContentCSS.contactFormContainer}
                    style={{ boxShadow: "none" }}
                  >
                    <label htmlFor="text">Channel name: </label>
                    <input
                      className={ContentCSS.loginInput}
                      type="text"
                      required
                      maxLength="10"
                      value={channel}
                      onChange={(e) => {
                        setChannel(e.target.value);
                      }}
                    />
                    <label htmlFor="text">Additonal Information: </label>
                    <textarea
                      className={ContentCSS.contactMessage}
                      name="message"
                      id="message"
                      cols="40"
                      rows="10"
                      required
                      maxLength="400"
                      style={{ resize: "none" }}
                      value={contentInfo}
                      onChange={(e) => {
                        setContentInfo(e.target.value);
                      }}
                    ></textarea>
                    <div style={{ fontSize: "small", color: "grey" }}>
                      Text Length: {contentInfo.length}/400
                    </div>
                    <hr style={{ width: "350px" }} />
                    <button
                      style={{ width: "60%" }}
                      className={ContentCSS.loginButton}
                    >
                      Send Exchange Session
                    </button>
                  </form>
                }
                title=""
                trigger="click"
              >
                <button
                  style={{ width: "90%", padding: "20px", margin: "20px" }}
                  className={NavCSS.btnLogin}
                  onClick={showModalExchange}
                >
                  Send Exchange Request
                </button>
              </Popover>
            </div>
          )}
        </div>
        {username == userID ? (
          <></>
        ) : (
          <div
            style={{ width: "100%" }}
            className={ContentCSS.registerContainer}
          >
            <div style={{ margin: "20px" }}></div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
