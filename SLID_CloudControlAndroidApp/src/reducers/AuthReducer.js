import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types";

const INITIAL_STATE = { loading: false, error: '' }
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_START:
            return { ...state, loading: true };
        case LOGIN_SUCCESS:
            return { ...state, loading: false };
        case LOGIN_FAIL:
            return { ...state, loading: false, error: 'Error while creating the request' }
        default:
            return INITIAL_STATE;
    }
}