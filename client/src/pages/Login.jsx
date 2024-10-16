import { useState, useRef, useEffect } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setToken } from "../state/user/userSlice";
import { redirect, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import "@tensorflow/tfjs-core"; //added this to fix issues with face api

function Login() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // face api
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [canCallFaceAPI, setCanCallFaceAPI] = useState(false);

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();
  const faceDescriptionsRef = useRef();
  const faceLabelRef = useRef();

  useEffect(() => {
    // console.log(canCallFaceAPI);
    const MODEL_URL = "/models";
    const loadModels = async () => {
      try {
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]).then(setModelsLoaded(true));
      } catch (error) {
        console.log(error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (canCallFaceAPI) {
      faceMatch();
    }
  }, [canCallFaceAPI]);

  const startVideo = () => {
    console.log("im in start video");
    setCanCallFaceAPI(true);
    // console.log(canCallFaceAPI);

    setCaptureVideo(true);
    // console.log(captureVideo);

    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        canvasRef &&
          canvasRef.current &&
          canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, videoWidth, videoHeight);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );

        if (resizedDetections[0]) {
          faceDescriptionsRef.current = resizedDetections[0];
          // console.log(faceDescriptionsRef.current);

          // if (canCallFaceAPI == true) {
          //   setCanCallFaceAPI(false);
          //   faceMatch();
          // }
        }
      }
    }, 100);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  const dispatch = useDispatch(); //to input data into state using reducer

  const login = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    dispatch(
      setUser({
        name: username,
        password: password,
        loggedIn: true,
      })
    );

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);

    if (data.token) {
      dispatch(
        setToken({
          token: data.token,
        })
      );
      localStorage.setItem("token", data.token);
      console.log("Login Successful");
      toast.success("Login Success!", {
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
        // window.location.href = "/userdashboard";
        navigate("/userdashboard"); //i use this cuz it doesnt reload the whole page therefore redux store doesnt reset
      }, 2000);
    } else {
      console.log();
      toast.error(data.data, {
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

  const faceMatch = async (e) => {
    e.preventDefault();

    if (faceDescriptionsRef.current != null) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/face-match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uploadedFace: faceDescriptionsRef.current,
            label: "faceLabel",
          }),
        }
      )
        .then(setCanCallFaceAPI(false))
        .catch((err) => {
          console.log(err);
        });

      const data = await response.json();
      console.log(data);
      faceLabelRef.current = data._label;
    }

    faceLogin();
  };

  const faceLogin = async () => {
    setIsSubmitting(true);

    dispatch(
      setUser({
        name: faceLabelRef.current,
        // password: password,
        loggedIn: true,
      })
    );

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/face-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: faceLabelRef.current,
          // password: password,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);

    if (data.token) {
      dispatch(
        setToken({
          token: data.token,
        })
      );
      localStorage.setItem("token", data.token);
      console.log("Login Successful");
      toast.success("Login Success!", {
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
        // window.location.href = "/userdashboard";
        navigate("/userdashboard"); //i use this cuz it doesnt reload the whole page therefore redux store doesnt reset
      }, 2000);
    } else {
      console.log();
      toast.error(data.data, {
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
        }/v1729095996/blob-scene-haikei_4_nzxgvj.svg`}
        alt=""
      />

      <h1 style={{ textAlign: "center", marginTop: "200px" }}>
        Login with your credentials
      </h1>
      <div className={ContentCSS.loginContainer}>
        <form onSubmit={login} className={ContentCSS.loginFormContainer}>
          <label htmlFor="text">Username: </label>
          <input
            className={ContentCSS.loginInput}
            type="text"
            required
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label htmlFor="text">Password: </label>
          <input
            className={ContentCSS.loginInput}
            type="password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <a className={ContentCSS.loginForgot} href="/reset">
            Forgot password?
          </a>
          <hr style={{ width: "350px" }} />
          <button className={ContentCSS.loginButton} disabled={isSubmitting}>
            Login
          </button>
          <a className={ContentCSS.loginForgot} href="/register">
            Don't have an account?
          </a>
          {captureVideo && modelsLoaded ? (
            <div
              style={{
                display: "flex",
                height: "30px",
                fontSize: "small",
                backgroundColor: "rgb(39, 62, 110)",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
              className={ContentCSS.loginButton}
              onClick={(e) => closeWebcam(e)}
            >
              <span style={{ textAlign: "center" }}>
                Face Recognition Login
              </span>
              <Icon
                icon="tabler:face-id"
                style={{ width: "40px", height: "40px", color: "white" }}
              />
            </div>
          ) : (
            <>
              {" "}
              <div
                style={{
                  display: "flex",
                  height: "30px",
                  fontSize: "small",
                  backgroundColor: "rgb(39, 62, 110)",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className={ContentCSS.loginButton}
                onClick={(e) => startVideo(e)}
              >
                <span style={{ textAlign: "center" }}>
                  Face Recognition Login
                </span>
                <Icon
                  icon="tabler:face-id"
                  style={{ width: "40px", height: "40px", color: "white" }}
                />
              </div>
            </>
          )}
        </form>
      </div>
      <div>
        {captureVideo ? (
          modelsLoaded ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <video
                  ref={videoRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleVideoOnPlay}
                  style={{ borderRadius: "10px" }}
                />
                <canvas ref={canvasRef} style={{ position: "absolute" }} />
              </div>
              <div
                style={{
                  width: "120px",

                  margin: "auto",
                  justifySelf: "center",
                }}
              >
                <button
                  style={{
                    width: "120px",
                    height: "50px",
                    borderRadius: "15px",
                    backgroundColor: "#2C5F8D",
                    color: "white",
                    margin: "auto",
                    justifySelf: "center",
                  }}
                  onClick={faceMatch}
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div>loading...</div>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Login;
