import React, { Fragment, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "../../../components/Feed/FeedCard/FeedCard";
import { makeStyles } from "@material-ui/core/styles";
import SearchCard from "../../../components/Search/SearchCard";
import avatarPng from "../../../../assets/images/User_Avatar.png";

export default props => {
  const dispatch = useDispatch();
  const getPosts = useSelector(state => state.feed.posts);

  const [isEditing, setIsEditing] = useState(true);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(0);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(5);

  const useStyles = makeStyles(theme => ({
    text: {
      padding: theme.spacing(2, 2, 0)
    },
    paper: {
      paddingBottom: 50
    },
    list: {
      marginBottom: theme.spacing(2)
    },
    subheader: {
      backgroundColor: theme.palette.background.paper
    },
    appBar: {
      top: "100px",
      position: "sticky",
      bottom: 0,
      left: 0
    },
    grow: {
      flexGrow: 1
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: "0 auto"
    }
  }));

  const classes = useStyles();

  useEffect(() => {
    setPostsLoading(true);
    loadPosts();
    setPostsLoading(false);
  }, []);

  const loadPosts = () => {
    fetch("http://localhost:8080/feed/topfeed")
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then(resData => {
        dispatch({ type: "SET_POSTS", payload: resData.posts });
      })
      .then(setPostsLoading(false))
      .catch(catchError);
  };

  const statusUpdateHandler = event => {
    event.preventDefault();
    fetch("http://localhost:8080/auth/status", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: status
      })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .catch(catchError);
  };

  const newPostHandler = () => {
    setIsEditing(true);
  };

  const startEditPostHandler = postId => {
    setEditPost(() => {
      const loadedPost = posts.find(p => p.id === postId);
      setIsEditing(true);
      return loadedPost;
    });
  };

  const acceptSearchChangeHandler = searchForm => {
    const { term, city, category } = searchForm;
    return props.history.push(
      "/feed/search?term=" + term + "&category=" + category + "&city=" + city
    );
  };

  const catchError = error => {
    setError(error);
  };

  return (
    <div className="home-wrapper">
      <div className="search-container">
        <div className="search-card" position="sticky">
          <SearchCard
            {...props}
            acceptSearchChangeHandler={acceptSearchChangeHandler}
            className="box-shadow-7"
          />
        </div>
      </div>
      {/* <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section> */}
      <div className="posts-container">
        <div className="post-grid">
          <h1>Check out Best ME articles</h1>
          {!postsLoading &&
            // getPosts &&
            getPosts.map(post => (
              <FeedCard
                key={post.id}
                id={post.id}
                startCount={post.starCount}
                author={post.user.username}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                thumb={post.imageUrl}
                image={post.user.Avatar ? post.user.Avatar.imageRef : undefined}
                content={post.content}
                onStartEdit={startEditPostHandler.bind(this, post.id)}
              />
            ))}
        </div>
      </div>
      {/* <!-- Add new post button  --> */}
      <div className="plus-button-container">
        <Route
          render={({ history }) => (
            <button
              className="plus-button"
              type="button"
              onClick={() => {
                history.push("/feed");
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
