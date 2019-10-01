import React, { useState, useEffect, Fragment } from "react";
import Moment from "react-moment";
import Input from "../../../components/Form/Input/Input";
import Image from "../../../components/Image/Image.jsx";
import Button from "../../../components/Button/Button";
import "./SinglePost.css";

export default props => {
  const fields = [
    {
      label: "Entre your comment here",
      type: "input",
      name: "comment",
      value: ""
    }
  ];

  const [state, setState] = useState({});
  //   {
  //   title: "",
  //   author: "",
  //   date: "",
  //   image: "",
  //   content: "",
  //   token: ""
  // });

  useEffect(() => {
    const postId = props.match.params.postId;
    fetch("http://localhost:8080/feed/post/" + postId, {
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then(resData => {
        setState(resData.post);
        // setState({
        //   title: resData.post.title,
        //   author: resData.post.author,
        //   image: resData.post.imageUrl,
        //   date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
        //   content: resData.post.content
        // });
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const addCommentHandler = value => {
    console.log(comment);
    let method = "POST";
    const postId = props.match.params.postId;
    fetch("http://localhost:8080/feed/post/" + postId, {
      method: method,
      body: JSON.stringify({
        text: value.comment
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(res => {
      if (res.status !== 200 || res.status !== 201) {
        console.log(res.status);

        throw new Error("Failed to add comment");
      }
      return res.json();
    });
  };

  return (
    <Fragment>
      {/* <a onClick={props.history.goBack}>baaaacklink="home"</a> */}
      <Button
        click
        onClick={props.history.goBack}
        className="btn mx--1 mt-8 mb-0"
      >
        back to home
      </Button>
      <section className="feed_edit">
        <h1>{state.title}</h1>
        <h2>
          Created by {state.author} on {state.date}
        </h2>
        <div className="single-post__image">
          <Image imageUrl={state.imageUrl} />
        </div>
        <p>{state.content}</p>
      </section>
      <ul className="feed_edit">
        {state.postComments
          ? state.postComments.map(comment => {
              return (
                <li key={comment.id} className="comment-contain">
                  <Image
                    key={"imagesPreview avatar"}
                    className={"user-profile"}
                    imageUrl={comment.imageRef}
                    left
                  />
                  <div>
                    <div className="comment-right">
                      <h5>{comment.user.username}</h5>
                      <Moment format="YYYY/MM/DD">{comment.createdAt}</Moment>
                      {/* <span>{comment.createdAt}</span> */}
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </li>
              );
            })
          : ""}
      </ul>
      <section className="feed_edit">
        <Input
          control="form"
          fields={fields}
          //validation={newPostValid}
          //onChange={postInputChangeHandler}
          formSubmit={value => addCommentHandler(value)}
          btnValue="Add commit"
          //cancelPostChangeHandler={cancelPostChangeHandler}
        ></Input>
      </section>
    </Fragment>
  );
};
