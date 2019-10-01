import React from "react";
import ProfileAvatar from "../ProfileAvatar/profileAvatar";
import NavigationItems from "../NavigationItems/NavigationItems";
import avatar from "../../../../assets/images/User_Avatar.png";
const navItems = [
  {
    id: "guide",
    text: "Join us",
    link: "/guide",
    show: true,
    className: "",
    logo: <i className="fas fa-hands-helping"></i>
  },
  {
    id: "store",
    text: "Store",
    link: "/hi",
    show: true,
    className: "",
    logo: <i className="fas fa-shopping-bag"></i>
  },
  {
    id: "signup",
    text: "Signup",
    link: "/signup",
    onAuth: false,
    logo: <i className="fas fa-user-plus"></i>
  },
  {
    id: "login",
    text: "Account",
    link: "/login",
    onAuth: false,
    logo: <i className="fas fa-user-circle"></i>
  },
  {
    id: "profile",
    text: "Profile",
    link: "/profile",
    onAuth: true,
    logo: <i className="fas fa-user-circle"></i>
  },
];
const subItems = [
  {
    id: "loginjnin",
    text: "Account",
    link: "/login",
    onAuth: false,
    className: "hideOnTablette",
    logo: <i className="fas fa-user-circle"></i>
  },
  {
    id: "logout",
    text: "Logout",
    link: "/logout",
    onAuth: true,
    logo: <i className="fas fa-power-off"></i>
  }
];
const mobileNavigation = props => (
  <nav className={["mobile-nav", props.open ? "open" : ""].join(" ")}>
    <ul className={"nav-list-design  nav-list-mobile"}>
      <NavigationItems
        navItems={navItems}
        mobile
        onChoose={props.onChooseItem}
        isAuth={props.isAuth}
      />
      {/* <ProfileAvatar
        className={"hideOnTabletteOnly"}
        isAuth={props.isAuth}
        onChoose={props.onChooseItem}
        // handleLeave={handleLeave}
        // handleHover={handleHover}
        avatar={avatar}
        subItems={subItems}
      /> */}
    </ul>
  </nav>
);

export default mobileNavigation;
