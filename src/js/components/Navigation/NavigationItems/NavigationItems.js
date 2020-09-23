import React from "react";
import { NavLink } from "react-router-dom";
const navigationItems = (props) => [
  ...props.navItems
    .filter((item) => item.onAuth === props.isAuth || item.show === true)
    .map((item) => (
      <li
        href={item.href ? item.href : ""}
        key={item.id}
        className={["navigation-item", item.className].join(" ")}
      >
        <NavLink to={item.link} exact onClick={() => props.onChoose(item)}>
          {item.logo} <span className="hidemeonxs">{item.text}</span>
        </NavLink>
      </li>
    )),
];

export default navigationItems;
