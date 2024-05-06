import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import Filter from "bad-words";

function NewPostForm() {
  let navigate = useNavigate();
  const url = "http://localhost:5000";
  var filter = new Filter();

  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = [];

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

  const createPost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!filter.isProfane(content)) {
      if (!filter.isProfane(title)) {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/post/new`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              content: content,
              creator: username,
              tags: tags,
            }),
          }
        ).catch((err) => {
          console.log(err);
        });

        const data = await response.json();
        console.log(data);
        toast.success("Post is Created!", {
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
          navigate("/posts");
        }, 2000);
      } else {
        toast.error("Post Contains Profanity!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTitle("");
        setContent("");
      }
    } else {
      toast.error("Post Contains Profanity!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTitle("");
      setContent("");
    }
  };

  const pickTag = (tag) => {
    if (!tags.includes(tag)) {
      tags.push(tag.toLowerCase().trim());
      console.log(tags);
      document.getElementById(tag).style.backgroundColor = "rgb(39, 62, 110)";
      document.getElementById(tag).style.color = "white";
    } else if (tags.includes(tag)) {
      document.getElementById(tag).style.backgroundColor = "white";
      document.getElementById(tag).style.color = "black";
      tags.pop(tag);
      console.log(tags);
    }
  };

  return (
    <>
      <div className={ContentCSS.mainContainer}>
        <h1>Share a New Post with the Community</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={createPost}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Title: </label>
            <input
              className={ContentCSS.loginInput}
              type="text"
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <label htmlFor="text">Post: </label>
            <textarea
              className={ContentCSS.contactMessage}
              name="message"
              id="message"
              cols="40"
              rows="10"
              required
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
              }}
            ></textarea>
            <label htmlFor="text">Pick relevant tags: </label>
            <div className={ContentCSS.tagsContainer}>
              <div
                id="programming"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("programming");
                }}
              >
                Programming
              </div>
              <div
                id="network"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("network");
                }}
              >
                Network
              </div>
              <div
                id="cybersecurity"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("cybersecurity");
                }}
              >
                Cybersecurity
              </div>
              <div
                id="ai"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("ai");
                }}
              >
                AI
              </div>
              <div
                id="business management"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("business management");
                }}
              >
                Business Management
              </div>
              <div
                id="marketing"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("marketing");
                }}
              >
                Marketing
              </div>
              <div
                id="accounting"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("accounting");
                }}
              >
                Accounting
              </div>
              <div
                id="sales"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("sales");
                }}
              >
                Sales
              </div>
              <div
                id="architecture"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("architecture");
                }}
              >
                Architecture
              </div>
              <div
                id="mechanics"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("mechanics");
                }}
              >
                Mechanics
              </div>
              <div
                id="chemistry"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("chemistry");
                }}
              >
                Chemistry
              </div>
              <div
                id="physics"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("physics");
                }}
              >
                Physics
              </div>
              <div
                id="language"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("language");
                }}
              >
                Language
              </div>
              <div
                id="writing"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("writing");
                }}
              >
                Writing
              </div>
              <div
                id="medicine"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("medicine");
                }}
              >
                Medicine
              </div>
              <div
                id="mathematics"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("mathematics");
                }}
              >
                Mathematics
              </div>
              <div
                id="law"
                className={ContentCSS.tagButton}
                onClick={function (e) {
                  pickTag("law");
                }}
              >
                Law
              </div>
            </div>
            <hr style={{ width: "350px" }} />
            <button className={ContentCSS.loginButton} disabled={isSubmitting}>
              Share Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPostForm;
