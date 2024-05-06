import { useState } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { ToastContainer, toast } from "react-toastify";

function Contact() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Contact Page</h1>
      <div className={ContentCSS.registerContainer}>
        <form className={ContentCSS.contactFormContainer}>
          <label htmlFor="text">Username: </label>
          <input className={ContentCSS.loginInput} type="text" required />
          <label htmlFor="text">Email: </label>
          <input className={ContentCSS.loginInput} type="email" required />
          <label htmlFor="text">Message: </label>
          <textarea
            className={ContentCSS.contactMessage}
            name="message"
            id="message"
            cols="40"
            rows="10"
            required
          ></textarea>
          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton}>Send Message</button>
        </form>
      </div>
    </>
  );
}

export default Contact;
