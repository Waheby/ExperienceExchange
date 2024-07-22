import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import { Cloudinary } from "@cloudinary/url-gen";
import { useSelector } from "react-redux";
import { border } from "@cloudinary/url-gen/qualifiers/background";
import { Empty, Flex } from "antd";
import { Collapse, Modal, Popover } from "antd";

import { auto } from "@cloudinary/url-gen/actions/resize";

function UploadForm() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [skill, setSkill] = useState(null);
  const [description, setDescription] = useState(null);
  const [file, setFile] = useState("");
  const [skillsArray, setSkillsArray] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [cloudinaryFileName, setCloudinaryFileName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const userInfo = useRef([""]);
  const certsInfo = useRef([""]);

  const [results, setResult] = useState([]);

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
    console.log(userInfo.current[0].skills);

    const responseCert = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/all-user-cert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username: userInfo.current[0].username,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const dataCert = await responseCert.json();
    certsInfo.current = dataCert;
    console.log(dataCert);
    setResult(dataCert);
  };

  const getAllCerts = async () => {};

  //Deny entry to non-authorized users
  useEffect(() => {
    const token = userStore?.token?.token || localStorage.getItem("token");
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

    getUser();
    getAllCerts();
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
        setCloudinaryFileName(dataCloudinary.public_id);

        //OCR AI certificate verification
        setPendingVerification(true);
        const responseOCR = await fetch(
          `${import.meta.env.VITE_OCR_APP_URL}/validate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token":
                userStore?.token?.token || localStorage.getItem("token"),
            },
            body: JSON.stringify({
              data: `${import.meta.env.VITE_CLOUDINARY_URL}/${
                dataCloudinary.public_id
              }`,
            }),
          }
        ).catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });

        const dataOCR = await responseOCR.json();
        console.log(dataOCR.ocrPrediction);

        //ObjectDetection AI certificate verification
        setPendingVerification(true);
        const responseObjectDetection = await fetch(
          `${import.meta.env.VITE_OBJECT_DETECTION_APP_URL}/validate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-access-token":
                userStore?.token?.token || localStorage.getItem("token"),
            },
            body: JSON.stringify({
              data: `${import.meta.env.VITE_CLOUDINARY_URL}/${
                dataCloudinary.public_id
              }`,
            }),
          }
        ).catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });

        const dataObjectDetection = await responseObjectDetection.json();
        console.log(dataObjectDetection.yoloPrediction);

        // evaluate status according to the ai result
        setPendingVerification(false);
        if (
          dataOCR.ocrPrediction == true &&
          dataObjectDetection.yoloPrediction == true
        ) {
          // add uploaded image/document to database
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/new`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token":
                  userStore?.token?.token || localStorage.getItem("token"),
              },
              body: JSON.stringify({
                file: dataCloudinary.public_id,
                skill: skill,
                description: description,
                status: "ongoing",
              }),
            }
          ).catch((err) => {
            console.log(err);
            setIsSubmitting(false);
          });
          const data = await response.json();
          console.log(data);

          setVerificationStatus(
            "Under Review: Uploaded document is forwarded to the verification team for final approval!"
          );
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
        } else if (
          dataOCR.ocrPrediction == false &&
          dataObjectDetection.yoloPrediction == false
        ) {
          // add uploaded image/document to database
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/new`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token":
                  userStore?.token?.token || localStorage.getItem("token"),
              },
              body: JSON.stringify({
                file: dataCloudinary.public_id,
                skill: skill,
                description: description,
                status: "deny",
              }),
            }
          ).catch((err) => {
            console.log(err);
            setIsSubmitting(false);
          });
          const data = await response.json();
          console.log(data);

          setVerificationStatus(
            "Rejected: Uploaded document does not appear to be a certificate! contact support if you think something went wrong"
          );
          toast.error(
            "Document failed to pass AI check, please upload another document!",
            {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        } else if (dataOCR.ocrPrediction == false) {
          // add uploaded image/document to database
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/new`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token":
                  userStore?.token?.token || localStorage.getItem("token"),
              },
              body: JSON.stringify({
                file: dataCloudinary.public_id,
                skill: skill,
                description: description,
                status: "ongoing",
              }),
            }
          ).catch((err) => {
            console.log(err);
            setIsSubmitting(false);
          });
          const data = await response.json();
          console.log(data);

          setVerificationStatus(
            "Under Review: Uploaded document is forwarded to the verification team for final approval!"
          );
          toast.warning(
            "Document is not clear. Forwarded to verification team!",
            {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }

        setTimeout(() => {
          setIsSubmitting(false);
        }, 9000);
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
        <br />
        <br />
        <br />
        <div className={ContentCSS.registerContainer}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              placeContent: "center",
              margin: "auto",
              textAlign: "center",
            }}
          >
            <label
              style={{ margin: "20px", fontSize: "20px", fontWeight: "bold" }}
              htmlFor="upload"
            >
              Upload Document Here
            </label>

            <form
              onSubmit={uploadFile}
              className={ContentCSS.contactFormContainer}
            >
              <label htmlFor="text">Choose a File: </label>
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
                <option>{""}</option>
                {userInfo.current[0].skills ? (
                  userInfo.current[0].skills.map((skill, id) => {
                    return (
                      <option key={id} value={skill}>
                        {skill}
                      </option>
                    );
                  })
                ) : (
                  <></>
                )}
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
              <button
                className={ContentCSS.loginButton}
                disabled={isSubmitting}
              >
                Submit for verification
              </button>
            </form>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              placeContent: "center",
              margin: "auto",
              textAlign: "center",
            }}
          >
            <label
              style={{ margin: "20px", fontSize: "20px", fontWeight: "bold" }}
              htmlFor="upload"
            >
              Status of Uploaded Document
            </label>
            <div
              style={{
                margin: "auto",
                justifyItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    style={{
                      border: "1px",
                      borderColor: "black",
                      borderStyle: "solid",
                      borderRadius: "15px",
                      width: "500px",
                      height: "auto",
                      margin: "auto",
                      justifyItems: "center",
                    }}
                  >
                    <img
                      style={{
                        alignSelf: "center",
                        width: "500px",
                        borderRadius: "15px",
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderWidth: "1px",
                      }}
                      src={`${
                        import.meta.env.VITE_CLOUDINARY_URL
                      }/${cloudinaryFileName}`}
                    />
                    <div
                      style={{
                        textAlign: "center",
                        margin: "5px",
                        placeContent: "center",
                        margin: "auto",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          margin: "5px",
                          fontWeight: "bold",
                          placeContent: "center",
                          margin: "auto",
                        }}
                      >
                        Status:
                      </div>
                      {pendingVerification ? (
                        <>
                          <Icon
                            icon="line-md:loading-loop"
                            style={{
                              color: "#2C5F8D",
                              width: "50px",
                              height: "30px",
                            }}
                          />
                        </>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "5px",
                            placeContent: "center",
                          }}
                        >
                          <Icon
                            icon="ep:warning"
                            style={{ color: "#2C5F8D", marginRight: "10px" }}
                          />
                          {verificationStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    border: "1px",
                    borderColor: "black",
                    borderStyle: "solid",
                    borderRadius: "15px",
                    width: "500px",
                    height: "450px",
                    margin: "auto",
                    placeContent: "center",
                  }}
                >
                  <Empty />
                </div>
              )}
            </div>
          </div>
        </div>

        <Collapse
          accordion
          style={{ margin: "50px", width: "1300px" }}
          items={[
            {
              key: "1",
              label: "Previously Submitted Certificates",
              children: (
                <>
                  {results.map((result, id) => {
                    return (
                      <div
                        id={result._id}
                        key={id}
                        className={ContentCSS.certificateHistoryContainer}
                        style={{ marginTop: "30px" }}
                      >
                        <form
                          style={{ width: "600px" }}
                          className={ContentCSS.contactFormContainer}
                        >
                          <img
                            style={{
                              margin: "10px",
                              alignSelf: "center",
                              width: "600px",
                            }}
                            src={`${import.meta.env.VITE_CLOUDINARY_URL}/${
                              result.certificate
                            }`}
                          />
                          <hr style={{ width: "550px" }} />
                          <div>
                            <label
                              style={{ fontSize: "20px", fontWeight: "bold" }}
                            >
                              Status:{" "}
                            </label>
                            <label style={{ fontSize: "20px" }}>
                              {result.status}
                            </label>
                          </div>
                        </form>
                      </div>
                    );
                  })}
                </>
              ),
            },
          ]}
          onChange={(key) => {
            console.log(key);
          }}
        />
      </div>
    </>
  );
}

export default UploadForm;
