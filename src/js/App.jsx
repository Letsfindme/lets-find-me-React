import React, { Component, Fragment, useEffect, useState } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import Toolbar from "./components/Toolbar/Toolbar";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import FeedPage from "./pages/Feed/Feed";
import SinglePostPage from "./pages/Feed/SinglePost/SinglePost";
import LoginPage from "./pages/Auth/Login";
import HomePage from "./pages/Home/Home";
import SignupPage from "./pages/Auth/Signup";
import "./App.css";

export default props => {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

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
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setToken(token);
    setUserId(userId);
    //this.setState({ isAuth: true, token: token, userId: userId });
    setAutoLogout(remainingMilliseconds);
    setIsAuth(true);
  }, []);

  const mobileNavHandler = isOpen => {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
    //this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  const backdropClickHandler = () => {
    setShowBackdrop(false);
    setShowMobileNav(false);
    setError(null);
    //this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  const logoutHandler = () => {
    setIsAuth(false);
    setToken(null);
    //this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);
    //this.setState({ authLoading: true });
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then(resData => {
        setToken(resData.token);
        setUserId(resData.userId);
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        setAuthLoading(false);
        setIsAuth(true);
      })
      .catch(err => {
        console.log(err);
        setIsAuth(false);
        setAuthLoading(false);
        setError(err);
      });
  };

  const signupHandler = (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);
    //this.setState({ authLoading: true });
    fetch("http://localhost:8080/auth/signup", {
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
        setIsAuth(false);
        setAuthLoading(false);
        this.props.history.replace("/");
      })
      .catch(err => {
        console.log(err);
        setIsAuth(false);
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

  let routes = (
    <Switch>
      <Route
        path="/"
        exact
        render={props => (
          <HomePage {...props} />
        )}
      />
      <Route
        path="/login"
        exact
        render={props => (
          <LoginPage {...props} onLogin={loginHandler} loading={authLoading} />
        )}
      />
      <Route
        path="/signup"
        exact
        render={props => (
          <SignupPage
            {...props}
            onSignup={signupHandler}
            loading={authLoading}
          />
        )}
      />
      <Redirect to="/" />
    </Switch>
  );
  if (isAuth) {
    routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={props => <FeedPage userId={userId} token={token} />}
        />
        <Route
          path="/:postId"
          render={props => (
            <SinglePostPage {...props} userId={userId} token={token} />
          )}
        />
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <Fragment>
      {showBackdrop && <Backdrop onClick={backdropClickHandler} />}
      <ErrorHandler error={error} onHandle={errorHandler} />
      <Layout
        header={
          <Toolbar>
            <MainNavigation
              onOpenMobileNav={mobileNavHandler.bind(this, true)}
              onLogout={logoutHandler}
              isAuth={isAuth}
            />
          </Toolbar>
        }
        mobileNav={
          <MobileNavigation
            open={showMobileNav}
            mobile
            onChooseItem={mobileNavHandler.bind(this, false)}
            onLogout={logoutHandler}
            isAuth={isAuth}
          />
        }
      />
      {routes}
    </Fragment>
  );
};
