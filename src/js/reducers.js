import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import appReducer from "./reducers/app";
import authReducer from "./reducers/auth";
import postsReducer from "./reducers/feed";

const createRootReducer = history =>
    combineReducers({
        router: connectRouter(history),
        app: appReducer,
        auth: authReducer,
        feed: postsReducer
    });

export default createRootReducer;
