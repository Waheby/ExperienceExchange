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

export default Home;
