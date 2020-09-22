import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button.jsx";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth.jsx";
import { signUpValid } from "../../components/Form/Input/validation";
import { NavLink, Route, withRouter } from "react-router-dom";

export default props => {
  const fields = [
    { label: "User name", type: "input", name: "username", value: "" },
    { label: "Email", type: "input", name: "email", value: "" },
    { label: "Password", type: "input", name: "password", value: "" },
    { label: "Confirm Password", type: "input", name: "confirmPassword", value: "" }
  ];
  const dispatch = useDispatch();

 
  
  const signupHandler = authData => {

    //setAuthLoading(true);
    fetch("http://letsfindme.site/auth/signup", {
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
          console.log("Error!");
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then(resData => {
        dispatch({ type: "SET_ISAUTH", payload: false });
        //setAuthLoading(false);
        props.history.push("/");
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
      <div className="login-card">
        <h1>Welcome!</h1>
        <Input
          control="form"
          btnValue="Login"
          fields={fields}
          validation={signUpValid}
          formSubmit={e => signupHandler(e)}
        />
        <NavLink to='/login'>login</NavLink>
      </div>
    </Auth>
  );
};

// const [state, setState] = useState({
//   signupForm: {
//     email: {
//       value: "",
//       valid: false,
//       touched: false,
//       validators: [required, email]
//     },
//     password: {
//       value: "",
//       valid: false,
//       touched: false,
//       validators: [required, length({ min: 5 })]
//     },
//     name: {
//       value: "",
//       valid: false,
//       touched: false,
//       validators: [required]
//     },
//     formIsValid: false
//   }
// });
// const inputChangeHandler = (input, value) => {
//   setState(prevState => {
//     let isValid = true;
//     for (const validator of prevState.signupForm[input].validators) {
//       isValid = isValid && validator(value);
//     }
//     const updatedForm = {
//       ...prevState.signupForm,
//       [input]: {
//         ...prevState.signupForm[input],
//         valid: isValid,
//         value: value
//       }
//     };
//     let formIsValid = true;
//     for (const inputName in updatedForm) {
//       formIsValid = formIsValid && updatedForm[inputName].valid;
//     }
//     return {
//       signupForm: updatedForm,
//       formIsValid: formIsValid
//     };
//   });
// };

// const inputBlurHandler = input => {
//   setState(prevState => {
//     return {
//       signupForm: {
//         ...prevState.signupForm,
//         [input]: {
//           ...prevState.signupForm[input],
//           touched: true
//         }
//       }
//     };
//   });
// };

// <form onSubmit={e => props.onSignup(e, state)}>
//           <h1>Welcome Back!</h1>
//           <Input
//             id="email"
//             label="Your E-Mail"
//             type="email"
//             control="input"
//             onChange={inputChangeHandler}
//             onBlur={inputBlurHandler.bind(this, "email")}
//             value={state.signupForm["email"].value}
//             valid={state.signupForm["email"].valid}
//             touched={state.signupForm["email"].touched}
//           />
//           <Input
//             id="name"
//             label="Your Name"
//             type="text"
//             control="input"
//             onChange={inputChangeHandler}
//             onBlur={inputBlurHandler.bind(this, "name")}
//             value={state.signupForm["name"].value}
//             valid={state.signupForm["name"].valid}
//             touched={state.signupForm["name"].touched}
//           />
//           <Input
//             id="password"
//             label="Password"
//             type="password"
//             control="input"
//             onChange={inputChangeHandler}
//             onBlur={inputBlurHandler.bind(this, "password")}
//             value={state.signupForm["password"].value}
//             valid={state.signupForm["password"].valid}
//             touched={state.signupForm["password"].touched}
//           />
//           <Button design="raised" type="submit" loading={props.loading}>
//             Signup
//           </Button>
//         </form>