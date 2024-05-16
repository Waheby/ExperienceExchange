import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import Filter from "bad-words";

function Contact() {
  let navigate = useNavigate();
  var filter = new Filter();
  filter.addWords("badword", "kill", "Badword", "loser");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const sendContactMessage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (token) {
      if (message.length <= 600 && message.length > 0) {
        if (!filter.isProfane(message)) {
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP_API_URL}/user/contact`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                title: title,
                message: message,
              }),
            }
          ).catch((err) => {
            console.log(err);
          });

          const data = await response.json();
          console.log(data);
          toast.success("Sent Contact Message Successfully!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setMessage("");
        } else {
          toast.error("Message Contains Profanity", {
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
        toast.error("Message Length is Wrong", {
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
      toast.error("Log in to send a Contact Message", {
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
      <h1 style={{ textAlign: "center" }}>Contact Page</h1>
      <div className={ContentCSS.registerContainer}>
        <form
          onSubmit={sendContactMessage}
          className={ContentCSS.contactFormContainer}
        >
          <label htmlFor="text">Title: </label>
          <input
            className={ContentCSS.loginInput}
            type="text"
            required
            maxLength="30"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <label htmlFor="text">Message: </label>
          <textarea
            className={ContentCSS.contactMessage}
            name="message"
            id="message"
            cols="40"
            rows="10"
            maxLength="600"
            required
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          ></textarea>
          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton} disabled={isSubmitting}>
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}

export default Contact;
