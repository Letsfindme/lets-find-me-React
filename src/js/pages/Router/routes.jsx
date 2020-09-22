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
import MyPosts from "../Feed/MyPosts/MyPosts";
import Store from "../Store/Store";
import Search from "../Search/Search";
import EditProduct from "../Store/EditProduct";
import Basket from "../Store/Basket";
import Orders from "../Store/Orders";

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
        <Route path="/feed/user-posts" component={MyPosts} />
        <Route path="/store" exact render={props => <Store {...props} />} />
        <Route
          path="/store/edit-products"
          exact
          render={props => <EditProduct {...props} />}
        />
        <Route
          path="/store/basket"
          exact
          render={props => <Basket {...props} />}
        />
        <Route
          path="/store/orders"
          exact
          render={props => <Orders {...props} />}
        />

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
      <div className="home-wrapper -footer">
        <h1>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe quidem
          iure cum? Ut suscipit id fugiat. Nisi velit illo, assumenda nemo unde
          eius modi vero voluptatum voluptas? Aliquid, dolorem sit!
        </h1>
      </div>
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

//   setAuthLoading(true);
//   fetch("https://letsfindme.site/auth/signup", {
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
