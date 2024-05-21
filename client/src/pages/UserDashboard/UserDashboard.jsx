import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReactStars from "react-rating-stars-component";
import { Button, Drawer, Modal, Popover } from "antd";

function UserDashboard() {
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jose.decodeJwt(token);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(null);
  const [image, setImage] = useState(null);
  const [skills, setSkills] = useState(null);
  const [email, setEmail] = useState(null);
  const [rating, setRating] = useState([]);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sessionToken, setSessionToken] = useState("");
  const [joined, setJoined] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [newRating, setNewRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [certificates, setCertificates] = useState([""]);
  const [openMessage, setOpenMessage] = useState(false);
  const [openPosts, setOpenPosts] = useState(false);
  const [openExchange, setOpenExchange] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const showMessage = () => {
    setOpenMessage(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const showExchange = () => {
    setOpenExchange(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const showSession = () => {
    setOpenSession(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const showPosts = () => {
    setOpenPosts(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const userInfo = useRef([""]);
  let seperatedSkills = "";

  //Deny entry to non-authorized users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      setUsername(user.username);
      setRole(user.role);
      setImage(user.image);
      setEmail(user.email);
      setSkills(user.skill);
      setRating(user.rating);

      if (!user) {
        console.log("Unauthorized User");
        localStorage.removeItem("token");
        navigate("/login");
      } else console.log("User Authenticated");
    } else navigate("/login");

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
            username: username,
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
            username: username,
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      userInfo.current = data;

      // console.log(userInfo.current[0]);
    };

    const getMessages = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/get-messages`,
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
      setMessages(data);
      console.log(messages);
    };

    const getRequests = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/get-requests`,
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
      setRequests(data);
      console.log(requests);
    };

    const getSessions = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/available-sessions`,
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
      setSessions(data);
      console.log(data);
    };

    const getPost = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      setPosts(data);
    };

    getUser();
    getUserCerts();
    getRequests();
    getMessages();
    getSessions();
    getPost();
  }, [toggle]);
  console.log(user.image);
  console.log(userInfo.current[0].profileImage);
  // const createSession = async () => {
  //   const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/user/generate-token`, {
  //     method: "GET",
  //     headers: {
  //       "x-access-token": localStorage.getItem("token"),
  //     },
  //   }).catch((err) => {
  //     console.log(err);
  //   });

  //   const data = await response.json();
  //   setSessionToken(data);
  //   console.log(data);
  // };

  const modifyRequest = async (requestID, status) => {
    console.log(status);

    const responseModifyStatus = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/modify-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: requestID,
          status: status,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const dataModifyStatus = await responseModifyStatus.json();
    console.log(dataModifyStatus);
    setSessionToken(dataModifyStatus);
    setToggle((prevState) => !prevState);
  };

  const deleteSession = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/delete-request`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setToggle((prevState) => !prevState);
  };

  const joinSession = (channelToken, channelName) => {
    navigate(`/session?token=${channelToken}&name=${channelName}`);
  };

  const ratingChanged = (newRating) => {
    console.log(newRating);
    setNewRating(newRating);
  };

  const calculateAverageRating = (rating) => {
    console.log(rating);
    if (rating != null) {
      const sum = rating.reduce((partialSum, a) => partialSum + a, 0);
      const count = rating.length;
      const average = (sum / count).toFixed(1);
      return average;
    } else return rating;
  };

  const modifyRating = async (toUser, fromUser, sessionId) => {
    console.log(toUser, fromUser);
    var otherUser = null;
    if (toUser == username) {
      otherUser = fromUser;
    } else otherUser = toUser;

    console.log(otherUser);
    if (newRating != null) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            rating: newRating,
            user: otherUser,
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
      toast.success("Rated Successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      deleteSession(sessionId);
    } else {
      toast.error("Rating cannot be empty!", {
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

  if (role != "admin") {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>
          Hello, <span style={{ color: "#2C5F8D" }}>{username}</span>
        </h1>

        <div className={ContentCSS.generalContainerDashboard}>
          <div
            style={{
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "#273e6e",
                fontSize: "larger",
                textAlign: "center",
              }}
            >
              User Card:
            </div>
            <div
              className={ContentCSS.generalContainer}
              style={{
                padding: "30px",
                marginBottom: "10px",
                maxWidth: "500px",
                minWidth: "350px",
              }}
            >
              <ul style={{ overflowWrap: "anywhere", listStyleType: "none" }}>
                {userInfo.current[0].profileImage ? (
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50px",
                    }}
                    src={`${import.meta.env.VITE_CLOUDINARY_URL}/${
                      userInfo.current[0].profileImage
                    }`}
                    alt="user profile picture"
                  />
                ) : (
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50px",
                    }}
                    src={`${
                      import.meta.env.VITE_CLOUDINARY_URL
                    }/DefaultProfile.svg`}
                    alt="user profile picture"
                  />
                )}

                <li>
                  <strong>Username:</strong> {username}
                </li>
                <li>
                  <strong>Email:</strong> {email}
                </li>
                <li>
                  <strong>Biography:</strong> "{userInfo.current[0].bio}"
                </li>
                <li>
                  <strong>Skills:</strong>{" "}
                  {userInfo.current[0].skills
                    ? userInfo.current[0].skills.join(" - ")
                    : userInfo.current[0].skills}
                </li>
                <li>
                  <strong>Certified Skills:</strong>{" "}
                  {certificates.map((certificate, id) => {
                    return <span key={id}>{certificate.skill} - </span>;
                  })}
                </li>
                <li>
                  <strong>Rating:</strong> {calculateAverageRating(rating)}
                </li>
                <li>
                  <strong>Role:</strong> {role}
                </li>
                <li>
                  <strong>User ID:</strong> {userInfo.current[0]._id}
                </li>
              </ul>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              margin: "auto",
              width: "100%",
            }}
          >
            <div className={ContentCSS.dashboardMainContainer}>
              <div>
                <span style={{ color: "#273e6e", fontSize: "larger" }}>
                  Interactions:
                </span>
              </div>
              <div className={ContentCSS.dashboardMainContainer}>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showMessage}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {messages.length ? messages.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>Messages</div>
                </Button>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showExchange}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {requests.length ? requests.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>
                    Exchange Requests
                  </div>
                </Button>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showSession}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {sessions.length ? sessions.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>Sessions</div>
                </Button>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showPosts}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {posts.length ? posts.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>My Posts</div>
                </Button>
              </div>
            </div>
            <Drawer
              closable
              destroyOnClose
              title={<p>Messages</p>}
              placement="right"
              open={openMessage}
              loading={loading}
              onClose={() => setOpenMessage(false)}
            >
              {messages.length > 0
                ? messages.map((result, id) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "auto",
                          width: "100%",
                          overflowWrap: "break-word",
                          marginBottom: "10px",
                        }}
                        className={ContentCSS.generalContainer}
                      >
                        <div
                          key={id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "10px",
                            padding: "10px",
                          }}
                        >
                          <div>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                navigate(`/user/${result.fromUser}`);
                              }}
                            >
                              @{result.fromUser}:{" "}
                            </span>
                            <br />
                            <span style={{ fontSize: "smaller" }}>
                              {result.content}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : "No Messages"}
            </Drawer>
            <Drawer
              closable
              destroyOnClose
              title={<p>Exchanges Requests</p>}
              placement="right"
              open={openExchange}
              loading={loading}
              onClose={() => setOpenExchange(false)}
            >
              {" "}
              {requests.length > 0
                ? requests.map((result, id) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "auto",
                          maxWidth: "460px",
                          width: "100%",
                          minWidth: "260px",
                          minHeight: "100px",
                          maxHeight: "200px",
                          overflowWrap: "break-word",
                        }}
                        className={ContentCSS.generalContainer}
                      >
                        <div
                          key={id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px",
                            marginRight: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              padding: "10px",
                            }}
                          >
                            <span>
                              @{result.fromUser} sent you an exchange request
                            </span>
                            <button
                              onClick={() => {
                                modifyRequest(result._id, "accept");
                              }}
                              style={{
                                margin: "auto",
                                marginLeft: "5px",
                                marginRight: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                modifyRequest(result._id, "deny");
                              }}
                              style={{
                                margin: "auto",
                                borderRadius: "10px",
                              }}
                            >
                              Deny
                            </button>
                          </div>
                          <hr
                            style={{
                              minWidth: "260px",
                            }}
                          ></hr>
                        </div>
                      </div>
                    );
                  })
                : "No requests yet"}
            </Drawer>
            <Drawer
              closable
              destroyOnClose
              title={<p>Sessions Available</p>}
              placement="right"
              open={openSession}
              loading={loading}
              onClose={() => setOpenSession(false)}
            >
              {" "}
              {sessions.length > 0
                ? sessions.map((result, id) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "auto",
                          maxWidth: "460px",
                          width: "100%",
                          minWidth: "260px",
                          maxHeight: "200px",
                          overflowWrap: "break-word",
                        }}
                        className={ContentCSS.generalContainer}
                      >
                        <div
                          key={id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px",
                            marginRight: "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <span>
                              You have an open session with @
                              {result.fromUser == username
                                ? result.toUser
                                : result.fromUser}
                            </span>
                            <button
                              onClick={() => {
                                joinSession(
                                  result.channelToken,
                                  result.channel
                                );
                              }}
                              style={{
                                margin: "auto",
                                marginLeft: "5px",
                                borderRadius: "10px",
                                width: "150px",
                                height: "45px",
                              }}
                            >
                              Join
                            </button>

                            <Popover
                              content={
                                <div
                                  style={{
                                    textAlign: "center",
                                    justifyContent: "center",
                                    justifyItems: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    borderRadius: "15px",
                                    padding: "30px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "DM Sans",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {" "}
                                    Rate the Session{" "}
                                  </span>
                                  <div
                                    style={{
                                      width: "300px",
                                      margin: "auto",
                                    }}
                                  >
                                    <ReactStars
                                      count={10}
                                      onChange={ratingChanged}
                                      size={34}
                                      activeColor="#ffd700"
                                    />
                                  </div>
                                  <br />
                                  <button
                                    style={{
                                      borderRadius: "15px",
                                      padding: "10px",
                                    }}
                                    onClick={() => {
                                      modifyRating(
                                        result.toUser,
                                        result.fromUser,
                                        result._id
                                      );
                                    }}
                                  >
                                    Submit Rating
                                  </button>
                                </div>
                              }
                              title=""
                              trigger="click"
                            >
                              <button
                                onClick={showModal}
                                style={{
                                  margin: "auto",
                                  marginLeft: "5px",
                                  borderRadius: "10px",
                                  width: "150px",
                                  height: "45px",
                                }}
                              >
                                End
                              </button>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : "No Sessions available"}
            </Drawer>
            <Drawer
              closable
              destroyOnClose
              title={<p>My Posts History</p>}
              placement="right"
              open={openPosts}
              loading={loading}
              onClose={() => setOpenPosts(false)}
            >
              <div style={{}} className={ContentCSS.postsPageMainContainer}>
                {posts.map((result, id) => {
                  return (
                    <div key={id}>
                      <>
                        <div
                          onClick={() => navigate(`/posts/${result._id}`)}
                          style={{
                            cursor: "pointer",
                            width: "340px",
                            margin: "auto",
                          }}
                          className={ContentCSS.postContainer}
                        >
                          <div className={ContentCSS.postTop}>
                            <div
                              style={{ textAlign: "center" }}
                              className={ContentCSS.postUsername}
                            >
                              @{result.creator}
                            </div>
                          </div>
                          <div>
                            <p
                              style={{
                                margin: "10px",
                                textAlign: "center",
                                overflow: "clip",
                                wordBreak: "break-all",
                              }}
                            >
                              {result.content}
                            </p>
                          </div>

                          <div
                            style={{ flexDirection: "column" }}
                            className={ContentCSS.postFooter}
                          >
                            <hr style={{ width: "338px" }} />
                            <div
                              style={{ textAlign: "center" }}
                              className={ContentCSS.postFooterTag}
                            >
                              {result.tags.join(", ")}
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                  );
                })}
              </div>
            </Drawer>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                margin: "auto",
                flexGrow: "1",
              }}
            >
              <div>
                <div
                  style={{
                    textAlign: "center",
                    color: "#273e6e",
                    fontSize: "larger",
                  }}
                >
                  Actions:
                </div>
              </div>
              <div className={ContentCSS.dashboardMainContainer}>
                <Link
                  className={ContentCSS.dashboardContainer}
                  to={"/userdashboard/skill"}
                >
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="icons8:plus"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>Add New Skill</div>
                </Link>
                <Link
                  className={ContentCSS.dashboardContainer}
                  to={"/userdashboard/newpost"}
                >
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="material-symbols:post-add"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>
                    Create New Post
                  </div>
                </Link>
                <Link
                  className={ContentCSS.dashboardContainer}
                  to={"/userdashboard/bio"}
                >
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="fluent:text-description-16-filled"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>
                    Change Biography
                  </div>
                </Link>
                <Link
                  className={ContentCSS.dashboardContainer}
                  to={"/userdashboard/upload"}
                >
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="iconamoon:profile-circle-duotone"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>
                    Change Profile Picture
                  </div>
                </Link>
                <Link className={ContentCSS.dashboardContainer}>
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="mdi:email-edit-outline"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>Change Email</div>
                </Link>
                <Link
                  className={ContentCSS.dashboardContainer}
                  // to={"/userdashboard/newpost"}
                >
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="carbon:password"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>
                    Change Password
                  </div>
                </Link>
                <Link
                  className={ContentCSS.dashboardContainer}
                  to={"/userdashboard/verify"}
                >
                  <div>
                    <Icon
                      className={ContentCSS.dashboardIcon}
                      icon="bitcoin-icons:verify-filled"
                      style={{ color: "#2C5F8D" }}
                    />
                  </div>
                  <div className={ContentCSS.dashboardText}>Verify Skill</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //                    _               _
  //        /\         | |             (_)
  //       /  \      __| |  _ __ ___    _   _ __
  //      / /\ \    / _` | | '_ ` _ \  | | | '_ \
  //     / ____ \  | (_| | | | | | | | | | | | | |
  //    /_/    \_\  \__,_| |_| |_| |_| |_| |_| |_|
  //
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//
  //==================================================================//

  if (role === "admin") {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>
          Hello, <span style={{ color: "#2C5F8D" }}>{username}</span>
        </h1>
        <div className={ContentCSS.generalContainerDashboard}>
          <div
            style={{
              margin: "auto",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "#273e6e",
                fontSize: "larger",
                textAlign: "center",
              }}
            >
              User Card:
            </div>
            <div
              className={ContentCSS.generalContainer}
              style={{
                padding: "30px",
                marginBottom: "10px",
                maxWidth: "500px",
                minWidth: "350px",
              }}
            >
              <ul style={{ overflowWrap: "anywhere", listStyleType: "none" }}>
                {userInfo.current[0].profileImage ? (
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50px",
                    }}
                    src={`${import.meta.env.VITE_CLOUDINARY_URL}/${
                      userInfo.current[0].profileImage
                    }`}
                    alt="user profile picture"
                  />
                ) : (
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50px",
                    }}
                    src={`${
                      import.meta.env.VITE_CLOUDINARY_URL
                    }/DefaultProfile.svg`}
                    alt="user profile picture"
                  />
                )}
                <li>
                  <strong>Username:</strong> {username}
                </li>
                <li>
                  <strong>Email:</strong> {email}
                </li>
                <li>
                  <strong>Biography:</strong> "{userInfo.current[0].bio}"
                </li>
                <li>
                  <strong>Skills:</strong>{" "}
                  {userInfo.current[0].skills
                    ? userInfo.current[0].skills.join(" - ")
                    : userInfo.current[0].skills}
                </li>
                <li>
                  <strong>Certified Skills:</strong>{" "}
                  {certificates.map((certificate, id) => {
                    return <span key={id}>{certificate.skill} - </span>;
                  })}
                </li>
                <li>
                  <strong>Rating:</strong> {calculateAverageRating(rating)}
                </li>
                <li>
                  <strong>Role:</strong> {role}
                </li>
                <li>
                  <strong>User ID:</strong> {userInfo.current[0]._id}
                </li>
              </ul>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              margin: "auto",
              width: "100%",
            }}
          >
            <div className={ContentCSS.dashboardMainContainer}>
              <div>
                <span style={{ color: "#273e6e", fontSize: "larger" }}>
                  Stats:
                </span>
              </div>
              <div className={ContentCSS.dashboardMainContainer}>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showMessage}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {messages.length ? messages.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>Messages</div>
                </Button>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showExchange}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {requests.length ? requests.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>
                    Exchange Requests
                  </div>
                </Button>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showSession}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {sessions.length ? sessions.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>Open Sessions</div>
                </Button>
                <Button
                  className={ContentCSS.dashboardContainer}
                  onClick={showPosts}
                >
                  <span style={{ fontSize: "xx-large" }}>
                    {posts.length ? posts.length : 0}
                  </span>
                  <div className={ContentCSS.dashboardText}>My Posts</div>
                </Button>
              </div>
              <Drawer
                closable
                destroyOnClose
                title={<p>Messages</p>}
                placement="right"
                open={openMessage}
                loading={loading}
                onClose={() => setOpenMessage(false)}
              >
                {messages.length > 0
                  ? messages.map((result, id) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                            width: "100%",
                            overflowWrap: "break-word",
                            marginBottom: "10px",
                          }}
                          className={ContentCSS.generalContainer}
                        >
                          <div
                            key={id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginLeft: "10px",
                              padding: "10px",
                            }}
                          >
                            <div>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  navigate(`/user/${result.fromUser}`);
                                }}
                              >
                                @{result.fromUser}:{" "}
                              </span>
                              <br />
                              <span style={{ fontSize: "smaller" }}>
                                {result.content}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : "No Messages"}
              </Drawer>
              <Drawer
                closable
                destroyOnClose
                title={<p>Exchanges Requests</p>}
                placement="right"
                open={openExchange}
                loading={loading}
                onClose={() => setOpenExchange(false)}
              >
                {" "}
                {requests.length > 0
                  ? requests.map((result, id) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                            maxWidth: "460px",
                            width: "100%",
                            minWidth: "260px",
                            minHeight: "100px",
                            maxHeight: "200px",
                            overflowWrap: "break-word",
                          }}
                          className={ContentCSS.generalContainer}
                        >
                          <div
                            key={id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "10px",
                              marginRight: "15px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: "10px",
                              }}
                            >
                              <span>
                                @{result.fromUser} sent you an exchange request
                              </span>
                              <button
                                onClick={() => {
                                  modifyRequest(result._id, "accept");
                                }}
                                style={{
                                  margin: "auto",
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                  borderRadius: "10px",
                                }}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  modifyRequest(result._id, "deny");
                                }}
                                style={{
                                  margin: "auto",
                                  borderRadius: "10px",
                                }}
                              >
                                Deny
                              </button>
                            </div>
                            <hr
                              style={{
                                minWidth: "260px",
                              }}
                            ></hr>
                          </div>
                        </div>
                      );
                    })
                  : "No requests yet"}
              </Drawer>
              <Drawer
                closable
                destroyOnClose
                title={<p>Sessions Available</p>}
                placement="right"
                open={openSession}
                loading={loading}
                onClose={() => setOpenSession(false)}
              >
                {" "}
                {sessions.length > 0
                  ? sessions.map((result, id) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "auto",
                            maxWidth: "460px",
                            width: "100%",
                            minWidth: "260px",
                            maxHeight: "200px",
                            overflowWrap: "break-word",
                          }}
                          className={ContentCSS.generalContainer}
                        >
                          <div
                            key={id}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "10px",
                              marginRight: "15px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <span>
                                You have an open session with @
                                {result.fromUser == username
                                  ? result.toUser
                                  : result.fromUser}
                              </span>
                              <button
                                onClick={() => {
                                  joinSession(
                                    result.channelToken,
                                    result.channel
                                  );
                                }}
                                style={{
                                  margin: "auto",
                                  marginLeft: "5px",
                                  borderRadius: "10px",
                                  width: "150px",
                                  height: "45px",
                                }}
                              >
                                Join
                              </button>

                              <Popover
                                content={
                                  <div
                                    style={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                      justifyItems: "center",
                                      alignContent: "center",
                                      alignItems: "center",
                                      borderRadius: "15px",
                                      padding: "30px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontFamily: "DM Sans",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {" "}
                                      Rate the Session{" "}
                                    </span>
                                    <div
                                      style={{
                                        width: "300px",
                                        margin: "auto",
                                      }}
                                    >
                                      <ReactStars
                                        count={10}
                                        onChange={ratingChanged}
                                        size={34}
                                        activeColor="#ffd700"
                                      />
                                    </div>
                                    <br />
                                    <button
                                      style={{
                                        borderRadius: "15px",
                                        padding: "10px",
                                      }}
                                      onClick={() => {
                                        modifyRating(
                                          result.toUser,
                                          result.fromUser,
                                          result._id
                                        );
                                      }}
                                    >
                                      Submit Rating
                                    </button>
                                  </div>
                                }
                                title=""
                                trigger="click"
                              >
                                <button
                                  onClick={showModal}
                                  style={{
                                    margin: "auto",
                                    marginLeft: "5px",
                                    borderRadius: "10px",
                                    width: "150px",
                                    height: "45px",
                                  }}
                                >
                                  End
                                </button>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : "No Sessions available"}
              </Drawer>
              <Drawer
                closable
                destroyOnClose
                title={<p>My Posts History</p>}
                placement="right"
                open={openPosts}
                loading={loading}
                onClose={() => setOpenPosts(false)}
              >
                <div style={{}} className={ContentCSS.postsPageMainContainer}>
                  {posts.map((result, id) => {
                    return (
                      <div key={id}>
                        <>
                          <div
                            onClick={() => navigate(`/posts/${result._id}`)}
                            style={{
                              cursor: "pointer",
                              width: "340px",
                              margin: "auto",
                            }}
                            className={ContentCSS.postContainer}
                          >
                            <div className={ContentCSS.postTop}>
                              <div
                                style={{ textAlign: "center" }}
                                className={ContentCSS.postUsername}
                              >
                                @{result.creator}
                              </div>
                            </div>
                            <div>
                              <p
                                style={{
                                  margin: "10px",
                                  textAlign: "center",
                                  overflow: "clip",
                                  wordBreak: "break-all",
                                }}
                              >
                                {result.content}
                              </p>
                            </div>

                            <div
                              style={{ flexDirection: "column" }}
                              className={ContentCSS.postFooter}
                            >
                              <hr style={{ width: "338px" }} />
                              <div
                                style={{ textAlign: "center" }}
                                className={ContentCSS.postFooterTag}
                              >
                                {result.tags.join(", ")}
                              </div>
                            </div>
                          </div>
                        </>
                      </div>
                    );
                  })}
                </div>
              </Drawer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "100%",
                  margin: "auto",
                  flexGrow: "1",
                }}
              >
                <div>
                  <div
                    style={{
                      textAlign: "center",
                      color: "#273e6e",
                      fontSize: "larger",
                    }}
                  >
                    Actions:
                  </div>
                </div>
                <div className={ContentCSS.dashboardMainContainer}>
                  <Link
                    className={ContentCSS.dashboardContainer}
                    to={"/userdashboard/check-verify"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="bitcoin-icons:verify-filled"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>
                      Verify User Skills
                    </div>
                  </Link>
                  <Link
                    className={ContentCSS.dashboardContainer}
                    to={"/userdashboard/suspend"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="mdi:person-block"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>
                      Suspend a User
                    </div>
                  </Link>

                  <Link
                    className={ContentCSS.dashboardContainer}
                    to={"/userdashboard/announcement"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="grommet-icons:announce"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>Announcement</div>
                  </Link>
                  <Link
                    className={ContentCSS.dashboardContainer}
                    to={"/userdashboard/newpost"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="material-symbols:post-add"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>
                      Create New Posts
                    </div>
                  </Link>
                  <Link
                    className={ContentCSS.dashboardContainer}
                    to={"/userdashboard/bio"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="fluent:text-description-16-filled"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>
                      Change Biography
                    </div>
                  </Link>
                  <Link
                    className={ContentCSS.dashboardContainer}
                    to={"/userdashboard/upload"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="iconamoon:profile-circle-duotone"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>
                      Change Profile Picture
                    </div>
                  </Link>
                  {/* <Link
            className={ContentCSS.dashboardContainer}
            to={"/userdashboard/username"}
          >
            <div>
              <Icon
                className={ContentCSS.dashboardIcon}
                icon="mdi:rename-outline"
                style={{ color: "#2C5F8D" }}
              />
            </div>
            <div className={ContentCSS.dashboardText}>Change Username</div>
          </Link> */}
                  <Link
                    className={ContentCSS.dashboardContainer}
                    // to={"/userdashboard/newpost"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="mdi:email-edit-outline"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>Change Email</div>
                  </Link>
                  <Link
                    className={ContentCSS.dashboardContainer}
                    // to={"/userdashboard/newpost"}
                  >
                    <div>
                      <Icon
                        className={ContentCSS.dashboardIcon}
                        icon="carbon:password"
                        style={{ color: "#2C5F8D" }}
                      />
                    </div>
                    <div className={ContentCSS.dashboardText}>
                      Change Password
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UserDashboard;
