import React from "react";
import Image from "../../Image/Image";
import "./FeedCard.less";
import { Link } from "react-router-dom";

export default props => (
  <div className="post-card" link={"/feed/" + props.id}>
    <Link to={"/feed/" + props.id}>
      <Image imageUrl={props.image} className="thumb" alt="profile avatar" />
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
          <div className="date">{props.date}</div>
        </div>
        <div className="spacer" />
      </div>
    </Link>
  </div>
);
