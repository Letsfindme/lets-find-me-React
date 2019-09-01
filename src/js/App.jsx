import React, { Fragment, useEffect, useState } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import { useDispatch, useSelector } from "react-redux";
import Routes from "./pages/Router/routes";
import "./App.less";

export default props => {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const getAuth = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {}, []);

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
