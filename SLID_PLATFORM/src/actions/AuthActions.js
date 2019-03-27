import firebase from 'firebase';
import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_GITHUB_SUCCESS, LOGIN_GITHUB_FAIL, LOGIN_GITHUB_START } from './types';

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

export const loginWithGithub = () => {
    let provider = new firebase.auth.GithubAuthProvider();
    return (dispatch) => {
        dispatch({ type: LOGIN_GITHUB_START });
        firebase.auth().signInWithRedirect(provider).then(function (result) {
            dispatch({ type: LOGIN_GITHUB_SUCCESS })
        }).catch(function (error) {
            alert(error.message);
            dispatch({ type: LOGIN_GITHUB_FAIL })
        });
    }
}