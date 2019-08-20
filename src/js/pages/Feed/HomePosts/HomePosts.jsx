import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "../../../components/Feed/FeedCard/FeedCard";
import Button from "../../../components/Button/Button";
import Loader from "../../../components/Loader/Loader";
import "./HomePosts.less";
export default props => {
  const dispatch = useDispatch();
  const getPosts = useSelector(state => state.feed.posts);

  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(0);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPosts();
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
        dispatch({ type: "SET_POSTS", payload: resData.posts }),
          setPostsLoading(false);
      })
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

  const catchError = error => {
    setError(error);
  };

  return (
    <Fragment>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section>
        {!postsLoading && (
          <div className="post-grid">
            {getPosts.map(post => (
              <FeedCard
                key={post.id}
                id={post.id}
                author={post.author}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={startEditPostHandler.bind(this, post.id)}
              />
            ))}
          </div>
        )}
      </section>
    </Fragment>
  );
};
