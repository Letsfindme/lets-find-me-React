import React, { Fragment, useEffect, useState } from "react";
import {
  Route,
  BrowserRouter,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";
import LoginPage from "../../pages/Auth/Login";
import User from "../../pages/User/User";
import HomePage from "../../pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import { useSelector } from "react-redux";
import AddPost from "../Feed/AddPost/AddPost";
import SinglePost from "../Feed/SinglePost/SinglePost";
import Feed from "../Feed/Feed";
import Store from "../Store/Store";
import Search from "../Search/Search";

const routs = props => {
  const [wasInitialized, setWasInitialized] = useState(false);
  const getAuth = useSelector(state => state.auth.isAuthenticated);
  const getToken = useSelector(state => state.auth.token);

  useEffect(() => {}, [getAuth]);

  useEffect(() => {
    setWasInitialized(true);
  }, [getAuth]);

  return (
    <BrowserRouter>
      {props.children}
      <Switch>
        <Route
          path="/"
          exact
          render={props => <HomePage {...props} />}
          //component={HomePage}
        />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/profile" exact component={User} />
        <Route path="/add" exact component={AddPost} />
        <Route
          path="/feed/search"
          //:city:category
          render={props => <Search {...props} />}
        />
        <Route path="/feed" exact render={props => <Feed {...props} />} />
        <Route path="/store" exact render={props => <Store {...props} />} />
        
        <Route
          path="/feed/:postId"
          exact
          render={props => <SinglePost {...props} token={getToken} />}
        />
        <PrivateRoute
          path="/admin"
          {...props}
          wasInitialized={wasInitialized}
          component={HomePage}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};
export default withRouter(routs);

{
  /* <Route
          path="/signup"
          exact
          render={props => (
            // onSignup={signupHandler}loading={authLoading} 
            <LoginPage signup {...props}/>
          )}
        /> */
}
// const signupHandler = authData => {
//   console.log(props);

//   setAuthLoading(true);
//   fetch("http://localhost:8080/auth/signup", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email: authData.email,
//       password: authData.password,
//       name: authData.name
//     })
//   })
//     .then(res => {
//       if (res.status === 422) {
//         throw new Error(
//           "Validation failed. Make sure the email address isn't used yet!"
//         );
//       }
//       if (res.status !== 200 && res.status !== 201) {
//         console.log("Error!");
//         throw new Error("Creating a user failed!");
//       }
//       return res.json();
//     })
//     .then(resData => {
//       dispatch({ type: "SET_ISAUTH", payload: false });
//       setAuthLoading(false);
//       props.history.push("/");
//     })
//     .catch(err => {
//       console.log(err);
//       dispatch({ type: "SET_AUTH_LOADING", payload: false });
//       setAuthLoading(false);
//       setError(err);
//     });
// };

// const setAutoLogout = milliseconds => {
//   setTimeout(() => {
//     logoutHandler();
//   }, milliseconds);
// };

// const errorHandler = () => {
//   setError(null);
// };

// const logoutHandler = () => {
//   dispatch({ type: "SET_ISAUTH", payload: false });
//   dispatch({ type: "SET_TOK", payload: null });
//   localStorage.removeItem("token");
//   localStorage.removeItem("expiryDate");
//   localStorage.removeItem("userId");
//   props.history.push("/");
// };
