import React from "react";
import { Link } from "react-router-dom";

const Button = props =>
  !props.link ? (
    <button
      className={[
        "btn",
        `btn--${props.design}`,
        `btn--${props.mode}`,
        props.className
      ].join(" ")}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? "Loading..." : props.children}
    </button>
  ) : (
    <Link
      className={[
        `btn--${props.design}`,
        `btn--${props.mode}, ${props.className}`
      ].join(" ")}
      to={props.link}
    >
      <i className="fas fa-arrow-circle-left mx-1"></i>
      {props.children}
    </Link>
  );

export default Button;
