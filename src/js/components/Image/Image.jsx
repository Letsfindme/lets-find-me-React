import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Image.css";

export default props =>
  props.previews ? (
    <div
      className={props.className}
      style={{
        backgroundImage: `url('${props.imageUrl}')`,
        backgroundSize: props.contain ? "contain" : "cover",
        backgroundPosition: props.backgroundPosition
          ? props.backgroundPosition
          : "center"
      }}
    >
      <span onClick={props.onClick}><FontAwesomeIcon icon="trash-alt"/></span>
    </div>
  ) : (
    <div
      className={props.className ? props.className : "image"}
      style={{
        backgroundImage: `url('${"http://localhost:8080/" + props.imageUrl}')`,
        backgroundSize: props.contain ? "contain" : "cover",
        backgroundPosition: props.backgroundPosition
          ? props.backgroundPosition
          : "center"
      }}
    />
  );
