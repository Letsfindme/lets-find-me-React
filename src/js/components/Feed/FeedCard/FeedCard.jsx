import React from "react";
import Image from "../../Image/Image";
import "./FeedCard.less";

export default props => (
  <div className="post-card">
    <Image
        imageUrl={props.image}
        className={"thumb"}
        alt="profile avatar"
      />
    <article>
      <span>{props.title}</span>
      <p>{props.content}</p>
    </article>
    <div className="post-header">
      <Image
        imageUrl={props.image}
        contain
        className="im-here-img"
        alt="profile avatar"
      />
      <div className="title">
        <div>{props.author}</div>
        <div className="date">{props.updatedAt}</div>
      </div>
      <div className="spacer" />
    </div>
  </div>
);
