import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import ContentCSS from "../assets/styles/Content/content.module.css";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";

function PostsPage() {
  let navigate = useNavigate();
  const [results, setResult] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      if (!user) {
        console.log("Unauthorized User");
        localStorage.removeItem("token");
        navigate("/login");
      } else console.log("User Authenticated");
    } else navigate("/login");

    const getPost = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/all`,
        {
          method: "GET",
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      console.log(data);
      setResult(data);
    };
    getPost();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Recommended Users for you</h1>
      <div className={ContentCSS.postsPageMainContainer}>
        {results.map((result, id) => {
          return (
            <div key={id}>
              <>
                <div
                  onClick={() => navigate(`/posts/${result._id}`)}
                  style={{ cursor: "pointer" }}
                  className={ContentCSS.postContainer}
                >
                  <div className={ContentCSS.postTop}>
                    <div
                      className={ContentCSS.postUsername}
                      style={{ textAlign: "center" }}
                    >
                      @{result.creator}
                    </div>
                  </div>
                  <hr style={{ width: "350px" }} />
                  <div>
                    <p
                      style={{
                        margin: "10px",
                        textAlign: "center",
                        overflowY: "hidden",
                      }}
                    >
                      {result.content}
                    </p>
                  </div>

                  <div
                    style={{ flexDirection: "column" }}
                    className={ContentCSS.postFooter}
                  >
                    <hr style={{ width: "350px" }} />
                    <div
                      style={{ textAlign: "center" }}
                      className={ContentCSS.postFooterTag}
                    >
                      {result.tags.join(", ")}
                    </div>
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
