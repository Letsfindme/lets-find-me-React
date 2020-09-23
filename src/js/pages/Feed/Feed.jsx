import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "./FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";
import Login from "../../pages/Auth/Login";
import { apiFetch } from "../../util/fetch";
import FeedCard from "../../components/Feed/FeedCard/FeedCard";

export default (props) => {
  const url = `https://letsfindme.site/feed/topsearch`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpeng] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(false);
  const getAuth = useSelector((state) => state.auth.isAuthenticated);
  const getToken = useSelector((state) => state.auth.token);
  const getPosts = useSelector((state) => state.feed.posts);
  const statusUrl = "https://letsfindme.site/auth/status";

  useEffect(() => {
    // Load top feed by choosen gategory
    topsearch();
    if (getToken) {
      // Get status
      fetch(statusUrl, {
        headers: {
          Authorization: "Bearer " + getToken,
        },
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch user status.");
          }
          return res.json();
        })
        .then((resData) => {
          setStatus(resData.status);
        })
        .catch(catchError);
    }
  }, [getToken]);

  useEffect(() => {}, [status]);

  const closeModal = () => {
    setModalIsOpeng(false);
  };

  const topsearch = async () => {
    const { res } = await apiFetch(url, options);
    dispatch({ type: "SET_POSTS", payload: res.posts }), setPosts(res.posts);
    setTotalPosts(res.totalItems);
    setPostsLoading(false);
  };

  const loadPosts = (direction) => {
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
        Authorization: "Bearer " + getToken,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((resData) => {
        dispatch({ type: "SET_POSTS", payload: resData.posts }),
          setPosts(resData.posts);
        setTotalPosts(resData.totalItems);
        setPostsLoading(false);
      })
      .catch(catchError);
  };

  const statusUpdateHandler = (event) => {
    event.preventDefault();
    fetch("https://letsfindme.site/auth/status", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + getToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    })
      .then((res) => {
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

  const startEditPostHandler = (postId) => {
    setEditPost(() => {
      const loadedPost = posts.find((p) => p.id === postId);
      setIsEditing(true);
      return loadedPost;
    });
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = (postData) => {
    if (!getAuth) {
      setModalIsOpeng(true);
    } else {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("category", postData.category);
      formData.append("location", JSON.stringify(postData.location));
      for (var x = 0; x < postData.image.length; x++) {
        formData.append("image", postData.image[x]);
      }
      let url = "https://letsfindme.site/feed/post";
      let method = "POST";
      if (editPost) {
        url = "https://letsfindme.site/feed/post/" + editPost._id;
        method = "PUT";
      }
      fetch(url, {
        mode: 'cors',
        method: method,
        body: formData,
        headers: {
          Authorization: "Bearer " + getToken,
        },
      })
        .then((res) => {
          if (res.status !== 201) {
            throw new Error("Creating or editing a post failed!");
          }
          return res.json();
        })
        .then((resData) => {
          localStorage.setItem("rewards-" + resData.userId, resData.credit);
          //todo post on hold for admin
          //user can see there own post
          //user can modify there posts
          props.history.push("/feed/" + resData.post.id);
        })
        .catch((err) => {
          console.log(err);
          // setState(...state, {
          //   isEditing: false,
          //   editPost: null,
          //   editLoading: false,
          //   error: err
          // });
        });
    }
  };

  const statusInputChangeHandler = (input, value) => {
    setStatus(value);
  };

  const deletePostHandler = (postId) => {
    // setState(...state, { postsLoading: true });
    // fetch("https://letsfindme.site/feed/post/" + postId, {
    //   method: "DELETE",
    //   headers: {
    //     Authorization: "Bearer " + props.token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error("Deleting a post failed!");
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     setState(prevState => {
    //       const updatedPosts = prevState.posts.filter(p => p._id !== postId);
    //       return { posts: updatedPosts, postsLoading: false };
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     setState(...state, { postsLoading: false });
    //   });
  };

  const errorHandler = () => {
    setError(null);
  };

  const catchError = (error) => {
    setError(error);
  };

  return (
    <Fragment>
      {error && <ErrorHandler error={error} onHandle={errorHandler} />}
      {modalIsOpen ? (
        <Fragment>
          <Backdrop />
          <Modal mobile noHeader noAction>
            <Login {...props} modal={true} closeModal={closeModal} />
          </Modal>
        </Fragment>
      ) : (
        ""
      )}
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
        title="Start wrinting your post!!"
      >
        <Button link="home" className="back-link">
          back to home
        </Button>
      </FeedEdit>
      <section className="feed">
        {postsLoading ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        ) : (
          <div className="post-grid">
            {posts.length === 0 && (
              <p style={{ textAlign: "center" }}>No posts found.</p>
            )}
            {getPosts.map((post) => (
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
        )}
      </section>
    </Fragment>
  );
};
