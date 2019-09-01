import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
let getAuth = null;

const PrivateRoute = ({
  component: Component,
  auth,
  wasInitialized,
  ...rest
}) => {
  getAuth = useSelector(state => state.auth.isAuthenticated);
  console.log("rest", rest);

  return (
    <Route
      {...rest}
      render={props =>
        getAuth === true ? (
          <Component {...props} />
        ) : !wasInitialized ? (
          ""
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
