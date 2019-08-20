import React from "react";

import "./Image.css";

export default props => (
  <div
    className= {props.className ? props.className : "image"}
    style={{
      backgroundImage: `url('${"http://localhost:8080/" + props.imageUrl}')`,
      backgroundSize: props.contain ? "contain" : "cover",
      backgroundPosition: props.left ? "left" : "center"
    }}
  />
);
