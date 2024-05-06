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
          margin: "10px",
        }}
      >
        <div
          style={{
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#273e6e",
            margin: "10px",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <strong>Announcement: </strong> {result[0].content}
        </div>
      </div>
    </>
  );
}

export default AnnouncementBox;
