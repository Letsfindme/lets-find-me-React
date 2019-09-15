import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Route, withRouter } from "react-router-dom";
import { history } from "../../../store/";
import MobileToggle from "../MobileToggle/MobileToggle";
import Logo from "../../Logo/Logo";
import avatar from "../../../../assets/images/User_Avatar.png";
import logo from "../../../../assets/images/logo.png";
import NavigationItems from "../NavigationItems/NavigationItems";
import Submenu from "./SubMenu";
import { useDispatch } from "react-redux";
import ProfileAvatar from "../ProfileAvatar/profileAvatar";

const mainNavigation = props => {
  const dispatch = useDispatch();
  const [showAboutMenu, setShowAboutMenu] = useState(false);

  const handleHover = event => {
    console.log(true);
    setShowAboutMenu(true);
  };

  const handleLeave = event => {
    console.log(false);

    setShowAboutMenu(false);
  };

  const logoutHandler = () => {
    console.log("nav", props.history);
  };

  const onChoose = item => {
    console.log(item.id);

    var anchors = document.querySelectorAll("a");
    Array.prototype.forEach.call(anchors, function(anchor) {
      anchor.addEventListener("click", explode);
    });
    function explode(e) {
      var x = e.clientX;
      var y = e.clientY;
      var c = document.createElement("canvas");
      var ctx = c.getContext("2d");
      var ratio = window.devicePixelRatio;
      var particles = [];

      document.body.appendChild(c);

      c.style.position = "absolute";
      c.style.left = x - 100 + "px";
      c.style.top = y - 100 + "px";
      c.style.pointerEvents = "none";
      c.style.width = 200 + "px";
      c.style.height = 200 + "px";
      c.width = 200 * ratio;
      c.height = 200 * ratio;

      function Particle() {
        return {
          x: c.width / 2,
          y: c.height / 2,
          radius: r(20, 30),
          color: "rgb(" + [r(0, 255), r(0, 255), r(0, 255)].join(",") + ")",
          rotation: r(0, 360, true),
          speed: r(8, 12),
          friction: 0.9,
          opacity: r(0, 0.5, true),
          yVel: 0,
          gravity: 0.1
        };
      }

      for (var i = 0; ++i < 25; ) {
        particles.push(Particle());
      }

      console.log(particles[0]);

      function render() {
        ctx.clearRect(0, 0, c.width, c.height);

        particles.forEach(function(p, i) {
          angleTools.moveOnAngle(p, p.speed);

          p.opacity -= 0.01;
          p.speed *= p.friction;
          p.radius *= p.friction;

          p.yVel += p.gravity;
          p.y += p.yVel;

          if (p.opacity < 0) return;
          if (p.radius < 0) return;

          ctx.beginPath();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
          ctx.fill();
        });
      }

      (function renderLoop() {
        requestAnimationFrame(renderLoop);
        render();
      })();

      setTimeout(function() {
        document.body.removeChild(c);
      }, 3000);
    }
    var angleTools = {
      getAngle: function(t, n) {
        var a = n.x - t.x,
          e = n.y - t.y;
        return (Math.atan2(e, a) / Math.PI) * 180;
      },
      getDistance: function(t, n) {
        var a = t.x - n.x,
          e = t.y - n.y;
        return Math.sqrt(a * a + e * e);
      },
      moveOnAngle: function(t, n) {
        var a = this.getOneFrameDistance(t, n);
        (t.x += a.x), (t.y += a.y);
      },
      getOneFrameDistance: function(t, n) {
        return {
          x: n * Math.cos((t.rotation * Math.PI) / 180),
          y: n * Math.sin((t.rotation * Math.PI) / 180)
        };
      }
    };
    function r(a, b, c) {
      return parseFloat(
        (Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(
          c ? c : 0
        )
      );
    }
    if (item.id === "logout") {
      dispatch({ type: "SET_TOK", payload: null });
      dispatch({ type: "SET_ISAUTH", payload: false });
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("userId");
      props.history.push("/login");
    }
  };

  const navItems = [
    {
      id: "guidbecomea",
      text: "Join us",
      link: "/guide",
      show: true,
      className: "hideOnTablette",
      logo: <i className="fas fa-hands-helping"></i>
    },
    {
      id: "dtorenavitem",
      text: "Store",
      link: "/hi",
      show: true,
      className: "hideOnTablette",
      logo: <i className="fas fa-shopping-bag"></i>
    },
    {
      id: "signupitemid",
      text: "Signup",
      link: "/signup",
      onAuth: false,
      className: "hideOnTablette",
      logo: <i className="fas fa-user-plus"></i>
    },
    {
      id: "loinitemnav",
      text: "Login",
      link: "/login",
      onAuth: false,
      className: "hideOnTablette",
      logo: <i className="fas fa-user-circle"></i>
    }
  ];
  const subItems = [
    {
      id: "loginjnin",
      text: "Login",
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

  return (
    <nav className="nav-toolbar">
      <MobileToggle
        onOpen={props.onOpenMobileNav}
        aria-label="Toggle sidenav"
      />

      <div className="main-nav__logo">
        <NavLink className="flex items-center" to="/">
          <img className="nav-logo" src={logo} alt="img" />
          <Logo className="textlogo" />
        </NavLink>
      </div>
      <div className="spacer" />

      <ul className="nav-list nav-list-design hideOnMobile">
        <NavigationItems
          navItems={navItems}
          isAuth={props.isAuth}
          onChoose={onChoose}
        />
        <ProfileAvatar
          isAuth={props.isAuth}
          onLogout={logoutHandler}
          onChoose={onChoose}
          // handleLeave={handleLeave}
          // handleHover={handleHover}
          showAboutMenu={showAboutMenu}
          avatar={avatar}
          subItems={subItems}
        />
      </ul>
    </nav>
  );
};

export default withRouter(mainNavigation);
