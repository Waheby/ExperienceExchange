import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import NavCSS from "../../assets/styles/Navbar/nav.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Collapse, Modal, Popover } from "antd";

function CheckVerify() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [results, setResult] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIVerified, setIsAIVerified] = useState(false);
  const [currentCertID, setCurrentCertID] = useState("");
  const [url, setURL] = useState("");
  const [isTextValid, setIsTextValid] = useState("");
  const [isObjectValid, setIsObjectValid] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  const certsInfo = useRef("");

  const [file, setFile] = useState("");

  //Deny entry to non-authorized users
  useEffect(() => {
    const token = userStore?.token?.token || localStorage.getItem("token");
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

    const getCerts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/all`,
        {
          method: "GET",
          headers: {
            "x-access-token":
              userStore?.token?.token || localStorage.getItem("token"),
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      certsInfo.current = data;
      console.log(data);
      setResult(data);
    };
    getCerts();
  }, []);

  const denyFile = async (e, certId) => {
    e.preventDefault();
    console.log(certId);
    setIsSubmitting(true);
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/modify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token":
            userStore?.token?.token || localStorage.getItem("token"),
        },
        body: JSON.stringify({
          status: "deny",
          id: certId,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("Denied Successfully!", {
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
    document.getElementById(certId).style.display = "none";
  };

  const acceptFile = async (e, certId) => {
    e.preventDefault();
    console.log(certId);
    setIsSubmitting(true);
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/modify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token":
            userStore?.token?.token || localStorage.getItem("token"),
        },
        body: JSON.stringify({
          status: "accept",
          id: certId,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    toast.success("Accepted Successfully!", {
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
    document.getElementById(certId).style.display = "none";
  };

  const autoVerify = async (e, cert, id) => {
    e.preventDefault();
    console.log(cert);
    setCurrentCertID(id);
    setIsAIVerified(false);
    setPendingVerification(true);

    //OCR AI certificate verification
    // const responseOCR = await fetch(
    //   `${import.meta.env.VITE_OCR_APP_URL}/validate`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-access-token":
    //         userStore?.token?.token || localStorage.getItem("token"),
    //     },
    //     body: JSON.stringify({
    //       data: `${import.meta.env.VITE_CLOUDINARY_URL}/${cert}`,
    //     }),
    //   }
    // ).catch((err) => {
    //   console.log(err);
    //   setIsSubmitting(false);
    // });

    // const dataOCR = await responseOCR.json();
    // console.log(dataOCR.ocrPrediction);

    //ObjectDetection AI certificate verification
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
          data: `${import.meta.env.VITE_CLOUDINARY_URL}/${cert}`,
          is_export: "True",
        }),
      }
    ).catch((err) => {
      console.log(err);
      setIsSubmitting(false);
    });

    const dataObjectDetection = await responseObjectDetection.json();
    console.log(dataObjectDetection.yoloPrediction);
    console.log(dataObjectDetection.url);

    // if (!dataOCR.ocrPrediction) {
    //   setIsTextValid(false);
    // } else {
    //   setIsTextValid(true);
    // }

    if (!dataObjectDetection.yoloPrediction) {
      setIsObjectValid(false);
    } else {
      setIsObjectValid(true);
    }

    setURL(dataObjectDetection.url);
    setIsAIVerified(true);
    setPendingVerification(false);

    toast.success("AI Verification is Done!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const showModalMessage = async (e) => {
    e.preventDefault();
    setOpenMessage(true);
  };

  return (
    <>
      <img
        style={{
          width: "100%",
          minWidth: "1440px",
          maxWidth: "1900px",
          minHeight: "800px",
          zIndex: "-1",
          position: "absolute",
          marginTop: "-35px",
        }}
        src={`${
          import.meta.env.VITE_CLOUDINARY_URL
        }/v1729110997/blob-scene-haikei_4_ogxvvr.svg`}
        alt=""
      />
      <div className={ContentCSS.mainContainer}>
        <h1>Verify Certificates Manually or Automate it using AI</h1>

        {results.map((result, id) => {
          return (
            <div
              id={result._id}
              key={id}
              className={ContentCSS.registerContainer}
              style={{ marginTop: "30px" }}
            >
              <form
                style={{ width: "600px" }}
                className={ContentCSS.contactFormContainer}
              >
                <label htmlFor="text">
                  Uploaded by User: @{result.creator}
                </label>
                <img
                  style={{
                    margin: "20px",
                    alignSelf: "center",
                    width: "600px",
                  }}
                  src={`${import.meta.env.VITE_CLOUDINARY_URL}/${
                    result.certificate
                  }`}
                />

                <hr style={{ width: "550px" }} />
                <div>
                  <Popover
                    content={
                      <form
                        className={ContentCSS.contactFormContainer}
                        style={{ boxShadow: "none", height: "150px" }}
                      >
                        <span style={{ fontSize: "20px" }}>
                          Are you sure you want to accept it ?
                        </span>
                        <div style={{ marginTop: "50px" }}>
                          <button
                            style={{
                              width: "20%",
                              backgroundColor: "red",
                              color: "white",
                            }}
                            className={ContentCSS.loginButton}
                            disabled={isSubmitting}
                            onClick={(e) => acceptFile(e, result._id)}
                          >
                            CONFIRM
                          </button>
                        </div>
                      </form>
                    }
                    title=""
                    trigger="click"
                  >
                    <button
                      style={{
                        width: "120px",
                        backgroundColor: "green",
                        color: "white",
                      }}
                      disabled={isSubmitting}
                      className={ContentCSS.loginButton}
                      onClick={showModalMessage}
                    >
                      Accept
                    </button>
                  </Popover>

                  <Popover
                    content={
                      <form
                        className={ContentCSS.contactFormContainer}
                        style={{ boxShadow: "none", height: "150px" }}
                      >
                        <span style={{ fontSize: "20px" }}>
                          Are you sure you want to deny it ?
                        </span>
                        <div style={{ marginTop: "50px" }}>
                          <button
                            style={{
                              width: "20%",
                              backgroundColor: "red",
                              color: "white",
                            }}
                            className={ContentCSS.loginButton}
                            disabled={isSubmitting}
                            onClick={(e) => denyFile(e, result._id)}
                          >
                            CONFIRM
                          </button>
                        </div>
                      </form>
                    }
                    title=""
                    trigger="click"
                  >
                    <button
                      style={{
                        width: "120px",
                        margin: "5px",
                        backgroundColor: "red",
                        color: "white",
                      }}
                      disabled={isSubmitting}
                      className={ContentCSS.loginButton}
                      onClick={showModalMessage}
                    >
                      Deny
                    </button>
                  </Popover>
                </div>
                <button
                  style={{
                    width: "180px",
                    backgroundColor: "rgb(39, 62, 110)",
                    fontSize: "medium",
                    color: "white",
                  }}
                  className={ContentCSS.loginButton}
                  onClick={(e) => autoVerify(e, result.certificate, result._id)}
                >
                  AI Assistant
                </button>
              </form>
              {isAIVerified && currentCertID == result._id ? (
                <>
                  <div
                    style={{ width: "600px" }}
                    className={ContentCSS.contactFormContainer}
                  >
                    <label>AI Assistant:</label>
                    {/* <img
                      style={{
                        margin: "20px",
                        alignSelf: "center",
                        width: "600px",
                      }}
                      src={`${url}`}
                    /> */}
                    <hr style={{ width: "550px" }} />
                    <div>
                      {isObjectValid ? ( //add "isTextValid &&" to include OCR
                        <>
                          <p style={{ color: "green" }}>
                            Texts: -
                            {/*Good Chance of being a certificate{" "}*/}
                            <Icon
                              icon="mdi:tick-outline"
                              style={{ color: "green" }}
                            />
                          </p>
                          <p style={{ color: "green" }}>
                            Objects: Good Chance of being a certificate{" "}
                            <Icon
                              icon="mdi:tick-outline"
                              style={{ color: "green" }}
                            />
                          </p>
                        </>
                      ) : (
                        <>
                          {!isObjectValid ? ( //add "isTextValid &&" to include OCR
                            <>
                              <p style={{ color: "green" }}>
                                Texts: -
                                {/*Good Chance of being a certificate{" "}*/}
                                <Icon
                                  icon="mdi:tick-outline"
                                  style={{ color: "green" }}
                                />
                              </p>
                              <p style={{ color: "orange" }}>
                                Objects: Very Low Chance of being a certificate{" "}
                                <Icon
                                  icon="mdi:warning-outline"
                                  style={{ color: "orange" }}
                                />
                              </p>
                            </>
                          ) : (
                            <>
                              {isObjectValid ? ( //add "!isTextValid &&" to include OCR
                                <>
                                  <p style={{ color: "orange" }}>
                                    Texts: -
                                    {/*Very Low Chance of being a
                                    certificate{" "}*/}
                                    <Icon
                                      icon="mdi:warning-outline"
                                      style={{ color: "orange" }}
                                    />
                                  </p>
                                  <p style={{ color: "green" }}>
                                    Objects: Good Chance of being a certificate{" "}
                                    <Icon
                                      icon="mdi:tick-outline"
                                      style={{ color: "green" }}
                                    />
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p style={{ color: "red" }}>
                                    Texts: -
                                    {/*No chance of being a certificate{" "}*/}
                                    <Icon
                                      icon="zondicons:block"
                                      style={{ color: "red" }}
                                    />
                                  </p>
                                  <p style={{ color: "red" }}>
                                    Objects: No chance of being a certificate{" "}
                                    <Icon
                                      icon="zondicons:block"
                                      style={{ color: "red" }}
                                    />
                                  </p>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {pendingVerification && currentCertID == result._id ? (
                    <>
                      <div
                        style={{
                          width: "600px",
                          placeContent: "center",
                          justifyContent: "center",
                        }}
                        className={ContentCSS.contactFormContainer}
                      >
                        <Icon
                          icon="line-md:loading-loop"
                          style={{
                            color: "#2C5F8D",
                            width: "150px",
                            height: "150px",
                            margin: "auto",
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default CheckVerify;
