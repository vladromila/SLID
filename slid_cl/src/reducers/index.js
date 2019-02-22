import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import AlbumsReducer from "./AlbumsReducer";

export default combineReducers({
    Auth: AuthReducer,
    Albums:AlbumsReducer
})