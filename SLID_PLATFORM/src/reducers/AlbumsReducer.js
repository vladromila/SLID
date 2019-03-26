import { ADD_ALBUM_SUCCESS, DELETE_ALBUM_SUCCESS, DELETE_MODAL_POP } from "../actions/types";

const INITIAL_STATE = { albums: [], deleteModalVisible: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_ALBUM_SUCCESS:
            return { ...state, albums: action.payload };
        case DELETE_ALBUM_SUCCESS:
            return { ...state, deleteModalVisible: false };
        case DELETE_MODAL_POP:
            return { ...state, deleteModalVisible: !state.deleteModalVisible }
        default:
            return state;
    }
}