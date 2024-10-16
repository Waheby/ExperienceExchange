import { useEffect, useState } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Empty } from "antd";
import { useSelector } from "react-redux";
import "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function SearchResults() {
  const userStore = useSelector((state) => state.user);

  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("skill");
  const [input, setInput] = useState(searchTerm || "");
  const [results, setResult] = useState([]);
  const [searchBy, setSearchBy] = useState("username");
  const [sortByNewest, setSortByNewest] = useState(true);
  const [searchFor, setSearchFor] = useState("user");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const token = userStore?.token?.token || localStorage.getItem("token");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const searchUserbySkill = async (input, sort) => {
    console.log(transcript);
    if (transcript != null) {
      setInput(transcript);
    }

    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/search-skill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            skill:
              transcript.toLowerCase().trim() || input.toLowerCase().trim(),
            sortByNewest: sort,
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

  const searchUserbyUsername = async (sort) => {
    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/user/search-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            username: transcript || input.toLowerCase().trim(),
            sortByNewest: sort,
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

  const searchPostbyUsername = async (sort) => {
    if (transcript != null) {
      setInput(transcript);
    }

    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/search-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            username:
              transcript.toLowerCase().trim() || input.toLowerCase().trim(),
            sortByNewest: sort,
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

  const searchPostbyTag = async (sort) => {
    if (transcript != null) {
      setInput(transcript);
    }

    if (token) {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/post/search-skill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            skill:
              transcript.toLowerCase().trim() || input.toLowerCase().trim(),
            sortByNewest: sort,
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
        searchUserbySkill(input, sortByNewest);
      } else searchUserbyUsername(sortByNewest);
    } else {
      if (searchBy === "skill") {
        searchPostbyTag(sortByNewest);
      } else searchPostbyUsername(sortByNewest);
    }
  };

  //to search first by query param if present
  useEffect(() => {
    if (searchTerm) {
      searchUserbySkill(searchTerm, sortByNewest);
    }
  }, []);

  return (
    <>
      <img
        style={{
          width: "100%",
          minWidth: "1440px",
          maxWidth: "1900px",
          minHeight: "800px",
          zIndex: "-1",
          position: "absolute",
          marginTop: "-35px",
        }}
        src={`${
          import.meta.env.VITE_CLOUDINARY_URL
        }/v1729095996/blob-scene-haikei_4_nzxgvj.svg`}
        alt=""
      />
      <h1 style={{ textAlign: "center", marginTop: "200px" }}>Search Page</h1>
      <div
        className={ContentCSS.checkBoxContainer}
        style={{
          width: "480px",
          height: "200px",
        }}
      >
        {isVoiceSearch ? (
          <>
            <div className={ContentCSS.searchContainer}>
              <Icon
                icon="icon-park-solid:voice"
                className={ContentCSS.voiceSearchIcon}
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => {
                  setIsVoiceSearch(false);
                  SpeechRecognition.stopListening();
                  setInput("");
                }}
              />
              <input
                className={ContentCSS.searchBar}
                type="text"
                placeholder="Speak to start searching"
                value={transcript}
                onChange={(e) => setInput(transcript)}
              />
              <Icon
                className={ContentCSS.searchIcon}
                icon="material-symbols:search"
                onClick={() => {
                  handleSearch();
                  resetTranscript();
                  setIsVoiceSearch(false);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className={ContentCSS.searchContainer}>
              <Icon
                icon="icon-park-solid:voice"
                className={ContentCSS.voiceSearchIcon}
                onClick={() => {
                  setIsVoiceSearch(true);
                  SpeechRecognition.startListening();
                  setInput("");
                }}
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
                onClick={() => {
                  handleSearch();
                  resetTranscript();
                  setIsVoiceSearch(false);
                }}
              />
            </div>
          </>
        )}

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
        <span>Sort by: </span>
        <div>
          <input
            type="radio"
            id="newest"
            name="sort"
            value="true"
            defaultChecked="true"
            onChange={(e) => {
              setSortByNewest(true);
              setResult([]);
            }}
          />
          <label htmlFor="sort">Newest </label>
          <input
            type="radio"
            id="oldest"
            name="sort"
            value="false"
            onChange={(e) => {
              setSortByNewest(false);
              setResult([]);
            }}
          />
          <label htmlFor="sort">Oldest</label>
        </div>
      </div>
      <div className={ContentCSS.postsPageMainContainer}>
        {results.length < 1 ? (
          <div
            style={{ fontSize: "larger", margin: "auto", marginTop: "150px" }}
          >
            <Empty />
          </div>
        ) : (
          results.map((result, id) => {
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
                        <p style={{ textAlign: "center" }}>
                          @{result.username}
                        </p>
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
          })
        )}
      </div>
    </>
  );
}

export default SearchResults;
