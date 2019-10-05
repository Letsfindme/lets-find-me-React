import React, { useState, useEffect, Fragment } from "react";
import Moment from "react-moment";
import Input from "../../../components/Form/Input/Input";
import Image from "../../../components/Image/Image.jsx";
import Back from "../../../components/Button/Back";

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
      <section className="feed_edit post-content">
        <Back click={props.history.goBack} text=" back to home" />
        <h1>{state.title}</h1>
        <div className="single-post__image">
          <Image imageUrl={state.imageUrl} />
        </div>
        <li className="post-content comment-contain">
          {state.user && (
            <Fragment>
              <Image
                key={"imagesPreview avatar"}
                className={"user-profile"}
                imageUrl={state.user.Avatar.imageRef}
                left
              />
              <div>
                <div className="comment-right">
                  <h5>{state.user.username}</h5>
                  <Moment format="YYYY/MM/DD hh:mm">{state.createdAt}</Moment>
                </div>
              </div>
            </Fragment>
          )}
        </li>
        <p>{state.content}</p>
        <div className="post-action">
          <i className="far fa-thumbs-up"></i>
          <i className="far fa-comment-alt"></i>
        </div>
        {/* profile public et profile privee */}
        {/* <div className="post-content">
          {state.user && (
            <Image
              key={"imagesPreview avatar"}
              className={"user-profile"}
              imageUrl={state.user.Avatar.imageRef}
              left
            />
          )}
          <p>{state.content}</p>
        </div> */}
      </section>

      {state.postComments && state.postComments.length > 0 && (
        <ul className="feed_edit comments">
          <p>{state.postComments.length} comments</p>
          {state.postComments.map(comment => {
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
                    <Moment format="YYYY/MM/DD hh:mm">
                      {comment.createdAt}
                    </Moment>
                    {/* <span>{comment.createdAt}</span> */}
                  </div>
                  <p>{comment.text}</p>
                </div>
              </li>
            );
          })}

          <section className="comment-add">
            {state.user && (
              <Image
                key={"imagesPreview avatar"}
                className={"user-profile user-profile-commment"}
                imageUrl={state.user.Avatar.imageRef}
                left
              />
            )}
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
        </ul>
      )}
    </Fragment>
  );
};
