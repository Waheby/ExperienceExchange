import { useEffect, useState } from "react";
import ContentCSS from "../../assets/styles/Content/content.module.css";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";

function PostsHistory() {
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jose.decodeJwt(token);
  const url = "http://localhost:5000";
  const [results, setResult] = useState([]);
  const [username, setUsername] = useState(user.username);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jose.decodeJwt(token);
      setUsername(user.username);
      if (!user) {
        console.log("Unauthorized User");
        localStorage.removeItem("token");
        navigate("/login");
      } else console.log("User Authenticated");
    } else navigate("/login");

    const getPost = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
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
      <h1 style={{ textAlign: "center" }}>Posts History</h1>
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
                    <div>
                      <img
                        className={ContentCSS.postImg}
                        src={`/${result.image}`}
                        alt="profile pic"
                      />
                    </div>
                    <div className={ContentCSS.postUsername}>
                      @{result.creator}
                    </div>
                  </div>
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

export default PostsHistory;
