import React, { Fragment } from "react";
import Moment from "react-moment";
import Image from "../../../components/Image/Image.jsx";
import Button from "../../Button/Button";

const UserCard = ({ className, user, createdAt }) => (
  <Fragment>
    <Image
      previews={user.Avatar ? undefined : true}
      local={user.Avatar ? undefined : true}
      key={"imagesPreview avatar"}
      className={"user-profile"}
      imageUrl={user.Avatar ? user.Avatar.imageRef : avatarPng}
      left
    />
    <div className="username-container">
      <h5>{user.username}</h5>
      <Moment format="YYYY/MM/DD hh:mm">{createdAt}</Moment>
    </div>
    <Button type="submit" className="btn">
      Send me a message!!
    </Button>
  </Fragment>
);

export default UserCard;
