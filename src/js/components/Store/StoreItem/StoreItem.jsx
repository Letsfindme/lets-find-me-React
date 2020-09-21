import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import Image from "../../Image/Image";

export default props => {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    props.added ? setAdded(props.added) : "";
  }, []);
  const onAdd = id => {
    props.onAdd(id);
    setAdded(false);
  };
  const onRemove = id => {
    props.onRemove(id);
    setAdded(true);
  };
  return (
    <div className="post-card -store-item" link={"/product/" + props.id}>
      <div className={"dv-star-rating"}>
        Costs: <strong> {props.price} </strong> +ME
      </div>
      {!props.added ? (
        <div
          className={"dv-star-rating -basket"}
          onClick={() => onAdd(props.id)}
        >
          Add to basket
        </div>
      ) : !props.order ? (
        <div
          className={"dv-star-rating -basket"}
          onClick={() => onRemove(props.id)}
        >
          Remove from basket
        </div>
      ) : (
        ""
      )}
      <Link to={"/product/" + props.id}>
        <Image
          imageUrl={props.imageUrl}
          className="thumb"
          alt="profile avatar"
        />
        <article>
          <span>{props.title}</span>
          <p>{props.description}</p>
        </article>
      </Link>
    </div>
  );
};
