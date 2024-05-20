import { useEffect, useRef, useState } from "react";
import NavCSS from "../assets/styles/Navbar/nav.module.css";
import { Link, useNavigate } from "react-router-dom";
import * as jose from "jose";

function AnnouncementBox() {
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [result, setResult] = useState([""]);

  useEffect(() => {
    const getAnnouncement = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/admin/get-announcement`,
        {
          method: "GET",
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      // console.log(data);
      setResult(data);
    };
    getAnnouncement();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "-10px",
          backgroundColor: "#2c5f8d",
          color: "white",
        }}
      >
        <div
          style={{
            borderStyle: "solid",
            borderWidth: "2px",
            width: "100%",
            borderColor: "#273e6e",
            padding: "5px",
            borderRadius: "5px",
            textAlign: "center",
            textWrap: "wrap",
            overflowWrap: "break-word",
            backgroundColor: "#2c5f8d",
            color: "white",
          }}
        >
          ANNOUNCEMENT: {result[0].content}
        </div>
      </div>
    </>
  );
}

export default AnnouncementBox;
