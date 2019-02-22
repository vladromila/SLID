import firebase from 'firebase';
import { LOGIN_START, LOGIN_FAIL, LOGIN_SUCCESS } from './types';

export const login = ({ email, password }) => {
    return (dispatch) => {
        dispatch({
            type: LOGIN_START
        })
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                dispatch({ type: LOGIN_SUCCESS })
            })
            .catch((e) => {
                alert(e)
                dispatch({ type: LOGIN_FAIL })
            })
    }
}