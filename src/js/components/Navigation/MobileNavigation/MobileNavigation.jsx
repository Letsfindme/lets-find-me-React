import React from "react";

import NavigationItems from "../NavigationItems/NavigationItems";
import "./MobileNavigation.less";
const navItems = [
  {
    id: "guide",
    text: "Become a Guide",
    link: "/guide",
    show: true,
    className: ""
  },
  { id: "store", text: "Store", link: "/hi", show: true, className: "" },
  {
    id: "signup",
    text: "Signup",
    link: "/signup",
    onAuth: false
  },
  {
    id: "login",
    text: "Login",
    link: "/login",
    onAuth: false
  },
  {
    id: "logout",
    text: "Logout",
    link: "/logout",
    onAuth: true
  }
];
const mobileNavigation = props => (
  <nav className={["mobile-nav", props.open ? "open" : ""].join(" ")}>
    <ul
      className={"mobile-nav__items"}
    >
      <NavigationItems
        navItems={navItems}
        mobile
        onChoose={props.onChooseItem}
        isAuth={props.isAuth}
      />
    </ul>
  </nav>
);

export default mobileNavigation;
