import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import configureStore, { history } from "./js/store";
import App from "./js/App";
const MOUNT_NODE = document.getElementById("app");
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App/>
    </Router>
  </Provider>,
  MOUNT_NODE
);
