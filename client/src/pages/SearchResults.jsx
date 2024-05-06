import { useEffect, useState } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function SearchResults() {
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("skill");
  const [input, setInput] = useState(searchTerm || "");
  const [results, setResult] = useState([]);
  const [searchBy, setSearchBy] = useState("username");
  const [searchFor, setSearchFor] = useState("user");
  const token = localStorage.getItem("token");

  const searchUserbySkill = async (input) => {
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/search-skill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            skill: input.toLowerCase().trim(),
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      // const results = data.filter((user) => {
      //   return user && user;
      // });
      console.log(data);
      setResult(data);
    } else {
      toast.error("Log in to use Search", {
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
  };

  const searchUserbyUsername = async () => {
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/search-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            username: input.toLowerCase().trim(),
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      // const results = data.filter((user) => {
      //   return user && user;
      // });
      console.log(results);
      setResult(data);
    } else {
      toast.error("Log in to use Search", {
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
  };

  const searchPostbyUsername = async () => {
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/search-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: input.toLowerCase().trim(),
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      // const results = data.filter((user) => {
      //   return user && user;
      // });
      console.log(data);
      setResult(data);
    } else {
      toast.error("Log in to use Search", {
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
  };

  const searchPostbyTag = async () => {
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/search-skill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill: input.toLowerCase().trim(),
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const data = await response.json();
      // const results = data.filter((user) => {
      //   return user && user;
      // });
      console.log(data);
      setResult(data);
    } else {
      toast.error("Log in to use Search", {
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
  };

  const handleSearch = () => {
    if (searchFor === "user") {
      if (searchBy === "skill") {
        searchUserbySkill(input);
      } else searchUserbyUsername();
    } else {
      if (searchBy === "skill") {
        searchPostbyTag();
      } else searchPostbyUsername();
    }
  };

  //to search first by query param if present
  useEffect(() => {
    if (searchTerm) {
      searchUserbySkill(searchTerm);
    }
  }, []);

  return (
    <>
      <div
        className={ContentCSS.checkBoxContainer}
        style={{
          width: "480px",
          height: "200px",
        }}
      >
        <div className={ContentCSS.searchContainer}>
          <Icon
            icon="icon-park-solid:voice"
            className={ContentCSS.voiceSearchIcon}
          />
          <input
            className={ContentCSS.searchBar}
            type="text"
            placeholder="Search for a skill to start learning..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Icon
            className={ContentCSS.searchIcon}
            icon="material-symbols:search"
            onClick={handleSearch}
          />
        </div>

        <span>Search for: </span>
        <div>
          <input
            type="radio"
            id="user"
            name="userOrPost"
            value="user"
            defaultChecked="true"
            onChange={(e) => {
              setSearchFor(e.target.value);
              setResult([]);
            }}
          />
          <label htmlFor="userOrPost">Users </label>
          <input
            type="radio"
            id="post"
            name="userOrPost"
            value="post"
            onChange={(e) => {
              setSearchFor(e.target.value);
              setResult([]);
            }}
          />
          <label htmlFor="text">Posts </label>
        </div>
        <span>Search by: </span>
        <div>
          <input
            type="radio"
            id="username"
            name="userOrSkill"
            value="username"
            defaultChecked="true"
            onChange={(e) => {
              setSearchBy(e.target.value);
              setResult([]);
            }}
          />
          <label htmlFor="userOrSkill">Username </label>
          <input
            type="radio"
            id="skill"
            name="userOrSkill"
            value="skill"
            onChange={(e) => {
              setSearchBy(e.target.value);
              setResult([]);
            }}
          />
          <label htmlFor="text">Skill/Tag </label>
        </div>
      </div>
      <div className={ContentCSS.postsPageMainContainer}>
        {results.map((result, id) => {
          if (searchFor === "user") {
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
                        <img
                          style={{
                            width: "70px",
                            height: "70px",
                            borderStyle: "solid",
                            borderWidth: "1px",
                          }}
                          className={ContentCSS.postImg}
                          src={`./dist/profile/${result.profileImage}`}
                          alt="profile pic"
                        />
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
          } else
            return (
              <div key={id}>
                <>
                  <div className={ContentCSS.postContainer}>
                    <div className={ContentCSS.postTop}>
                      <div>
                        {/* <img
                          className={ContentCSS.postImg}
                          src={`../dist/${result.profileImage}`}
                          alt="profile pic"
                        /> */}
                      </div>
                      <div
                        style={{ textAlign: "center" }}
                        className={ContentCSS.postUsername}
                      >
                        @{result.creator}
                      </div>
                    </div>
                    <div>
                      <p style={{ textAlign: "center" }}>{result.content}</p>
                    </div>
                    <div className={ContentCSS.postFooter}>
                      <span className={ContentCSS.postFooterShowComments}>
                        Comments
                      </span>
                      <div className={ContentCSS.postFooterTag}>
                        {result.tags}
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

export default SearchResults;
