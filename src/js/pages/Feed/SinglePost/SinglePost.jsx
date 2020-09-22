import React, { useState, useEffect, Fragment } from "react";
import Moment from "react-moment";
import Input from "../../../components/Form/Input/Input";
import Image from "../../../components/Image/Image.jsx";
import Back from "../../../components/Button/Back";
import StarRatingComponent from "react-star-rating-component";
import avatarPng from "../../../../assets/images/User_Avatar.png";
import { useSelector } from "react-redux";
import MapWrapped from "../../../components/map/map";
import UserCard from "../../../components/User/UserCard/UserCard";

export default props => {
  const fields = [
    {
      label: "Entre your comment here",
      type: "input",
      name: "comment",
      value: ""
    }
  ];
  const [state, setState] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [posttingComment, setPosttingComment] = useState(false);
  const userAvatar = useSelector(state => state.auth.avatar);

  useEffect(() => {
    const postId = props.match.params.postId;
    fetch("http://letsfindme.site/feed/post/" + postId, {
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
        setPostComments(resData.post.postComments);
        setRating(resData.post.starCount);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const addCommentHandler = value => {
    let method = "POST";
    const postId = props.match.params.postId;
    fetch("http://letsfindme.site/feed/post/" + postId, {
      method: method,
      body: JSON.stringify({
        text: value.comment
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status !== 201 || res.status !== 201) {
          throw new Error("Failed to add comment");
        }
        return res.json();
      })
      .then(res => {
        setPosttingComment(true);
        setPostComments([...postComments, res.comment]);
        setPosttingComment(false);
      });
  };

  const onStarClick = (nextValue, prevValue, name) => {
    const postId = props.match.params.postId;
    fetch("http://letsfindme.site/feed/post/" + postId + "/" + nextValue, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 201 || res.status !== 201) {
          throw new Error("Failed to add rate");
        }
        return res.json();
      })
      .then(res => {
        setRating(res.rate);
      });
  };

  return (
    <Fragment>
      <section className="feed-container post-content">
        <Back click={props.history.goBack} text=" back to home" />
        <h1>{state.title}</h1>
        <div className="single-post__image">
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={rating}
            onStarClick={onStarClick}
          />
          <Image imageUrl={state.imageUrl} />
        </div>
        <li className="usercard-container">
          {state.user && (
            <UserCard user={state.user} createdAt={state.createdAt} />
          )}
        </li>
        <p>{state.content}</p>
        <div className="post-action">
          <i className="far fa-thumbs-up">
            <StarRatingComponent
              name="rate1"
              starCount={5}
              value={rating}
              onStarClick={onStarClick}
            />
          </i>
          <i className="far fa-comment-alt" />
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
      <section className="feed-container map">
        {state.address && (
          <MapWrapped
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `200px` }} />}
            mapElement={<div style={{ height: `201px` }} />}
            lat={state.address.lat}
            lang={state.address.lang}
          />
        )}
      </section>
      {/* comments */}
      <ul className="feed-container comments">
        {postComments && postComments.length > 0 && (
          <Fragment>
            <p>{postComments.length} comments</p>
            {postComments.map(comment => {
              return (
                <li key={comment.id} className="comment-contain">
                  <Image
                    key={"imagesPreview avatar"}
                    className={"user-profile"}
                    previews={comment.imageRef ? undefined : true}
                    local={comment.imageRef ? undefined : true}
                    imageUrl={comment.imageRef ? comment.imageRef : avatarPng}
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
          </Fragment>
        )}
        {/* Add new comment section */}
        <section className="comment-add">
          {state &&userAvatar ? (
            <Image
              key={"imagesPreview avatar"}
              className={"user-profile user-profile-commment"}
              left
              imageUrl={userAvatar ? userAvatar : avatarPng}
            />
          ) : (
            <img className="user-profile" src={avatarPng} />
          )}
          {!posttingComment && (
            <Input
              id={"commentId"}
              control="form"
              fields={fields}
              //validation={newPostValid}
              //onChange={postInputChangeHandler}
              formSubmit={value => addCommentHandler(value)}
              onSubmit={value => addCommentHandler(value)}
              btnValue={<i className="fas fa-paper-plane"></i>}
              //cancelPostChangeHandler={cancelPostChangeHandler}
            />
          )}
        </section>
      </ul>
    </Fragment>
  );
};
