import React, { Fragment, useEffect, useState } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import { useDispatch, useSelector } from "react-redux";
import Routes from "./pages/Router/routes";
import "./App.less";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas} from '@fortawesome/free-solid-svg-icons'
library.add(fab, fas);

export default props => {
  const getAuth = useSelector(state => state.auth.isAuthenticated);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    if (!getAuth) {
      const userId = localStorage.getItem("userId");
      const remainingMilliseconds =
        new Date(expiryDate).getTime() - new Date().getTime();
      dispatch({ type: "SET_TOK", payload: token });
      dispatch({ type: "SET_UID", payload: userId });
      setAutoLogout(remainingMilliseconds);
      dispatch({ type: "SET_ISAUTH", payload: true });
    }
  }, []);
  const signupHandler = (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);
    fetch("https://letsfindme.site/auth/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        password: authData.signupForm.password.value,
        name: authData.signupForm.name.value
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then(resData => {
        dispatch({ type: "SET_ISAUTH", payload: false });
        setAuthLoading(false);
        this.props.history.replace("/");
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "SET_AUTH_LOADING", payload: false });
        setAuthLoading(false);
        setError(err);
      });
  };

  const setAutoLogout = milliseconds => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const errorHandler = () => {
    setError(null);
  };

  const logoutHandler = () => {
    dispatch({ type: "SET_ISAUTH", payload: false });
    dispatch({ type: "SET_TOK", payload: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");

    props.history.push("/");
  };
  
  const mobileNavHandler = isOpen => {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
  };

  const backdropClickHandler = () => {
    setShowBackdrop(false);
    setShowMobileNav(false);
    setError(null);
  };

 

  return (
    <Fragment>
      {showBackdrop && <Backdrop onClick={backdropClickHandler} />}
      {/* <ErrorHandler error={error} onHandle={errorHandler} /> */}
      <Routes>
        <Layout
          header={
            <MainNavigation
             {...props}
              onOpenMobileNav={mobileNavHandler.bind(this, true)}
              isAuth={getAuth}
            />
          }
          mobileNav={
            <MobileNavigation
              open={showMobileNav}
              mobile
              onChooseItem={() => mobileNavHandler(false)}
              isAuth={getAuth}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
