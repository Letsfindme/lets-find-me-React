import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, withRouter } from "react-router-dom";
import { history } from "../../../store/";
import MobileToggle from "../MobileToggle/MobileToggle";
import Logo from "../../Logo/Logo";
import avatarPng from "../../../../assets/images/User_Avatar.png";
import logo from "../../../../assets/images/logo.png";
import NavigationItems from "../NavigationItems/NavigationItems";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";

const mainNavigation = props => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateAvatar = useSelector(state => state.app.updateAvatar);

  useEffect(() => {
    setAvatar(updateAvatar);
  }, [updateAvatar]);

  useEffect(() => {
    token
      ? getUserProfileImage(newAvatar => {
          setAvatar(newAvatar);
        })
      : "";
  }, [token]);

  const getUserProfileImage = cb => {
    fetch("http://letsfindme.site/user/profile/avatar", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch avatar.");
        }
        return res.json();
      })
      .then(newAvatar => {
        newAvatar.Avatar
          ? dispatch({ type: "SET_AVATAR", payload: newAvatar.Avatar })
          : "";
        cb(newAvatar.Avatar);
      }); //.catch(catchError);
  };

  const logoutHandler = () => {};

  const onChoose = item => {
    if (item.id === "logout") {
      dispatch({ type: "SET_TOK", payload: null });
      dispatch({ type: "SET_ISAUTH", payload: false });
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      localStorage.removeItem("userId");
      props.history.push("/login");
    }

    ////////////// explode function //////////////
    var anchors = document.querySelectorAll("li");
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
      c.style.zIndex = "1000";
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
  };

  let navItems = [
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
      link: "/store",
      show: true,
      className: "hideOnTablette",
      logo: <i className="fas fa-shopping-bag"></i>
    },
    {
      id: "signupitemid",
      text: "Signup",
      link: "/login?l=true",
      onAuth: false,
      className: "hideOnTablette",
      logo: <i className="fas fa-user-plus"></i>
    },
    {
      id: "loinitemnav",
      text: "Account",
      link: "/login",
      onAuth: false,
      className: "hideOnTablette",
      logo: <i className="fas fa-user-circle"></i>
    }
  ];
  useEffect(() => {
    if (props.history.location.pathname == "/store") {
      navItems[1].show = false;
      steNavItemsUpdate(navItems);
    } else {
      navItems[1].show = true;
      steNavItemsUpdate(navItems);
    }
  }, [props.history.location.pathname]);
  const [navItemsUpdate, steNavItemsUpdate] = useState(navItems);
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
    },
    {
      id: "profile",
      text: "Profile",
      link: "/profile",
      onAuth: true,
      logo: <i className="fas fa-user-circle"></i>
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

      <ul className="nav-list nav-list-design ">
        <NavigationItems
          navItems={navItemsUpdate}
          isAuth={props.isAuth}
          onChoose={onChoose}
        />
        <ProfileAvatar
          isAuth={props.isAuth}
          onLogout={logoutHandler}
          onChoose={onChoose}
          avatar={avatar}
          logo={avatarPng}
          subItems={subItems}
        />
      </ul>
    </nav>
  );
};

export default withRouter(mainNavigation);
