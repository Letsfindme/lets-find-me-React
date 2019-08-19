import { combineReducers } from "redux";

const posts = (state = [], action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return action.payload
        default:
            return state
    }
}
const post = (state = {}, action) => {
    switch (action.type) {
        case 'SET_POST':
            return action.payload
        default:
            return state
    }
}


export default combineReducers({
    posts,
    post
});