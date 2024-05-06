import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserDashboard() {
  let navigate = useNavigate();
  const url = "http://localhost:5000";
  const token = localStorage.getItem("token");
  const user = jose.decodeJwt(token);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(null);
  const [image, setImage] = useState(null);
  const [skills, setSkills] = useState(null);
  const [email, setEmail] = useState(null);
  const [rating, setRating] = useState(null);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionToken, setSessionToken] = useState("");
  const [joined, setJoined] = useState(false);
  const [toggle, setToggle] = useState(false);

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

    getUser();
    getRequests();
    getMessages();
    getSessions();
  }, [toggle]);
  console.log(user);
  console.log(userInfo.current[0]);
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

  if (role != "admin") {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>
          This is Your User Dashboard{" "}
          <span style={{ color: "#2C5F8D" }}>{username}</span>
        </h1>

        <div
          style={{
            display: "flex",
            margin: "auto",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "20px",
            boxShadow: "2px 3px 5px #273e6e",
          }}
          className={ContentCSS.generalContainer}
        >
          <div style={{ margin: "auto", justifyContent: "center" }}>
            <span style={{ color: "#273e6e", fontSize: "larger" }}>
              User Card:
            </span>
            <div
              className={ContentCSS.generalContainer}
              style={{ padding: "30px", marginBottom: "10px" }}
            >
              <ul>
                <img
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50px",
                  }}
                  src={`./public/profile/${userInfo.current[0].profileImage}`}
                  alt="user profile picture"
                />
                <li>Username: {username}</li>
                <li>Email: {email}</li>
                <li>Biography: "{userInfo.current[0].bio}"</li>
                <li>
                  Skills:{" "}
                  {userInfo.current[0].skills
                    ? userInfo.current[0].skills.join(", ")
                    : userInfo.current[0].skills}
                </li>
                <li>Rating: {rating}</li>
                <li>Role: {role}</li>
                <li>User ID: {userInfo.current[0]._id}</li>
              </ul>
            </div>
          </div>
          <div style={{ margin: "auto", textAlign: "center" }}>
            <span style={{ color: "#273e6e", fontSize: "larger" }}>
              Messages:
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                maxWidth: "460px",
                width: "100%",
                height: "360px",
                minWidth: "260px",
                overflowWrap: "break-word",
                overflowY: "scroll",
              }}
              className={ContentCSS.generalContainer}
            >
              {messages.length > 0
                ? messages.map((result, id) => {
                    return (
                      <div
                        key={id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginRight: "15px",
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
                          <span style={{ fontSize: "smaller" }}>
                            {result.content}
                          </span>
                        </div>

                        <hr
                          style={{
                            minWidth: "260px",
                            width: "100%",
                          }}
                        ></hr>
                      </div>
                    );
                  })
                : "No Messages"}
            </div>
          </div>
          <div style={{ margin: "auto", textAlign: "center" }}>
            <div
              style={{
                margin: "10px",
              }}
            >
              <span style={{ color: "#273e6e", fontSize: "larger" }}>
                Exchange Requests:
              </span>
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
                  overflowY: "scroll",
                }}
                className={ContentCSS.generalContainer}
              >
                {requests.length > 0
                  ? requests.map((result, id) => {
                      return (
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
                      );
                    })
                  : "No requests yet"}
              </div>
            </div>
            <div
              style={{
                margin: "10px",
              }}
            >
              <span style={{ color: "#273e6e", fontSize: "larger" }}>
                Sessions Available:
              </span>
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
                  overflowY: "scroll",
                }}
                className={ContentCSS.generalContainer}
              >
                {sessions.length > 0
                  ? sessions.map((result, id) => {
                      return (
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
                              You can join a session with @
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
                              }}
                            >
                              Join
                            </button>
                            <button
                              onClick={() => {
                                deleteSession(result._id);
                              }}
                              style={{
                                margin: "auto",
                                marginLeft: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              Close
                            </button>
                          </div>
                          <hr
                            style={{
                              minWidth: "260px",
                            }}
                          ></hr>
                        </div>
                      );
                    })
                  : "No Sessions available"}
              </div>
            </div>
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>Actions:</h1>
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
            <div className={ContentCSS.dashboardText}>Create New Post</div>
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
            <div className={ContentCSS.dashboardText}>Change Biography</div>
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
            <div className={ContentCSS.dashboardText}>Change Password</div>
          </Link>
          <Link
            className={ContentCSS.dashboardContainer}
            to={"/userdashboard/posts-history"}
          >
            <div>
              <Icon
                className={ContentCSS.dashboardIcon}
                icon="solar:posts-carousel-vertical-outline"
                style={{ color: "#2C5F8D" }}
              />
            </div>
            <div className={ContentCSS.dashboardText}>My Posts History</div>
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
      </>
    );
  }

  if (role === "admin") {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>
          Welcome to Your Admin Dashboard{" "}
          <span style={{ color: "#2C5F8D" }}>{username}</span>
        </h1>
        <div
          style={{
            display: "flex",
            margin: "auto",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: "20px",
            boxShadow: "2px 3px 5px #273e6e",
          }}
          className={ContentCSS.generalContainer}
        >
          <div style={{ margin: "auto", justifyContent: "center" }}>
            <span style={{ color: "#273e6e", fontSize: "larger" }}>
              User Card:
            </span>
            <div
              className={ContentCSS.generalContainer}
              style={{ padding: "30px", marginBottom: "10px" }}
            >
              <ul>
                <img
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50px",
                  }}
                  src={`./public/profile/${userInfo.current[0].profileImage}`}
                  alt="user profile picture"
                />
                <li>Username: {username}</li>
                <li>Email: {email}</li>
                <li>Biography: "{userInfo.current[0].bio}"</li>
                <li>
                  Skills:{" "}
                  {userInfo.current[0].skills
                    ? userInfo.current[0].skills.join(", ")
                    : userInfo.current[0].skills}
                </li>
                <li>Rating: {rating}</li>
                <li>Role: {role}</li>
                <li>User ID: {userInfo.current[0]._id}</li>
              </ul>
            </div>
          </div>
          <div style={{ margin: "auto", textAlign: "center" }}>
            <span style={{ color: "#273e6e", fontSize: "larger" }}>
              Messages:
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                maxWidth: "460px",
                width: "100%",
                height: "360px",
                minWidth: "260px",
                overflowWrap: "break-word",
                overflowY: "scroll",
              }}
              className={ContentCSS.generalContainer}
            >
              {messages.length > 0
                ? messages.map((result, id) => {
                    return (
                      <div
                        key={id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginRight: "15px",
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
                          <span style={{ fontSize: "smaller" }}>
                            {result.content}
                          </span>
                        </div>

                        <hr
                          style={{
                            minWidth: "260px",
                            width: "100%",
                          }}
                        ></hr>
                      </div>
                    );
                  })
                : "No Messages"}
            </div>
          </div>
          <div style={{ margin: "auto", textAlign: "center" }}>
            <div
              style={{
                margin: "10px",
              }}
            >
              <span style={{ color: "#273e6e", fontSize: "larger" }}>
                Exchange Requests:
              </span>
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
                  overflowY: "scroll",
                }}
                className={ContentCSS.generalContainer}
              >
                {requests.length > 0
                  ? requests.map((result, id) => {
                      return (
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
                      );
                    })
                  : "No requests yet"}
              </div>
            </div>
            <div
              style={{
                margin: "10px",
              }}
            >
              <span style={{ color: "#273e6e", fontSize: "larger" }}>
                Sessions Available:
              </span>
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
                  overflowY: "scroll",
                }}
                className={ContentCSS.generalContainer}
              >
                {sessions.length > 0
                  ? sessions.map((result, id) => {
                      return (
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
                              You can join a session with @
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
                              }}
                            >
                              Join
                            </button>
                            <button
                              onClick={() => {
                                deleteSession(result._id);
                              }}
                              style={{
                                margin: "auto",
                                marginLeft: "5px",
                                borderRadius: "10px",
                              }}
                            >
                              Close
                            </button>
                          </div>
                          <hr
                            style={{
                              minWidth: "260px",
                            }}
                          ></hr>
                        </div>
                      );
                    })
                  : "No Sessions available"}
              </div>
            </div>
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>Actions:</h1>
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
            <div className={ContentCSS.dashboardText}>Verify User Skills</div>
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
            <div className={ContentCSS.dashboardText}>Suspend a User</div>
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
            <div className={ContentCSS.dashboardText}>Publish Announcement</div>
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
            <div className={ContentCSS.dashboardText}>Create New Posts</div>
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
            <div className={ContentCSS.dashboardText}>Change Biography</div>
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
            <div className={ContentCSS.dashboardText}>Change Password</div>
          </Link>
          <Link
            className={ContentCSS.dashboardContainer}
            to={"/userdashboard/posts-history"}
          >
            <div>
              <Icon
                className={ContentCSS.dashboardIcon}
                icon="solar:posts-carousel-vertical-outline"
                style={{ color: "#2C5F8D" }}
              />
            </div>
            <div className={ContentCSS.dashboardText}>My Posts History</div>
          </Link>
        </div>
      </>
    );
  }
}

export default UserDashboard;
