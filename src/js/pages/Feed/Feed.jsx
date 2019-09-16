import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.less";

export default props => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(true);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(false);
  const getAuth = useSelector(state => state.auth.isAuthenticated);
  const getToken = useSelector(state => state.auth.token);
  const getPosts = useSelector(state => state.feed.posts);

  useEffect(() => {
    if (getToken) {
      loadPosts();
      fetch("http://localhost:8080/auth/status", {
        headers: {
          Authorization: "Bearer " + getToken
        }
      })
        .then(res => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch user status.");
          }
          return res.json();
        })
        .then(resData => {
          setStatus(resData.status);
        })
        .catch(catchError);
    }
  }, [getToken]);

  useEffect(() => {}, [status]);

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
    fetch("http://localhost:8080/feed/posts?page=" + page, {
      headers: {
        Authorization: "Bearer " + getToken
      }
    })
      .then(res => {
        if (res.status !== 200) {
          console.log("res.status", res.status);

          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then(resData => {
        dispatch({ type: "SET_POSTS", payload: resData.posts }),
          setPosts(resData.posts);
        setTotalPosts(resData.totalItems);
        setPostsLoading(false);
      })
      .catch(catchError);
  };

  const statusUpdateHandler = event => {
    event.preventDefault();
    fetch("http://localhost:8080/auth/status", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + getToken,
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

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = postData => {
    console.log("tryng to post ", postData);
    setEditLoading(true);
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    for (var x = 0; x < postData.image.length; x++) {
      formData.append("image", postData.image[x]);
    }
    let url = "http://localhost:8080/feed/post";
    let method = "POST";
    if (editPost) {
      url = "http://localhost:8080/feed/post/" + editPost._id;
      method = "PUT";
    }
    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: "Bearer " + getToken
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .then(resData => {
        const post = {
          id: resData.post.id,
          title: resData.post.title,
          content: resData.post.content,
          creator: resData.post.creator,
          createdAt: resData.post.createdAt
        };
        setPosts(prevState => {
          let updatedPosts = [...prevState.posts];
          if (prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p.id === prevState.editPost.id
            );
            updatedPosts[postIndex] = post;
          } else if (prevState.posts.length < 2) {
            updatedPosts = prevState.posts.concat(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        console.log(err);
        // setState(...state, {
        //   isEditing: false,
        //   editPost: null,
        //   editLoading: false,
        //   error: err
        // });
      });
  };

  const statusInputChangeHandler = (input, value) => {
    setStatus(value);
  };

  const deletePostHandler = postId => {
    // setState(...state, { postsLoading: true });
    // fetch("http://localhost:8080/feed/post/" + postId, {
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
    //     console.log(resData);
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

  const catchError = error => {
    setError(error);
  };

  return (
    <Fragment>
      {error && <ErrorHandler error={error} onHandle={errorHandler} />}
      <section className="feed__status">
        {/* <form onSubmit={statusUpdateHandler}>
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
        </form> */}
      </section>
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
        title="Start wrinting your post!!"
      />

      {/* <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section> */}
      <section className="feed">
        {postsLoading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          // <Paginator
          //   onPrevious={loadPosts.bind(this, "previous")}
          //   onNext={loadPosts.bind(this, "next")}
          //   lastPage={Math.ceil(totalPosts / 2)}
          //   currentPage={postPage}
          // >
          <div className="post-grid">
            {getPosts.map(post => (
              <Post
                {...props}
                key={post.id}
                id={post.id}
                author={post.author}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={startEditPostHandler.bind(this, post.id)}
                onDelete={deletePostHandler.bind(this, post.id)}
              />
            ))}
          </div>

          // </Paginator>
        )}
      </section>
    </Fragment>
  );
};
