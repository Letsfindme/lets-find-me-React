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

const token = (state = "", action) => {
  switch (action.type) {
    case "SET_TOK":
      return action.payload;
    default:
      return state;
  }
};

const userId = (state = null, action) => {
  switch (action.type) {
    case "SET_UID":
      return action.payload;
    default:
      return state;
  }
};
const avatar = (state = "", action) => {
  switch (action.type) {
    case "SET_AVATAR":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  isAuthenticated,
  token,
  userId,
  isLoading,
  avatar
});
