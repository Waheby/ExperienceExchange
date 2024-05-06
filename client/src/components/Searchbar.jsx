import { useState } from "react";
import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import { Navigate, useNavigate } from "react-router-dom";

function Searchbar() {
  const [input, setInput] = useState("");
  let navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?skill=${input}`);
  };

  return (
    <>
      <div className={ContentCSS.searchContainer}>
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
    </>
  );
}

export default Searchbar;
