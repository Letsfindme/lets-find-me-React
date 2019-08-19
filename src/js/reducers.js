import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import appReducer from "./reducers/app";
import postsReducer from "./reducers/feed";

const createRootReducer = history =>
    combineReducers({
        router: connectRouter(history),
        app: appReducer,
        feed: postsReducer
    });

export default createRootReducer;
