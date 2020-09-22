import React, { useEffect, useState } from "react";
import Back from "../../../components/Button/Back";
import FeedCard from "../../../components/Feed/FeedCard/FeedCard";
import Paginator from "../../../components/Paginator/Paginator";
import { apiFetch } from "../../../util/fetch";

export default props => {
  const url = `http://letsfindme.site/feed/user-posts`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  };
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    getUserPosts(searchUrl);
  }, []);

  const getUserPosts = async searchUrl => {
    const { res } = await apiFetch(url + searchUrl, options);
    setPosts(res.posts);
    setCurrentPage(parseInt(res.currentPage));
    setLastPage(parseInt(res.count) - 1);
  };

  useEffect(() => {
    if (searchUrl) {
      console.log(searchUrl);

      props.history.push(searchUrl);
      getUserPosts(searchUrl);
    }
  }, [searchUrl]);

  const nextSearchHandler = () => {
    console.log("next");
    let num = parseInt(currentPage);
    num++;
    setCurrentPage(num++);
  };

  const prevSearchHandler = () => {
    let num = parseInt(currentPage);
    num--;
    setCurrentPage(num--);
  };

  useEffect(() => {
    console.log("currentPage", currentPage);

    setSearchUrl("?currentPage=" + currentPage);
  }, [currentPage]);

  return (
    <div className={"wrapper-store"}>
      <div className={"navigation"}>
        <Back click={props.history.goBack} text="Back" />
      </div>

      <div className="post-grid">
        {posts &&
          posts.length != 0 &&
          posts.map(post => (
            <FeedCard
              key={post.id}
              id={post.id}
              startCount={post.starCount}
              author={post.author}
              date={new Date(post.createdAt).toLocaleDateString("en-US")}
              title={post.title}
              thumb={post.imageUrl}
              image={post.user.Avatar ? post.user.Avatar.imageRef : undefined}
              content={post.content}
              //onStartEdit={startEditPostHandler.bind(this, post.id)}
            />
          ))}
      </div>
      <Paginator
        currentPage={currentPage}
        lastPage={lastPage}
        onPrevious={prevSearchHandler}
        onNext={nextSearchHandler}
      ></Paginator>
    </div>
  );
};
