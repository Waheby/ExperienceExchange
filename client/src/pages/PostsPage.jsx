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
      <h1 style={{ textAlign: "center" }}>
        Recommended Posts and Users for you
      </h1>
      <div className={ContentCSS.postsPageMainContainer}>
        {results.map((result, id) => {
          return (
            <div key={id}>
              <>
                <div
                  className={ContentCSS.postContainer}
                  onClick={() => navigate(`/posts/${result._id}`)}
                >
                  <div className={ContentCSS.postTop}>
                    <div
                      style={{ textAlign: "center" }}
                      className={ContentCSS.postUsername}
                    >
                      @{result.creator}
                    </div>
                  </div>
                  <hr style={{ width: "95%" }} />
                  <div style={{ overflow: "hidden", height: "150px" }}>
                    <p style={{ textAlign: "center" }}>{result.content}</p>
                  </div>
                  <hr style={{ width: "370px" }} />
                  <div className={ContentCSS.postFooter}>
                    <span
                      style={{ textAlign: "center" }}
                      className={ContentCSS.postFooterShowComments}
                    >
                      {result.tags ? result.tags.join(", ") : null}
                    </span>
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
