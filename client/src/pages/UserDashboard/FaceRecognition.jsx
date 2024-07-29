import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Searchbar from "../../components/Searchbar";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "@iconify/react";
import * as jose from "jose";
import * as faceapi from "face-api.js";
import "@tensorflow/tfjs-core"; //added this to fix issues with face api

function FaceRecognition() {
  const [username, setUsername] = useState(null);

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
  }, []);

  // face api
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [canCallFaceAPI, setCanCallFaceAPI] = useState(false);

  const videoRef = useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef();
  const faceDescriptionsRef = useRef();

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
      faceUpload();
    }
  }, [canCallFaceAPI]);

  const startVideo = () => {
    console.log("im in start video");
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

          if (canCallFaceAPI == true) {
            setCanCallFaceAPI(false);
            faceUpload();
          }
        }
      }
    }, 100);

    setCanCallFaceAPI(true);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  const faceUpload = async () => {
    if (canCallFaceAPI && faceDescriptionsRef.current) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/upload-face`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            uploadedFace: faceDescriptionsRef.current.descriptor,
            label: username,
          }),
        }
      )
        .then(setCanCallFaceAPI(true))
        .catch((err) => {
          console.log(err);
        });

      const data = await response.json();
      console.log(data);
      if (response.status >= 200) {
        console.log("Face Auth Enabled");
        toast.success("Face Auth Enabled!", {
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
        console.log("Face Auth Failed");
        toast.success("Face Auth Failed!", {
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
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Enable FaceRecognition</h1>
      <div>
        <div style={{ textAlign: "center", padding: "10px" }}>
          {captureVideo && modelsLoaded ? (
            <button
              onClick={closeWebcam}
              style={{
                cursor: "pointer",
                backgroundColor: "green",
                color: "white",
                padding: "15px",
                fontSize: "25px",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Close Webcam
            </button>
          ) : (
            <button
              onClick={startVideo}
              style={{
                cursor: "pointer",
                backgroundColor: "green",
                color: "white",
                padding: "15px",
                fontSize: "25px",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Open Webcam
            </button>
          )}
        </div>
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
                  onClick={faceUpload}
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

export default FaceRecognition;
