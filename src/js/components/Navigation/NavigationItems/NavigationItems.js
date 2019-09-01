import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationItems.less";



const navigationItems = props => [
  ...props.navItems
    .filter(item => item.onAuth === props.isAuth || item.show === true)
    .map(item => (
      <li key={item.id} className={["navigation-item", "white", item.className].join(" ")}>
        <NavLink to={item.link} exact onClick={() =>props.onChoose(item)}>
          {item.text}
        </NavLink>
      </li>
    ))
];

export default navigationItems;
