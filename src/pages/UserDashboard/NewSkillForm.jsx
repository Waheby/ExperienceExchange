import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";

function NewSkillForm() {
  let navigate = useNavigate();
  const url = "http://localhost:5000";

  const [username, setUsername] = useState("");
  const [skill, setSkill] = useState("");
  const [user, setUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const skillsArray = [];

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
      const response = await fetch(`${url}/user/get-user`, {
        method: "POST",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
    };
    getUser();
  });

  const addSkill = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    skillsArray.push(skill.toLowerCase().trim());
    const response = await fetch(`${url}/user/skill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        skills: skillsArray,
      }),
    }).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("Skill Added!", {
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
  };

  const pickTag = (tag) => {
    if (!tags.includes(tag)) {
      tags.push(tag);
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
        <h1>Add a new skill to your collection</h1>
        <div className={ContentCSS.registerContainer}>
          <form onSubmit={addSkill} className={ContentCSS.contactFormContainer}>
            <label htmlFor="text">Type your skill: </label>
            <input
              className={ContentCSS.loginInput}
              type="text"
              required
              value={skill}
              onChange={(event) => {
                setSkill(event.target.value);
              }}
            />
            <hr style={{ width: "350px" }} />
            <button className={ContentCSS.loginButton} disabled={isSubmitting}>
              Confirm & Add Skill
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewSkillForm;
