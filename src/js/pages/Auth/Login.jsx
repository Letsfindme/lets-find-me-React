import React, { Component, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button.jsx";
import { required, length, email } from "../../util/validators";
import { loginValid } from "../../components/Form/Input/validation";

import Auth from "./Auth.jsx";

export default props => {
  const fields = [
    { label: "Email", type: "input", name: "email", value: "" },
    { label: "Password", type: "input", name: "password", value: "" }
  ];
  const [authLoading, setAuthLoading] = useState(false);

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const getAuth = useSelector(state => state.auth.isAuthenticated);
  const [state, setState] = useState({
    loginForm: {
      email: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, email]
      },
      password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      formIsValid: false
    }
  });

  const loginHandler = ( authData) => {
    // event.preventDefault();
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
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        setAuthLoading(false);
        dispatch({ type: "SET_ISAUTH", payload: true });
        props.history.push("/");
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
    props.history.push("/hi");
  };

  const inputChangeHandler = (input, value) => {
    setState(prevState => {
      let isValid = true;
      for (const validator of prevState.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        loginForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  const inputBlurHandler = input => {
    setState(prevState => {
      return {
        loginForm: {
          ...prevState.loginForm,
          [input]: {
            ...prevState.loginForm[input],
            touched: true
          }
        }
      };
    });
  };

  return (
    <Auth>
      <div className="login-card">
        <h1>Welcome Back!</h1>
        <Input
          control="form"
          btnValue="Login"
          fields={fields}
          validation={loginValid}
          formSubmit={e =>
            loginHandler(e)
          }
        />
      </div>
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
