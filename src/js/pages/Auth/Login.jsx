import React, { Component, useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Form/Input/Input";
import { loginValid } from "../../components/Form/Input/validation";
import { CSSTransition } from "react-transition-group";
import Auth from "./Auth.jsx";

export default props => {
  let modal = props.modal;
  const fields = [
    { label: "Email", type: "input", name: "email", value: "" },
    { label: "Password", type: "input", name: "password", value: "" }
  ];
  const fieldsSignUp = [
    { label: "User name", type: "input", name: "username", value: "" },
    { label: "Email", type: "input", name: "email", value: "" },
    { label: "Password", type: "input", name: "password", value: "" },
    {
      label: "Confirm Password",
      type: "input",
      name: "confirmPassword",
      value: ""
    }
  ];

  const [authLoading, setAuthLoading] = useState(false);
  const [registred, setRegistred] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const getAuth = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    try {
      if (props.history.location.search == "?l=true") {
        setRegistred(false);
      }else{
        setRegistred(true);
      }
    } catch (error) {}
  }, []);
  useEffect(() => {
    try {
      if (props.history.location.search == "?l=true") {
        setRegistred(false);
      }else{
        setRegistred(true);
      }
    } catch (error) {}
  }, [props.history.location.search]);
  const loginHandler = authData => {
    setAuthLoading(true);
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
        dispatch({ type: "SET_TOK", payload: resData.token });
        dispatch({ type: "SET_UID", payload: resData.userId });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        localStorage.setItem("rewards-"+resData.userId, resData.credit);
        localStorage.setItem("ref", resData.type);
        const remainingMilliseconds = 6.048e8;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        setAuthLoading(false);
        dispatch({ type: "SET_ISAUTH", payload: true });
        if (!modal) {
          props.history.push("/");
        } else {
          props.closeModal();
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "SET_ISAUTH", payload: false });
        setAuthLoading(false);
        setError(err);
      });
  };

  const setAutoLogout = milliseconds => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const logoutHandler = () => {
    dispatch({ type: "SET_ISAUTH", payload: false });
    dispatch({ type: "SET_TOK", payload: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    localStorage.setItem("ref", "User");
    props.history.push("/");
  };

  const toggleRegidtred = () => {
    // props.history.location.pathname == "/signup"
    //   ? props.history.push("/login")
    //   : props.history.push("/signup");
    setRegistred(!registred);
    //props.history.push("/signup");
  };

  const signupHandler = authData => {
    //setAuthLoading(true);
    fetch("http://localhost:8080/auth/signup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        username: authData.username
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then(resData => {
        dispatch({ type: "SET_ISAUTH", payload: false });
        setRegistred(!registred);
        setMessage("Registred successfully! please signin!");
        //setAuthLoading(false);
        // props.history.push("/");
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "SET_AUTH_LOADING", payload: false });
        //setAuthLoading(false);
        setError(err);
      });
  };

  return (
    <Auth>
      {registred ? (
        <CSSTransition timeout={500} className="login-card">
          <div key="A">
            {message ? <p> {message}</p> : ""}
            <h1>Welcome Back!</h1>
            <Input
              control="form"
              btnValue="Login"
              fields={fields}
              validation={loginValid}
              formSubmit={e => loginHandler(e)}
            />
            <a onClick={toggleRegidtred}>Don't have an account? join us</a>
          </div>
        </CSSTransition>
      ) : (
        <CSSTransition timeout={500} className="login-card">
          <div key="B">
            <h1>Welcome !</h1>
            <Input
              control="form"
              btnValue="Signup"
              fields={fieldsSignUp}
              validation={loginValid}
              formSubmit={e => signupHandler(e)}
            />
            <a onClick={toggleRegidtred}>Already registred? Go to Login</a>
          </div>
        </CSSTransition>
      )}
    </Auth>
  );
};

/* <form
          onSubmit={e =>
            loginHandler(e, {
              email: state.loginForm.email.value,
              password: state.loginForm.password.value
            })
          }
        >
          <h1>Welcome Back!</h1>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "email")}
            value={state.loginForm["email"].value}
            valid={state.loginForm["email"].valid}
            touched={state.loginForm["email"].touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "password")}
            value={state.loginForm["password"].value}
            valid={state.loginForm["password"].valid}
            touched={state.loginForm["password"].touched}
          />
          <Button design="raised" type="submit" loading={authLoading}>
            Login
          </Button>
        </form> */

/* <div className="login-aside">
          <div className="login-aside-overlay" />
          <h1 className="login-welcome-text">Welcome Back!</h1>
          <hr className="login-aside-hr" />
        </div> */
