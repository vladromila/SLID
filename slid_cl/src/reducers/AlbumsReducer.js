import { ADD_ALBUM_SUCCESS } from "../actions/types";

const INITIAL_STATE = { albums: [] };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_ALBUM_SUCCESS:
            return { albums: action.payload };
        default:
            return state;
    }
}