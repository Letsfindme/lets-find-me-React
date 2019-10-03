import React from "react";
import Image from "../../Image/Image";
import { Link } from "react-router-dom";
import Moment from "react-moment";

export default props => (
  <div className="post-card" link={"/feed/" + props.id}>
    <Link to={"/feed/" + props.id}>
      <Image imageUrl={props.image} className="thumb" alt="profile avatar" />
      <article>
        <span>{props.title}</span>
        <p>{props.content}</p>
      </article>

      <li className="post-content comment-contain">
        <Image
          key={Date.now()}
          className={"user-profile"}
          imageUrl={props.image}
          left
        />
        <div>
          <div className="comment-right">
            <h5>{props.author}</h5>
            <Moment format="YYYY/MM/DD hh:mm">{props.date}</Moment>
          </div>
        </div>
      </li>

      {/* <div className="post-header">
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
      </div> */}
    </Link>
  </div>
);
