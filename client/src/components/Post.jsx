import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

function Post() {
  return (
    <>
      <div className={ContentCSS.postContainer}>
        <div className={ContentCSS.postTop}>
          <div>
            <img
              className={ContentCSS.postImg}
              src={"/vite.svg"}
              alt="profile pic"
            />
          </div>
          <div className={ContentCSS.postUsername}>@Username</div>
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum,
            reprehenderit? Repellendus nulla magnam aliquam ducimus, facere
            nihil dolorum incidunt placeat facilis veniam ex at quisquam non,
            aut earum amet iste.
          </p>
        </div>
        <div className={ContentCSS.postFooter}>
          <span className={ContentCSS.postFooterShowComments}>Comments</span>
          <div className={ContentCSS.postFooterTag}>Post Tag</div>
        </div>
      </div>
    </>
  );
}

export default Post;
