import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import ContentCSS from "../assets/styles/Content/content.module.css";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostsPage() {
  const userStore = useSelector((state) => state.user);
  let navigate = useNavigate();
  const [results, setResult] = useState([]);

  useEffect(() => {
    const token = userStore?.token?.token || localStorage.getItem("token");
    const user = jose.decodeJwt(token);
    if (token) {
      const user = jose.decodeJwt(token);
      if (!user) {
        console.log("Unauthorized User");
        localStorage.removeItem("token");
        navigate("/login");
      } else console.log("User Authenticated");
    } else navigate("/login");

    const getRecommendedUsers = async (user) => {
      const response = await fetch(
        `https://experienceexchangerecommendersystem.onrender.com/recommend-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token":
              userStore?.token?.token || localStorage.getItem("token"),
          },
          body: JSON.stringify({
            content: user.username,
          }),
        }
      ).catch((err) => {
        console.log(err);
      });
      const data = await response.json();
      console.log(user);
      getSimilarUsers(data["User Recommendation"]);
    };
    getRecommendedUsers(user);
  }, []);

  const getSimilarUsers = async (users) => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/user/recommended`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users: users,
        }),
      }
    ).catch((err) => {
      console.log(err);
    });

    const data = await response.json();
    console.log(data);
    setResult(data);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Recommended Posts and Users for you
      </h1>
      <div className={ContentCSS.postsPageMainContainer}>
        {results.map((result, id) => {
          return (
            <div key={id}>
              <>
                <div
                  onClick={() => navigate(`/user/${result.username}`)}
                  style={{ cursor: "pointer" }}
                  className={ContentCSS.postContainer}
                >
                  <div
                    style={{ justifyContent: "center" }}
                    className={ContentCSS.postTop}
                  >
                    <div>
                      {result.profileImage ? (
                        <img
                          style={{
                            width: "70px",
                            height: "70px",
                            borderStyle: "solid",
                            borderWidth: "1px",
                          }}
                          className={ContentCSS.postImg}
                          src={`${import.meta.env.VITE_CLOUDINARY_URL}/${
                            result.profileImage
                          }`}
                          alt="profile pic"
                        />
                      ) : (
                        <img
                          style={{
                            width: "70px",
                            height: "70px",
                            borderStyle: "solid",
                            borderWidth: "1px",
                          }}
                          className={ContentCSS.postImg}
                          src={`${
                            import.meta.env.VITE_CLOUDINARY_URL
                          }/DefaultProfile.svg`}
                          alt="profile pic"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <p style={{ textAlign: "center" }}>@{result.username}</p>
                  </div>
                  <hr style={{ width: "350px" }} />
                  <div
                    className={ContentCSS.postFooter}
                    style={{ justifyContent: "center" }}
                  >
                    <p>{result.skills ? result.skills.join(", ") : null}</p>
                  </div>
                </div>
              </>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PostsPage;
