import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import { Cloudinary } from "@cloudinary/url-gen";

function UploadForm() {
  let navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [skill, setSkill] = useState(skillsArray[0]);
  const [description, setDescription] = useState(null);
  const [file, setFile] = useState("");
  const [skillsArray, setSkillsArray] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Deny entry to non-authorized users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      setUsername(user.username);
      setSkillsArray(user.skill);
      console.log(user);
      console.log(skillsArray);
      if (!user) {
        console.log("Unauthorized User");
        localStorage.removeItem("token");
        navigate("/login");
      } else console.log("User Authenticated");
    } else navigate("/login");
  }, []);

  const uploadFile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(file);
    const formData1 = new FormData();
    formData1.append("file", file);
    formData1.append("upload_preset", "experienceexchange");
    console.log(formData1);
    if (skill != null) {
      if (
        file.name.includes(".jpg") ||
        file.name.includes(".png") ||
        file.name.includes(".gif") ||
        file.name.includes(".jpeg") ||
        file.name.includes(".PNG") ||
        file.name.includes(".svg")
      ) {
        const responseCloudinary = await fetch(
          "https://api.cloudinary.com/v1_1/dpsa9tlr5/upload",
          {
            method: "POST",
            body: formData1,
          }
        ).catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });

        const dataCloudinary = await responseCloudinary.json();
        console.log(dataCloudinary);

        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/new`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              file: file.name,
              skill: skill,
              description: description,
            }),
          }
        ).catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });

        const data = await response.json();
        console.log(data);
        toast.success("Submitted Certificate Successfully!", {
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
      } else {
        toast.error("Wrong File Format!", {
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
      toast.error("Select a Skill", {
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
      <div className={ContentCSS.mainContainer}>
        <h1>Upload a certificate relevant to your skill</h1>
        <div className={ContentCSS.registerContainer}>
          <form
            onSubmit={uploadFile}
            className={ContentCSS.contactFormContainer}
          >
            <label htmlFor="text">Upload Here: </label>
            <input
              className={ContentCSS.loginInput}
              name="file"
              type="file"
              required
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
            />
            <label htmlFor="text">Enter the Skill: </label>

            <select
              defaultValue={skillsArray[0]}
              name="skill"
              id="skill"
              required
              value={skill}
              style={{ height: "30px" }}
              className={ContentCSS.loginInput}
              onChange={(event) => {
                setSkill(event.target.value);
              }}
            >
              {skillsArray.map((skill, id) => {
                return (
                  <option key={id} value={skill}>
                    {skill}
                  </option>
                );
              })}
            </select>
            <label htmlFor="text">Additional Information: </label>
            <textarea
              style={{ width: "300px" }}
              className={ContentCSS.contactMessage}
              type="text"
              required
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <hr style={{ width: "350px" }} />
            <button className={ContentCSS.loginButton} disabled={isSubmitting}>
              Submit for verification
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UploadForm;
