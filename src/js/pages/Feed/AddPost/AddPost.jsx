import React, { Component, Fragment, useEffect, useState } from "react";

import Post from "../../../components/Feed/Post/Post";
import Button from "../../../components/Button/Button.jsx";
import FeedEdit from "../FeedEdit/FeedEdit";
import Input from "../../../components/Form/Input/Input";
import Paginator from "../../../components/Paginator/Paginator";
import Loader from "../../../components/Loader/Loader";
import ErrorHandler from "../../../components/ErrorHandler/ErrorHandler";


export default props => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {

  }, []);

  const loadPosts = direction => {
    if (direction) {
      setPostsLoading(true);
      setPosts([]);
    }
    let page = postPage;
    if (direction === "next") {
      page++;
      setPostPage(page);
    }
    if (direction === "previous") {
      page--;
      setPostPage(page);
    }
    fetch("https://letsfindme.site/feed/posts?page=" + page, {
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then(resData => {
        setPosts(resData.posts);
        setTotalPosts(resData.totalItems);
        setPostsLoading(false)

        // setState({
        //   posts: resData.posts.map(post => {
        //     return {
        //       ...post,
        //       imagePath: post.imageUrl
        //     };
        //   }),
        //   totalPosts: resData.totalItems,
        //   postsLoading: false
        // });

      })
      .catch(catchError);
  };

  const statusInputChangeHandler = (input, value) => {
    setStatus(value)
  };

  

  const errorHandler = () => {
    setError(null)
   
  };

  const catchError = error => {
    setError(error)
  };

  return (
    <Fragment>
      <ErrorHandler error={error} onHandle={errorHandler} />
      
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      
    </Fragment>
  );
};
