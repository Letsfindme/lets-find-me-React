import { combineReducers } from "redux";

const isAuthenticated = (state = false, action) => {
  switch (action.type) {
    case "SET_ISAUTH":
      return action.payload;
    default:
      return state;
  }
};
const isLoading = (state = false, action) => {
  switch (action.type) {
    case "SET_AUTH_LOADING":
      return action.payload;
    default:
      return state;
  }
};

const token = (state = null, action) => {
  switch (action.type) {
    case "SET_TOK":
      return action.payload;
    default:
      return null;
  }
};
const userId = (state = null, action) => {
  switch (action.type) {
    case "SET_UID":
      return action.payload;
    default:
      return null;
  }
};

export default combineReducers({
  isAuthenticated,
  token,
  userId,
  isLoading
});
