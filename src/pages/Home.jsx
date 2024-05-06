import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Infocard from "../components/Infocard";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [results, setResult] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
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
      <div>
        <div className={ContentCSS.mainContainer}>
          <h1>
            Unlock Your Potential in Experience Exchange Where Talent Meets
            Opportunity
          </h1>
          <Searchbar></Searchbar>
          <Infocard />
          <h1>Check the Latest Posts </h1>
        </div>
      </div>
      <div className={ContentCSS.postsPageMainContainer}>
        {results.map((result, id) => {
          return (
            <div key={id}>
              <>
                <div
                  onClick={() => navigate(`/posts/${result._id}`)}
                  className={ContentCSS.postContainer}
                >
                  <div
                    style={{
                      display: "flex",
                      margin: "auto",
                      justifyItems: "center",
                    }}
                    className={ContentCSS.postTop}
                  >
                    <div
                      style={{
                        textAlign: "center",
                      }}
                      className={ContentCSS.postUsername}
                    >
                      @{result.creator}
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        textAlign: "center",
                        height: "130px",
                        overflow: "auto",
                      }}
                    >
                      {result.content}
                    </p>
                  </div>
                  <hr style={{ width: "370px" }} />
                  <div className={ContentCSS.postFooter}>
                    <span className={ContentCSS.postFooterShowComments}>
                      Comments(2)
                    </span>
                    <div className={ContentCSS.postFooterTag}>
                      {result.tags ? result.tags.join(", ") : null}
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

export default Home;
