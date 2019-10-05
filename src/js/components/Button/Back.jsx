import React from "react";
import { Link } from "react-router-dom";

const Back = props => (
  <span
    onClick={props.click}
    className={[`back-link`, `${props.className}`].join(" ")}
  >
    <i className="fas fa-arrow-circle-left mx-1"></i>
    {props.text}
  </span>
);

export default Back;
