import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import { ToastContainer, toast } from "react-toastify";

function CheckVerify() {
  let navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [results, setResult] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const certsInfo = useRef("");

  const [file, setFile] = useState("");

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

    const getCerts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/certificate/all`,
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
          "x-access-token": localStorage.getItem("token"),
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
          "x-access-token": localStorage.getItem("token"),
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
  };

  const autoVerify = async (e, certs) => {
    e.preventDefault();
    console.log(certs);

    // const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/certificate/modify`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-access-token": localStorage.getItem("token"),
    //   },
    //   body: JSON.stringify({
    //     status: "accept",
    //     id: certId,
    //   }),
    // }).catch((err) => {
    //   console.log(err);
    // });

    // const data = await response.json();
    // console.log(data);

    toast.success("AI Verification is Running!", {
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

  return (
    <>
      <div className={ContentCSS.mainContainer}>
        <h1>Verify Certificates Manually or Automate it using AI</h1>
        <button
          style={{
            width: "180px",
            backgroundColor: "rgb(39, 62, 110)",
            fontSize: "large",
            color: "white",
          }}
          className={ContentCSS.loginButton}
          onClick={(e) => autoVerify(e, results)}
        >
          Auto Verification
        </button>
        {results.map((result, id) => {
          return (
            <div
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
                  src={`/certs/${result.certificate}`}
                />

                <hr style={{ width: "350px" }} />
                <div>
                  <button
                    style={{
                      width: "120px",
                      backgroundColor: "green",
                      color: "white",
                    }}
                    disabled={isSubmitting}
                    className={ContentCSS.loginButton}
                    onClick={(e) => acceptFile(e, result._id)}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      width: "120px",
                      margin: "5px",
                      backgroundColor: "red",
                      color: "white",
                    }}
                    disabled={isSubmitting}
                    className={ContentCSS.loginButton}
                    onClick={(e) => denyFile(e, result._id)}
                  >
                    Deny
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default CheckVerify;
