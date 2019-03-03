import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types";

let INITIAL_STATE = { loading: false, error: '', loadingGithub: false, errorGithub: '' };
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_START:
            return { ...state, loading: true };
        case LOGIN_SUCCESS:
            return { ...state, loading: false };
        case LOGIN_FAIL:
            return { ...state, loading: false, error: 'Failed to create the request' };
        default:
            return state;
    }
}