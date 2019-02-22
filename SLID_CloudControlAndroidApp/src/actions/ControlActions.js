import firebase from 'firebase';
import { CONTROL_SLIDE_SUCCESS } from './types';
export const controlSlide = (type) => {
    return (dispatch) => {
        firebase.database().ref(`${firebase.auth().currentUser.uid}/controls`)
            .push({ type })
            .then(() => {
                dispatch({ type: CONTROL_SLIDE_SUCCESS });
            })
    }
}