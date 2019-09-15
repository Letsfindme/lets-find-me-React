import React, { Fragment, useEffect, useState } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import LoginPage from "../../pages/Auth/Login";
import HomePage from "../../pages/Home/Home";
import SignupPage from "../../pages/Auth/Signup";
import PrivateRoute from "./PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import AddPost from "../Feed/AddPost/AddPost";
import Feed from "../Feed/Feed";

export default props => {
  const [authLoading, setAuthLoading] = useState(false);
  const [wasInitialized, setWasInitialized] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const getAuth = useSelector(state => state.auth.isAuthenticated);
  
  useEffect(() => {
    
  }, [getAuth]);

  useEffect(() => {
    setWasInitialized(true);
  }, [getAuth]);

  const signupHandler = (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);
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

  return (
    <BrowserRouter>
      {props.children}
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/add" exact component={AddPost} />
        <Route path="/feed" exact component={Feed} />
        <Route
          path="/signup"
          exact
          render={props => (
            <SignupPage
              onSignup={signupHandler}
              loading={authLoading}
            />
          )}
        />
        <PrivateRoute
          path="/test"
          {...props}
          wasInitialized={wasInitialized}
          component={HomePage}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};
