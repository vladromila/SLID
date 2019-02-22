import firebase from 'firebase';
import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL } from './types';

export const login = ({ email, password }) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_START });
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                dispatch({ type: LOGIN_SUCCESS });
            })
            .catch(() => {
                dispatch({ type: LOGIN_FAIL });
            })
    }
}