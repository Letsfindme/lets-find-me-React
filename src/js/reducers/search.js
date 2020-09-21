import { combineReducers } from "redux";

const searchVal = (
  state = {
    category: "",
    city: "",
    term: "",
    currentPage: 1
  },
  action
) => {
  switch (action.type) {
    case "SET_SEARCHVAL":
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  searchVal
});
