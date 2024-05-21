import { useEffect, useState } from "react";
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
import Filter from "bad-words";

function PostDetails() {
  let navigate = useNavigate();
  const params = useParams();
  var filter = new Filter();
  filter.addWords("badword", "kill", "Badword", "loser");

  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);
  const [results, setResult] = useState([]);
  const [resultsSimilar, setResultsSimilar] = useState([]);
  const [post, setPost] = useState("");
  const [content, setContent] = useState("");
  const postID = params.postId;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      setUsername(user.username);
      setRole(user.role);
      console.log(user);
    }
    getSimilarPost();
    getPost();
    getComment();
  }, []);

  const getPost = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/post/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postID: postID,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setPost(data);
  };

  const getSimilarPost = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/post/all`,
      {
        method: "GET",
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setResultsSimilar(data);
  };

  const getComment = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/comment/all`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postID: postID,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setResult(data);
  };

  const createComment = async () => {
    if (content.length <= 200 && content.length > 0) {
      if (!filter.isProfane(content)) {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/comment/new`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              postID: postID,
              content: content,
              creator: username,
            }),
          }
        ).catch((err) => {
          console.log(err);
          toast.error("Action Failed!", {
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
        console.log(data);
        if (data.status >= 400) {
          toast.error("Action Failed!", {
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
          toast.success("Comment Published Successfully!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setContent("");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        toast.error("Comment Contains Profanity!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setContent("");
      }
    } else {
      toast.error("Comment length is wrong!", {
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

  const deletePost = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/post/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: post._id,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("Post Deleted Successfully!", {
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
      navigate("/no-post");
    }, 2000);
  };

  const deleteComment = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/comment/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("Comment Deleted Successfully!", {
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
      window.location.reload();
    }, 2000);
  };

  if (role !== "admin") {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>This is the Post Page</h1>
        <div className={ContentCSS.postsPageMainContainer}>
          <div className={ContentCSS.detailedPostContainer}>
            <div className={ContentCSS.detailedPostTop}>
              <img
                className={ContentCSS.detailedPostImg}
                src={`${
                  import.meta.env.VITE_CLOUDINARY_URL
                }/DefaultProfile.svg`}
                alt="profile pic"
              />
              <div
                onClick={() => {
                  navigate(`/user/${post.creator}`);
                }}
                style={{ fontSize: "larger", margin: "15px" }}
                className={ContentCSS.detailedPostUsername}
              >
                @{post.creator}
              </div>
            </div>
            <hr style={{ width: "95%" }} />

            <div className={ContentCSS.detailedPostMid}>
              <p
                style={{
                  fontSize: "larger",
                  margin: "15px",
                  textAlign: "center",
                  height: "150px",
                }}
              >
                {post.content}
              </p>
            </div>
            <hr style={{ width: "95%" }} />
            <div className={ContentCSS.detailedPostFooter}>
              <div style={{ fontSize: "larger", textAlign: "center" }}>
                {post.tags ? post.tags.join(", ") : null}
              </div>
            </div>
          </div>
        </div>
        {username != post.creator ? (
          <></>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "auto",
                justifyContent: "center",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "10px",
              }}
            >
              <span
                style={{
                  margin: "5px",
                  fontSize: "smaller",
                  alignSelf: "center",
                }}
              >
                Delete my Post
              </span>
              <div
                className={ContentCSS.adminControlIcon}
                onClick={() => {
                  deletePost();
                }}
                style={{
                  margin: "5px",
                  cursor: "pointer",
                  display: "flex",
                  borderRadius: "10px",
                }}
              >
                <Icon
                  icon="material-symbols:delete"
                  style={{ color: "red", width: "40px", height: "40px" }}
                />
              </div>
            </div>
          </div>
        )}
        ;<h1 style={{ textAlign: "center" }}>Similar Posts </h1>
        <div className={ContentCSS.postsPageMainContainer}>
          {resultsSimilar.map((result, id) => {
            return (
              <div key={id}>
                <>
                  <div
                    className={ContentCSS.postContainer}
                    onClick={() => {
                      navigate(`/posts/${result._id}`);
                      location.reload();
                    }}
                  >
                    <div className={ContentCSS.postTop}>
                      <div
                        style={{ textAlign: "center" }}
                        className={ContentCSS.postUsername}
                      >
                        @{result.creator}
                      </div>
                    </div>
                    <hr style={{ width: "95%" }} />
                    <div style={{ overflow: "hidden", height: "150px" }}>
                      <p style={{ textAlign: "center" }}>{result.content}</p>
                    </div>
                    <hr style={{ width: "370px" }} />
                    <div className={ContentCSS.postFooter}>
                      <span
                        style={{ textAlign: "center" }}
                        className={ContentCSS.postFooterShowComments}
                      >
                        {result.tags ? result.tags.join(", ") : null}
                      </span>
                    </div>
                  </div>
                </>
              </div>
            );
          })}
        </div>
        <div>
          <h1 style={{ textAlign: "center" }}>Comments Section:</h1>
          <div className={ContentCSS.postsPageMainContainer}>
            <div className={ContentCSS.commentContainer}>
              <label style={{ textAlign: "center", marginTop: "5px" }}>
                Add a new comment:
              </label>
              <textarea
                style={{ margin: "10px" }}
                className={ContentCSS.contactMessage}
                name="message"
                id="message"
                cols="100"
                rows="5"
                required
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                }}
              ></textarea>
              <button
                onClick={() => {
                  createComment();
                }}
                className={ContentCSS.loginButton}
              >
                Publish Comment
              </button>
            </div>
          </div>
          {results.map((result, id) => {
            return (
              <div key={id} className={ContentCSS.postsPageMainContainer}>
                <div className={ContentCSS.commentContainer}>
                  <div className={ContentCSS.commentTop}>
                    <div
                      style={{ fontSize: "larger", margin: "15px" }}
                      className={ContentCSS.commentUsername}
                    >
                      @{result.creator}
                    </div>
                    <div style={{ fontSize: "smaller", textAlign: "end" }}>
                      {result.createdAt}
                    </div>
                  </div>

                  <div className={ContentCSS.commentMid}>
                    <p
                      style={{
                        fontSize: "larger",
                        margin: "15px",
                        textAlign: "center",
                      }}
                    >
                      {result.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (role === "admin") {
    return (
      <>
        <h1 style={{ textAlign: "center" }}>POST PAGE</h1>
        <div className={ContentCSS.postsPageMainContainer}>
          <div className={ContentCSS.detailedPostContainer}>
            <div className={ContentCSS.detailedPostTop}>
              <img
                className={ContentCSS.detailedPostImg}
                src={`${import.meta.env.VITE_CLOUDINARY_URL}/${post.image}`}
                alt="profile pic"
              />
              <div
                onClick={() => {
                  navigate(`/user/${post.creator}`);
                }}
                style={{ fontSize: "larger", margin: "15px" }}
                className={ContentCSS.detailedPostUsername}
              >
                @{post.creator}
              </div>
            </div>
            <hr style={{ width: "95%" }} />

            <div className={ContentCSS.detailedPostMid}>
              <p
                style={{
                  fontSize: "larger",
                  margin: "15px",
                  textAlign: "center",
                }}
              >
                {post.content}
              </p>
            </div>
            <hr style={{ width: "95%" }} />
            <div className={ContentCSS.detailedPostFooter}>
              <div style={{ fontSize: "larger", textAlign: "center" }}>
                {post.tags ? post.tags.join(", ") : null}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "auto",
              justifyContent: "center",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: "10px",
            }}
          >
            <span
              style={{
                margin: "5px",
                fontSize: "smaller",
                alignSelf: "center",
              }}
            >
              Admin Control
            </span>
            <div
              className={ContentCSS.adminControlIcon}
              onClick={() => {
                deletePost();
              }}
              style={{
                margin: "5px",
                cursor: "pointer",
                display: "flex",
                borderRadius: "10px",
              }}
            >
              <Icon
                icon="material-symbols:delete"
                style={{ color: "red", width: "40px", height: "40px" }}
              />
            </div>
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>Similar Posts </h1>
        <div className={ContentCSS.postsPageMainContainer}>
          {resultsSimilar.map((result, id) => {
            return (
              <div key={id}>
                <>
                  <div
                    className={ContentCSS.postContainer}
                    onClick={() => {
                      navigate(`/posts/${result._id}`);
                      location.reload();
                    }}
                  >
                    <div className={ContentCSS.postTop}>
                      <div
                        style={{ textAlign: "center" }}
                        className={ContentCSS.postUsername}
                      >
                        @{result.creator}
                      </div>
                    </div>
                    <hr style={{ width: "95%" }} />
                    <div style={{ overflow: "hidden", height: "150px" }}>
                      <p style={{ textAlign: "center" }}>{result.content}</p>
                    </div>
                    <hr style={{ width: "370px" }} />
                    <div className={ContentCSS.postFooter}>
                      <span
                        style={{ textAlign: "center" }}
                        className={ContentCSS.postFooterShowComments}
                      >
                        {result.tags ? result.tags.join(", ") : null}
                      </span>
                    </div>
                  </div>
                </>
              </div>
            );
          })}
        </div>
        <div></div>
        <div>
          <h1 style={{ textAlign: "center" }}>Comments Section:</h1>
          <div className={ContentCSS.postsPageMainContainer}>
            <div className={ContentCSS.commentContainer}>
              <label style={{ textAlign: "center", marginTop: "5px" }}>
                Add a new comment:
              </label>
              <textarea
                style={{ margin: "10px" }}
                className={ContentCSS.contactMessage}
                name="message"
                id="message"
                cols="100"
                rows="5"
                required
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                }}
              ></textarea>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "small",
                  color: "grey",
                }}
              >
                Text Length: {content.length}/200
              </div>
              <button
                onClick={() => {
                  createComment();
                }}
                className={ContentCSS.loginButton}
              >
                Publish Comment
              </button>
            </div>
          </div>
          {results.map((result, id) => {
            return (
              <div key={id} className={ContentCSS.postsPageMainContainer}>
                <div className={ContentCSS.commentContainer}>
                  <div className={ContentCSS.commentTop}>
                    <div
                      onClick={() => {
                        navigate(`/user/${result.creator}`);
                      }}
                      style={{ fontSize: "larger", margin: "15px" }}
                      className={ContentCSS.commentUsername}
                    >
                      @{result.creator}
                    </div>
                    <div style={{ fontSize: "smaller", textAlign: "end" }}>
                      {result.createdAt}
                    </div>
                  </div>

                  <div className={ContentCSS.commentMid}>
                    <p
                      style={{
                        fontSize: "larger",
                        margin: "15px",
                        textAlign: "center",
                      }}
                    >
                      {result.content}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "auto",
                      justifyContent: "center",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "10px",
                    }}
                  >
                    <span
                      style={{
                        margin: "5px",
                        fontSize: "smaller",
                        alignSelf: "center",
                      }}
                    >
                      Admin Control
                    </span>
                    <div
                      className={ContentCSS.adminControlIcon}
                      onClick={() => {
                        deleteComment(result._id);
                      }}
                      style={{
                        margin: "5px",
                        cursor: "pointer",
                        display: "flex",
                        borderRadius: "10px",
                      }}
                    >
                      <Icon
                        icon="material-symbols:delete"
                        style={{ color: "red", width: "40px", height: "40px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default PostDetails;
